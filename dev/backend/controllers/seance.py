from datetime import date, datetime
from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session

engine = create_engine()
sesh = get_session(engine)


class Seances(Resource):
    """Gestion des séances (liste, création, suppression)"""

    def get(self):
        """Récupère toutes les séances avec pagination"""
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        with sesh() as session:
            query = session.query(Clients.Seance)
            total = query.count()
            seances = query.offset(offset).limit(limit).all()

            if not seances:
                return {"message": "Aucune séance trouvée."}, 404

            return {"data": [s.to_dict() for s in seances], "total": total}, 200

    def post(self):
        """Crée une nouvelle séance pour un grimpeur"""
        json = request.get_json()
        id_grimpeur = json.get("NumGrimpeur")

        if not id_grimpeur:
            return {"message": "Le champ 'NumGrimpeur' est requis."}, 400

        now = datetime.now()
        date_seance = now.date()
        heure_seance = now.time()

        nouvelle_seance = Clients.Seance()

        with sesh() as session:
            grimpeur = session.query(Clients.Grimpeur).filter_by(NumGrimpeur=id_grimpeur).first()
            if not grimpeur:
                return {"message": "Grimpeur introuvable."}, 404

            # Vérifie si le grimpeur a un abonnement ou des tickets valides
            if (grimpeur.DateFinAbo is None or grimpeur.DateFinAbo <= date.today()) and grimpeur.NbSeanceRest <= 0:
                return {"message": "Le grimpeur n’a pas d’entrée valide."}, 403
            else:
                if grimpeur.DateFinAbo and grimpeur.DateFinAbo >= date.today():
                    # Vérifie qu'il n’a pas déjà une séance aujourd’hui
                    seance_exist = session.query(Clients.Seance).filter_by(
                        NumGrimpeur=id_grimpeur, DateSeance=date_seance
                    ).first()
                    if seance_exist:
                        return {"message": "Une séance d’abonnement existe déjà aujourd’hui."}, 403
                    nouvelle_seance.TypeEntree = "Abonnement"
                elif grimpeur.NbSeanceRest > 0:
                    grimpeur.NbSeanceRest -= 1
                    nouvelle_seance.TypeEntree = "Ticket"

            nouvelle_seance.NumGrimpeur = id_grimpeur
            nouvelle_seance.DateSeance = date_seance
            nouvelle_seance.HeureSeance = heure_seance

            session.add(nouvelle_seance)
            session.commit()
            session.refresh(nouvelle_seance)

        return {"message": f"Séance créée via {nouvelle_seance.TypeEntree}."}, 201


class SeancesById(Resource):
    """GET /seances/id/<id_seance> — Récupère une séance précise"""
    def get(self, id_seance):
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        with sesh() as session:
            query = session.query(Clients.Seance).filter_by(IdSeance=id_seance)
            total = query.count()
            seances = query.offset(offset).limit(limit).all()

            if not seances:
                return {"message": f"Aucune séance trouvée avec l’identifiant {id_seance}."}, 404

            return {"data": [s.to_dict() for s in seances], "total": total}, 200

    def delete(self, id_seance):
        """Supprime une séance spécifique par son identifiant."""
        with sesh() as session:
            seance = session.get(Clients.Seance, id_seance)
            if not seance:
                return {"message": f"Aucune séance trouvée avec l’identifiant {id_seance}."}, 404
            session.delete(seance)
            session.commit()
            return {"message": f"Séance {id_seance} supprimée avec succès."}, 200


class SeancesByGrimpeur(Resource):
    """GET /seances/grimpeur/<num_grimpeur> — Récupère les séances d’un grimpeur"""
    def get(self, num_grimpeur):
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        with sesh() as session:
            query = session.query(Clients.Seance).filter_by(NumGrimpeur=num_grimpeur)
            total = query.count()
            seances = query.offset(offset).limit(limit).all()

            if not seances:
                return {"message": f"Aucune séance trouvée pour le grimpeur {num_grimpeur}."}, 404

            return {"data": [s.to_dict() for s in seances], "total": total}, 200


class SeancesByDate(Resource):
    """GET /seances/date/<date_str> — Récupère les séances à une date donnée"""
    def get(self, date_str):
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        with sesh() as session:
            query = session.query(Clients.Seance).filter_by(DateSeance=date_str)
            total = query.count()
            seances = query.offset(offset).limit(limit).all()

            if not seances:
                return {"message": f"Aucune séance trouvée pour la date {date_str}."}, 404

            return {"data": [s.to_dict() for s in seances], "total": total}, 200
