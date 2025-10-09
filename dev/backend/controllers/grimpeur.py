from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session
from datetime import date
import base64
import os
from sqlalchemy import cast, String

engine = create_engine()
sesh = get_session(engine)
signaturePath = "static/uploads/signatures"


ALLOWED_FIELDS = [
    "NomGrimpeur", "PrenomGrimpeur", "DateNaissGrimpeur", "TelGrimpeur",
    "EmailGrimpeur", "NumLicenceGrimpeur", "Club", "StatutVoie",
    "TypeAbo", "DateFinAbo", "TypeTicket", "NbSeanceRest",
    "DateFinCoti", "AccordReglement", "AccordParental", "CheminSignature", "Note"
]

def validate_grimpeur_data(data):
    errors = []
    required = ["NomGrimpeur", "PrenomGrimpeur"]

    # Champs obligatoires
    for field in required:
        if field not in data or not str(data[field]).strip():
            errors.append(f"{field} est obligatoire")

    # Téléphone
    if "TelGrimpeur" in data and data["TelGrimpeur"]:
        tel = str(data["TelGrimpeur"]).replace(" ", "")
        if not tel.isdigit() or len(tel) < 8:
            errors.append("Numéro de téléphone invalide")

    # Date de naissance
    if "DateNaissGrimpeur" in data and data["DateNaissGrimpeur"]:
        try:
            d = date.fromisoformat(data["DateNaissGrimpeur"])
            if d > date.today():
                errors.append("La date de naissance ne peut pas être dans le futur")
        except Exception:
            errors.append("Date de naissance invalide")

    # Vérifie la longueur max SQL pour les colonnes de type String
    for key, value in data.items():
        if key in ALLOWED_FIELDS and isinstance(value, str):
            col = getattr(Clients.Grimpeur, key)
            if hasattr(col.type, "length") and col.type.length:
                max_len = col.type.length
                if len(value) > max_len:
                    errors.append(f"{key} trop long (max {max_len})")
    return errors

class GrimpeursListe(Resource):
    def get(self):
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)
        with sesh() as session:
            query = session.query(Clients.Grimpeur)
            total = query.count()
            grimpeurs = query.offset(offset).limit(limit).all()
            return {"data": [g.to_dict() for g in grimpeurs], "total": total}, 200



    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Aucune donnée fournie"}, 400

        # Validation avancée
        errors = validate_grimpeur_data(json_data)
        if errors:
            return {"message": errors, "errors": errors}, 400

        nouv_grimp = Clients.Grimpeur()

        for key, value in json_data.items():
            if key in ALLOWED_FIELDS and value is not None:
                setattr(nouv_grimp, key, value)

        with sesh() as session:
            session.add(nouv_grimp)
            session.commit()
            session.refresh(nouv_grimp)
            return {
                "message": "Grimpeur créé avec succès",
                "grimpeur": nouv_grimp.to_dict()
            }, 201

class Grimpeur(Resource):
    def get(self, id):
        with sesh() as session:
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=id).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404
            return grimpeur.to_dict(), 200

    def put(self, id):
        json_data = request.get_json()
        with sesh() as session:
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=id).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404

            for key, value in json_data.items():
                if key in ALLOWED_FIELDS:
                    setattr(grimpeur, key, value)

            session.commit()
            return grimpeur.to_dict(), 200

    def delete(self, id):
        with sesh() as session:
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=id).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404
            session.delete(grimpeur)
            session.commit()
            return {"message": "Grimpeur deleted"}, 200

class GrimpeurAccords(Resource):
    def put(self, id):
        json_data = request.get_json()
        signature_b64 = json_data.get("CheminSignature")
        if not signature_b64:
            return {"message": "Signature manquante"}, 400

        try:
            signature_bytes = base64.b64decode(signature_b64.split(",")[-1])
        except Exception:
            return {"message": "Signature invalide"}, 400

        os.makedirs(signaturePath, exist_ok=True)
        filename = f"grimpeur_{id}_{date.today().isoformat()}.png".replace(" ", "_")
        filepath = os.path.join(signaturePath, filename)

        with open(filepath, "wb") as f:
            f.write(signature_bytes)

        with sesh() as session:
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=id).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404

            grimpeur.CheminSignature = filepath
            grimpeur.has_signed = True

            # Mise à jour des accords optionnels
            def str_to_bool(val): return str(val).lower() in ["true", "1", "yes"]
            accord_reglement = request.args.get("AccordReglement")
            accord_parental = request.args.get("AccordParental")

            if accord_reglement is not None:
                grimpeur.AccordReglement = str_to_bool(accord_reglement)
            if accord_parental is not None:
                grimpeur.AccordParental = str_to_bool(accord_parental)

            session.commit()
            return {
                "message": "Signature enregistrée",
                "CheminSignature": filepath,
                "AccordReglement": grimpeur.AccordReglement,
                "AccordParental": grimpeur.AccordParental,
            }, 200


class GrimpeurSearch(Resource):
    def get(self):
        query_string = request.args.get("query", type=str)
        if not query_string:
            return {"message": "Requête de recherche vide"}, 400

        with sesh() as session:
            if query_string.isdigit():
                # Recherche partielle sur le début du NumGrimpeur
                grimpeurs = (
                    session.query(Clients.Grimpeur)
                    .filter(cast(Clients.Grimpeur.NumGrimpeur, String).startswith(query_string))
                    .all()
                )
            else:
                # Recherche partielle sur nom ou prénom
                grimpeurs = (
                    session.query(Clients.Grimpeur)
                    .filter(
                        Clients.Grimpeur.NomGrimpeur.ilike(f"%{query_string}%") |
                        Clients.Grimpeur.PrenomGrimpeur.ilike(f"%{query_string}%")
                    )
                    .limit(80)
                    .all()
                )

        return [grimpeur.to_dict() for grimpeur in grimpeurs], 200



