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
                return {"message": "Grimpeur deleted"}, 200
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

    def post(self):
        json = request.get_json()
        nouv_seance = Clients.Seance()
        for key, value in json.items():
            setattr(nouv_seance, key, value)

        with sesh() as session:
            session.add(nouv_seance)
            session.commit()
            session.refresh(nouv_seance)
            return nouv_seance.to_dict(), 201


class SeancesSearch(Resource):
    def get(self, id):
        with sesh() as session:
            aujourd_hui = date.today()
            seance_auj = (
                session.query(Clients.Seance)
                .filter_by(NumGrimpeur=id, DateSeance=aujourd_hui)
                .one_or_none()
            )
            if seance_auj is None:
                return {"message": "Aucune séance aujourd'hui"}, 404

            else:
                return {"message": "Séance aujourd'hui"}, 200
