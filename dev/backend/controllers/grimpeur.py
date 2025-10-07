from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session
from datetime import date
import base64
import os

engine = create_engine()
sesh = get_session(engine)
signaturePath = "static/uploads/signatures"


ALLOWED_FIELDS = [
    "NomGrimpeur", "PrenomGrimpeur", "DateNaissGrimpeur", "TelGrimpeur",
    "EmailGrimpeur", "NumLicenceGrimpeur", "Club", "StatutVoie",
    "TypeAbo", "DateFinAbo", "TypeTicket", "NbSeanceRest",
    "DateFinCoti", "AccordReglement", "AccordParental", "CheminSignature", "Note"
]

class GrimpeursListe(Resource):
    def get(self):
        with sesh() as session:
            grimpeurs = session.query(Clients.Grimpeur).all()
            return [g.to_dict() for g in grimpeurs], 200

    def post(self):
        json_data = request.get_json()
        nouv_grimp = Clients.Grimpeur()

        for key, value in json_data.items():
            if key in ALLOWED_FIELDS:
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
                grimpeurs = (
                    session.query(Clients.Grimpeur).filter_by(
                        NumGrimpeur=int(query_string)
                    )
                ).all()
            else:
                grimpeurs = (
                    session.query(Clients.Grimpeur).filter(
                        Clients.Grimpeur.NomGrimpeur.ilike(f"%{query_string}%")
                        | Clients.Grimpeur.PrenomGrimpeur.ilike(f"%{query_string}%")
                    )
                ).limit(80)
        return [grimpeur.to_dict() for grimpeur in grimpeurs], 200
