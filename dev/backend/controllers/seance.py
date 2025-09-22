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
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=idgrimpeur).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404

            # Vérification abonnement ou tickets
            if (grimpeur.DateFinAbo is None or grimpeur.DateFinAbo <= date.today()) and grimpeur.NbSeanceRest <= 0:
                return {"message": "Le grimpeur n'a pas d'entrée valide"}, 403
            else:
                if grimpeur.NbSeanceRest > 0:
                    grimpeur.NbSeanceRest -= 1
                    nouv_seance.TypeEntree = "Ticket"
                elif grimpeur.DateFinAbo >= date.today():
                    nouv_seance.TypeEntree = "Abonnement"

            # Création de la séance
            nouv_seance.NumGrimpeur = idgrimpeur
            nouv_seance.DateSeance = date_seance
            nouv_seance.HeureSeance = heure_seance

            session.add(nouv_seance)
            session.commit()  # ici le commit met à jour à la fois la séance et le NbSeanceRest
            session.refresh(nouv_seance)

        return {"message": "Séance crée via " + nouv_seance.TypeEntree}, 201


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

            # Si la séance était payée avec un ticket, on remet 1 séance restante
            if getattr(seance_auj, "TypeEntree", None) == "Ticket":
                grimpeur.NbSeanceRest += 1

            # Suppression de la séance
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
            