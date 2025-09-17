from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session
from datetime import date
import base64
import os

engine = create_engine()
sesh = get_session(engine)


class GrimpeursListe(Resource):
    def get(self):
        with sesh() as session:
            grimpeurs = session.query(Clients.Grimpeur).all()
            return [grimpeur.to_dict() for grimpeur in grimpeurs]

    def post(self):
        json = request.get_json()
        nouv_grimp = Clients.Grimpeur()
        for key, value in json.items():
            setattr(nouv_grimp, key, value)

        with sesh() as session:
            session.add(nouv_grimp)
            session.commit()
            session.refresh(nouv_grimp)
            return nouv_grimp.to_dict(), 201


class Grimpeur(Resource):
    def get(self, id):
        with sesh() as session:
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=id).first()
            if grimpeur:
                return grimpeur.to_dict(), 200
            else:
                return {"message": "Grimpeur not found"}, 404

    def post(self, id):
        json = request.get_json()
        with sesh() as session:
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=id).first()
            if grimpeur:
                for key, value in json.items():
                    setattr(grimpeur, key, value)
                session.commit()
                return grimpeur.to_dict(), 200
            else:
                return {"message": "Grimpeur not found"}, 404

    def delete(self, id):
        with sesh() as session:
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=id).first()
            if grimpeur:
                session.delete(grimpeur)
                session.commit()
                return {"message": "Grimpeur deleted"}, 204
            else:
                return {"message": "Grimpeur not found"}, 404

    def put(self, id):
        json = request.get_json()
        signature_b64 = json.get("signature")
        if not signature_b64:
            return {"message": "Signature manquante"}, 400

        try:
            signature_bytes = base64.b64decode(signature_b64)
        except Exception:
            return {"message": "Signature invalide"}, 400

        signature_dir = "/home/mavert/Documents/Projets/CasaCentral/dev/resources"
        os.makedirs(signature_dir, exist_ok=True)
        filename = f"grimpeur_{id}_{date.today().isoformat()}.png"
        filepath = os.path.join(signature_dir, filename)

        with open(filepath, "wb") as f:
            f.write(signature_bytes)

        # query strings pour AccordReglement et AccordParental
        accord_reglement = request.args.get("AccordReglement", type=bool)
        accord_parental = request.args.get("AccordParental", type=bool)

        with sesh() as session:
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=id).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404
            grimpeur.CheminSignature = filepath
            grimpeur.has_signed = True

            if accord_reglement is not None:
                grimpeur.AccordReglement = accord_reglement
            if accord_parental is not None:
                grimpeur.AccordParental = accord_parental

            session.commit()
            return {
                "message": "Signature enregistrée",
                "path": filepath,
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
