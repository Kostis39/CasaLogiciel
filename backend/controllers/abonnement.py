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

                # Vérifie si l'abonnement est utilisé dans une transaction
                transaction_first = (
                    session.query(Clients.Transaction)
                    .filter_by(TypeObjet="abonnement", IdObjet=id)
                    .first()
                )
                transaction_count = (
                    session.query(Clients.Transaction)
                    .filter_by(TypeObjet="abonnement", IdObjet=id)
                    .count()
                )

                # Vérifie si l'abonnement est attribué à un grimpeur
                grimpeur_first = (
                    session.query(Clients.Grimpeur)
                    .filter_by(AboId=id)
                    .first()
                )
                grimpeur_count = (
                    session.query(Clients.Grimpeur)
                    .filter_by(AboId=id)
                    .count()
                )

                # Vérifie si l'abonnement est utilisé dans une séance
                seance_first = (
                    session.query(Clients.Seance)
                    .filter_by(AboId=id)
                    .first()
                )
                seance_count = (
                    session.query(Clients.Seance)
                    .filter_by(AboId=id)
                    .count()
                )

                if transaction_first:
                    return {
                        "message": (
                            f"Impossible de supprimer l'abonnement ({id}) : il a déjà été utilisé "
                            f"dans {transaction_count} transaction(s), première transaction ID = {transaction_first.IdTransac}."
                        )
                    }, 400

                if grimpeur_first:
                    return {
                        "message": (
                            f"Impossible de supprimer l'abonnement ({id}) : il est attribué à "
                            f"{grimpeur_count} grimpeur(s), premier grimpeur NumGrimpeur = {grimpeur_first.NumGrimpeur}."
                        )
                    }, 400

                if seance_first:
                    return {
                        "message": (
                            f"Impossible de supprimer l'abonnement ({id}) : il est utilisé dans "
                            f"{seance_count} séance(s), première séance ID = {seance_first.IdSeance}."
                        )
                    }, 400


                # Si non utilisé → suppression autorisée
                session.delete(abo)
                session.commit()
                return {"message": "Abonnement supprimé avec succès."}, 200
