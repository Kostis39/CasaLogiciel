"""Authentification de l'API CasaLogiciel.

Mot de passe unique partagé (même valeur que NEXT_PUBLIC_PASSWORD côté frontend),
échangé au login contre un token signé et limité dans le temps (itsdangerous).

Toutes les routes sont protégées par un hook before_request, SAUF :
  - POST /login
  - GET /favicon.ico
  - les préflights CORS (OPTIONS)

Les fichiers statiques (signatures) sont également protégés : le frontend
doit les récupérer via authFetch avec le header Authorization.
"""
import hmac
import logging
import os
import time
from datetime import datetime, timedelta, timezone
from functools import wraps

from flask import g, jsonify, request
from flask_restful import Resource
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

logger = logging.getLogger(__name__)

TOKEN_MAX_AGE_SECONDS = 24 * 3600  # validité du token : 24 h
LOGIN_MAX_ATTEMPTS = 5             # tentatives de login échouées par fenêtre
LOGIN_WINDOW_SECONDS = 300         # fenêtre de 5 minutes

# Rate limiting login en mémoire : {ip: [timestamps des échecs]}
_login_attempts: dict[str, list[float]] = {}

_auth_password = os.getenv("AUTH_PASSWORD") or None
_auth_secret = os.getenv("AUTH_SECRET") or None

if _auth_password is None:
    logger.warning(
        "AUTH_PASSWORD non défini : le login échouera systématiquement "
        "(définir AUTH_PASSWORD, même valeur que NEXT_PUBLIC_PASSWORD)."
    )

if _auth_secret:
    _serializer = URLSafeTimedSerializer(_auth_secret, salt="casalogiciel-auth")
else:
    logger.warning(
        "AUTH_SECRET non défini : un secret aléatoire est généré au démarrage. "
        "Les tokens seront invalidés à chaque redémarrage du backend."
    )
    _serializer = URLSafeTimedSerializer(
        __import__("os").urandom(32), salt="casalogiciel-auth"
    )


def issue_token() -> dict:
    """Crée un token signé lié à l'heure courante."""
    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + timedelta(seconds=TOKEN_MAX_AGE_SECONDS)
    token = _serializer.dumps({"sub": "casa", "iat": int(issued_at.timestamp())})
    return {"token": token, "expires_at": expires_at.isoformat()}


# --------------------------------------------------------------------------
# Rate limiting login (en mémoire, par IP)
# --------------------------------------------------------------------------
def _purge_window(ip: str) -> None:
    now = time.time()
    window = [
        t for t in _login_attempts.get(ip, [])
        if now - t < LOGIN_WINDOW_SECONDS
    ]
    _login_attempts[ip] = window


def login_rate_limited(ip: str) -> bool:
    _purge_window(ip)
    return len(_login_attempts.get(ip, [])) >= LOGIN_MAX_ATTEMPTS


def register_failed_login(ip: str) -> None:
    _purge_window(ip)
    _login_attempts.setdefault(ip, []).append(time.time())


def verify_login_password(candidate: str) -> bool:
    """Comparaison à temps constant du mot de passe."""
    if not _auth_password:
        return False
    return hmac.compare_digest(str(candidate), str(_auth_password))


def _verify_bearer_token(token: str):
    """Retourne (ok, erreur_json) pour un token Bearer."""
    try:
        data = _serializer.loads(token, max_age=TOKEN_MAX_AGE_SECONDS)
        g.auth = data
        return True, None
    except SignatureExpired:
        return False, (
            jsonify({"message": "Session expirée, reconnectez-vous"}), 401
        )
    except BadSignature:
        return False, (jsonify({"message": "Token invalide"}), 401)


def register_auth_protection(app):
    """Protège toutes les routes de l'app sauf /login et /favicon.ico.

    À appeler APRÈS app = Flask(...) et avant l'enregistrement des routes.
    Les fichiers statiques Flask (/static/*, dont les signatures) sont
    également protégés.
    """

    @app.before_request
    def _auth_guard():
        # Laisser passer les préflights CORS (pas de header Authorization dessus)
        if request.method == "OPTIONS":
            return None

        # Routes publiques
        if request.path in ("/login", "/favicon.ico"):
            return None

        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            ok, error_response = _verify_bearer_token(header[7:].strip())
            if ok:
                return None
            return error_response

        return (
            jsonify({"message": "Authentification requise"}),
            401,
            {"WWW-Authenticate": "Bearer"},
        )


def require_auth(fn):
    """Décorateur optionnel pour protéger une route spécifique.

    La protection globale (register_auth_protection) couvre déjà toutes les
    routes ; ce décorateur est utile pour un usage ponctuel ou des tests.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            ok, error_response = _verify_bearer_token(header[7:].strip())
            if ok:
                return fn(*args, **kwargs)
            return error_response
        return (
            jsonify({"message": "Authentification requise"}),
            401,
            {"WWW-Authenticate": "Bearer"},
        )
    return wrapper


class LoginResource(Resource):
    """POST /login — échange le mot de passe partagé contre un token."""

    def post(self):
        data = request.get_json(silent=True) or {}
        password = str(data.get("password", ""))
        ip = request.remote_addr or "unknown"

        if login_rate_limited(ip):
            logger.warning(f"Rate limit login atteint pour {ip}")
            return (
                {"message": "Trop de tentatives, réessayez dans quelques minutes"},
                429,
            )

        if not _auth_password:
            logger.error("Tentative de login sans AUTH_PASSWORD configuré")
            return {"message": "Authentification non configurée côté serveur"}, 503

        if verify_login_password(password):
            payload = issue_token()
            logger.info("Login réussi")
            return {"message": "Connexion réussie", **payload}, 200

        register_failed_login(ip)
        logger.warning(f"Login échoué depuis {ip}")
        return {"message": "Mot de passe incorrect"}, 401
