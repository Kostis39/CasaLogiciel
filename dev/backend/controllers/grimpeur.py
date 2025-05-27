from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session
from datetime import date

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
                ).all()
        return [grimpeur.to_dict() for grimpeur in grimpeurs], 200


class Seances(Resource):
    def get(self):
        with sesh() as session:
            seances = session.query(Clients.Seance).all()
            return [seance.to_dict() for seance in seances]

    def post(self):  # Penser à ajouter de la vérification de validité des données
        json = request.get_json()
        nouv_seance = Clients.Seance()

        # Vérification de l'existence du grimpeur
        with sesh() as session:
            grimpeur = (
                session.query(Clients.Grimpeur)
                .filter_by(NumGrimpeur=json.get("NumGrimpeur"))
                .first()
            )
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404

        # Maintenant on vérifie que le grimpeur peut accéder à la salle
        # C'est à dire qu'il a un abonnement valide ou des séances restantes

        if not grimpeur.AccordReglement:
            return {"message": "Le grimpeur doit signer le règlement"}, 403

        # Si l'abonnement est inexistant ou expiré, on vérifie les séances restantes
        if grimpeur.DateFinAbo is None or grimpeur.DateFinAbo <= date.today():
            if grimpeur.NbSeancesRest <= 0:
                return {"message": "Le grimpeur n'a pas d'entrée valide"}, 403
            else:
                grimpeur.NbSeancesRest -= 1

        for key, value in json.items():
            setattr(nouv_seance, key, value)

        with sesh() as session:
            session.add(nouv_seance)
            session.commit()
            session.refresh(nouv_seance)
            return nouv_seance.to_dict(), 201


class SeancesSearch(Resource):
    def get(self, idGrimpeur):
        with sesh() as session:
            grimpeur = (
                session.query(Clients.Grimpeur)
                .filter_by(NumGrimpeur=idGrimpeur)
                .first()
            )
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404

            aujourd_hui = date.today()
            seance_auj = (
                session.query(Clients.Seance)
                .filter_by(NumGrimpeur=id, DateSeance=aujourd_hui)
                .one_or_none()
            )
            return {"est_la": seance_auj is not None}, 200
