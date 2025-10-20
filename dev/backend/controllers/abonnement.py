from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session

engine = create_engine()
sesh = get_session(engine)

class Abonnements(Resource):
    def get(self):
        with sesh() as session:
            abos = session.query(Clients.Abonnement).all()
            return [abo.to_dict() for abo in abos], 200

    def post(self):
        json = request.get_json()
        if json is None:
            return {"message": "No JSON data provided"}, 400

        nouvel_abo = Clients.Abonnement()
        for key, value in json.items():
            setattr(nouvel_abo, key, value)

        with sesh() as session:
            session.add(nouvel_abo)
            session.commit()
            session.refresh(nouvel_abo)
            return nouvel_abo.to_dict(), 201


class Abonnement(Resource):
    def get(self, id):
        with sesh() as session:
            abo = session.query(Clients.Abonnement).filter_by(IdAbo=id).first()
            if abo:
                return abo.to_dict(), 200
            else:
                return {"message": "Abonnement not found"}, 404

    def put(self, id):
        json_data = request.get_json()
        if not json_data:
            return {"message": "No input data provided"}, 400

        with sesh() as session:
            abo = session.query(Clients.Abonnement).filter_by(IdAbo=id).first()
            if not abo:
                return {"message": "Abonnement not found"}, 404

            for key, value in json_data.items():
                if hasattr(abo, key):
                    setattr(abo, key, value)

            session.commit()
            return abo.to_dict(), 200

    def delete(self, id):
            with sesh() as session:
                # On cherche l'abonnement
                abo = session.query(Clients.Abonnement).filter_by(IdAbo=id).first()
                if not abo:
                    return {"message": "Abonnement not found"}, 404

                # Vérifier si cet abonnement a été utilisé dans une transaction
                transaction_exist = (
                    session.query(Clients.Transaction)
                    .filter_by(TypeObjet="abonnement", IdObjet=id)
                    .first()
                )

                if transaction_exist:
                    return {
                        "message": "Impossible de supprimer cet abonnement : il a déjà été utilisé dans une transaction."
                    }, 400

                # Si non utilisé → suppression autorisée
                session.delete(abo)
                session.commit()
                return {"message": "Abonnement supprimé avec succès."}, 200
