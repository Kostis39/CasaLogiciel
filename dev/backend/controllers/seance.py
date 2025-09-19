from datetime import date, datetime
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

        if not idgrimpeur:
            return {"message": "Missing NumGrimpeur in JSON data"}, 400

        # On récupère la date et l'heure du serveur
        now = datetime.now()
        date_seance = now.date()
        heure_seance = now.time()

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

        # Vérification du règlement
        if not grimpeur.AccordReglement:
            return {"message": "Le grimpeur doit signer le règlement"}, 403

        # Vérification cotisation
        if grimpeur.DateFinCoti is None or grimpeur.DateFinCoti < date.today():
            return {"message": "Le grimpeur n'est pas cotisant"}, 403

        # Vérification abonnement ou tickets
        if grimpeur.DateFinAbo is None or grimpeur.DateFinAbo <= date.today():
            if grimpeur.NbSeanceRest <= 0:
                return {"message": "Le grimpeur n'a pas d'entrée valide"}, 403
            else:
                grimpeur.NbSeanceRest -= 1
                nouv_seance.TypeEntree = "Ticket"

        nouv_seance.NumGrimpeur = idgrimpeur
        nouv_seance.DateSeance = date_seance
        nouv_seance.HeureSeance = heure_seance

        with sesh() as session:
            session.add(nouv_seance)
            session.commit()
            session.refresh(nouv_seance)
            return nouv_seance.to_dict(), 201
        
    def delete(self, IdSeance):
        with sesh() as session:
            seance = session.query(Clients.Seance).filter_by(IdSeance=IdSeance).first()

            if not seance:
                return {"message": f"Aucune séance trouvée avec IdSeance {IdSeance}"}, 404

            session.delete(seance)
            session.commit()
            return {"message": f"Séance {IdSeance} supprimée avec succès"}, 200

class SeancesSearch(Resource):
    def get(self, idGrimpeur):
        with sesh() as session:
            grimpeur = (
                session.query(Clients.Grimpeur)
                .filter_by(NumGrimpeur=idGrimpeur)
                .first()
            )
            if not grimpeur:
                return {"message": "Seane of Grimpeur not found"}, 404

            aujourd_hui = date.today()
            seance_auj = (
                session.query(Clients.Seance)
                .filter_by(NumGrimpeur=idGrimpeur, DateSeance=aujourd_hui)
                .one_or_none()
            )
            return {"est_la": seance_auj is not None}, 200

    def delete(self, idGrimpeur):
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
                .filter_by(NumGrimpeur=idGrimpeur, DateSeance=aujourd_hui)
                .one_or_none()
            )

            if not seance_auj:
                return {"message": "Aucune séance à supprimer"}, 404

            # Suppression
            session.delete(seance_auj)
            session.commit()
            return {"message": "Séance supprimée avec succès"}, 200

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
            