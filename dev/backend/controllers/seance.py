from datetime import date
from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session

engine = create_engine()
sesh = get_session(engine)


class Seances(Resource):
    def get(self):
        with sesh() as session:
            seances = session.query(Clients.Seance).all()
            return [seance.to_dict() for seance in seances]

    def post(self):  # Penser à ajouter de la vérification de validité des données
        json = request.get_json()
        idgrimpeur = json.get("NumGrimpeur")
        date = json.get("DateSeance")
        heure = json.get("HeureSeance")
        if not idgrimpeur or not date or not heure:
            return {"message": "Missing field(s) in  JSON data"}, 400

        nouv_seance = Clients.Seance()

        # Vérification de l'existence du grimpeur
        with sesh() as session:
            grimpeur = (
                session.query(Clients.Grimpeur)
                .filter_by(NumGrimpeur=idgrimpeur)
                .first()
            )
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404

        # Maintenant on vérifie que le grimpeur peut accéder à la salle
        # C'est à dire qu'il a un abonnement valide ou des séances restantes

        if not grimpeur.AccordReglement:
            return {"message": "Le grimpeur doit signer le règlement"}, 403
        
        if grimpeur.DateFinCoti is None or grimpeur.DateFinCoti < date.today():
            return {"message": "Le grimpeur n'est pas cotisant"}, 403


        # Si l'abonnement est inexistant ou expiré, on vérifie les séances restantes
        if grimpeur.DateFinAbo is None or grimpeur.DateFinAbo <= date.today():
            if grimpeur.NbSeanceRest <= 0:
                return {"message": "Le grimpeur n'a pas d'entrée valide"}, 403
            else:
                grimpeur.NbSeanceRest -= 1
                nouv_seance.TypeEntree = "Ticket"

        nouv_seance.NumGrimpeur = idgrimpeur
        nouv_seance.DateSeance = date
        nouv_seance.HeureSeance = heure

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

class SeancesByDate(Resource): # Ressource pour filtrer les séances par date
    def get(self):
        date_debut = request.args.get("date_debut") # Si date_fin est fourni, on filtre entre les deux dates sinon c'est la date du jour précisé
        date_fin = request.args.get("date_fin")
        with sesh() as session:
            query = session.query(Clients.Seance)
            if date_debut and date_fin:
                query = query.filter(
                    Clients.Seance.DateSeance >= date_debut,
                    Clients.Seance.DateSeance <= date_fin
                )
            elif date_debut:
                query = query.filter(Clients.Seance.DateSeance == date_debut)
            seances = query.all()
            return [seance.to_dict() for seance in seances], 200
            
