/**
 * Authentification côté client pour l'API CasaLogiciel.
 *
 * Le mot de passe (partagé, défini dans NEXT_PUBLIC_PASSWORD) est envoyé au
 * backend via POST /login qui renvoie un token signé (24 h). Ce token est
 * stocké en localStorage et envoyé dans le header Authorization de chaque
 * requête via authFetch().
 */

const AUTH_TOKEN_KEY = "authToken";
const AUTH_EXPIRES_KEY = "authExpiresAt";
const API_PASSWORD = process.env.NEXT_PUBLIC_PASSWORD;

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const expiresStr = window.localStorage.getItem(AUTH_EXPIRES_KEY);

  if (!token) return null;

  // Si une date d'expiration est fournie par le backend, la vérifier
  if (expiresStr) {
    const expires = new Date(expiresStr).getTime();
    if (Number.isNaN(expires) || Date.now() >= expires) {
      clearAuth();
      return null;
    }
  }
  return token;
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_EXPIRES_KEY);
  // Ancien mécanisme (remplacé par le token serveur)
  window.localStorage.removeItem("isAuthenticated");
  window.localStorage.removeItem("authDate");
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * Échange le mot de passe contre un token signé par le backend.
 * Jette AuthError si les identifiants sont refusés.
 */
export async function login(): Promise<void> {
  const response = await fetch(`${getApiUrl()}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: API_PASSWORD }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.token) {
    clearAuth();
    throw new AuthError(
      data.message || `Échec de connexion (${response.status})`,
      response.status
    );
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  if (data.expires_at) {
    window.localStorage.setItem(AUTH_EXPIRES_KEY, data.expires_at);
  }
}

export function isBackendAuthenticated(): boolean {
  return getStoredToken() !== null;
}

function getApiUrl(): string {
  const url: string | undefined =
    process.env.NEXT_PUBLIC_ENV == "prod"
      ? process.env.NEXT_PUBLIC_API_URL_PROD
      : process.env.NEXT_PUBLIC_API_URL_DEV;
  if (!url) {
    throw new Error(
      "URL de l'API non configurée (NEXT_PUBLIC_API_URL_PROD ou NEXT_PUBLIC_API_URL_DEV)"
    );
  }
  return url;
}

type FetchInput = string | URL | Request;

/**
 * fetch avec le header Authorization automatique.
 *
 * - Ajoute le token si présent (login déjà fait).
 * - Sinon tente un login silencieux avec NEXT_PUBLIC_PASSWORD (l'utilisateur
 *   a déjà passé l'écran de login frontend).
 * - Sur 401 après retry : jette AuthError.
 */
export async function authFetch(
  input: FetchInput,
  init?: RequestInit
): Promise<Response> {
  let request = new Request(input, init);
  const token = getStoredToken();

  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(request);
    if (response.status !== 401) return response;
    // Token expiré/invalide → tentative de re-login ci-dessous
  }

  // Login silencieux puis retry (1 seule fois pour éviter les boucles)
  const newToken = await silentLogin();
  request = new Request(input, init);
  request.headers.set("Authorization", `Bearer ${newToken}`);
  const response = await fetch(request);
  if (response.status === 401) {
    throw new AuthError("Session expirée, rechargement nécessaire", 401);
  }
  return response;
}

let loginPromise: Promise<string> | null = null;

/** Login silencieux, mutualisé si plusieurs appels simultanés. */
async function silentLogin(): Promise<string> {
  if (!loginPromise) {
    loginPromise = (async () => {
      try {
        await login();
      } finally {
        loginPromise = null;
      }
      const token = getStoredToken();
      if (!token) {
        throw new AuthError("Authentification impossible", 401);
      }
      return token;
    })();
  }
  return loginPromise;
}
