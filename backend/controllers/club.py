from flask import request, g
from flask_restful import Resource
from models import Clients
import logging
from sqlalchemy import func
from models import Groupes

logger = logging.getLogger(__name__)

ALLOWED_CLUB_FIELDS = [
    "NomClub", "CodePostClub", "VilleClub", "TelClub",
    "EmailClub", "AdresseClub", "SiteInternet"
]

def validate_club_data(data):
    """Validate club data"""
    errors = []
    if "NomClub" not in data or not str(data["NomClub"]).strip():
        errors.append("NomClub est obligatoire")

    for key, value in data.items():
        if key in ALLOWED_CLUB_FIELDS and isinstance(value, str):
            try:
                col = getattr(Groupes.Club, key)
                if hasattr(col.type, "length") and col.type.length:
                    max_len = col.type.length
                    if len(value) > max_len:
                        errors.append(f"{key} trop long (max {max_len})")
            except AttributeError:
                pass
    return errors


class ClubsListe(Resource):
    def get(self):
        """Get all clubs"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)

            query = g.db_session.query(Groupes.Club).order_by(Groupes.Club.IdClub.desc())
            total = query.count()
            clubs = query.offset(offset).limit(limit).all()
            
            return {
                "data": [c.to_dict() for c in clubs],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching clubs: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def post(self):
        """Create a new club"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "Aucune donnée fournie"}, 400

            errors = validate_club_data(json_data)
            if errors:
                return {"message": errors}, 400

            # Check if club name already exists
            if "NomClub" in json_data:
                nom = json_data["NomClub"].strip()
                existe = g.db_session.query(Groupes.Club).filter_by(NomClub=nom).first()
                if existe:
                    return {"message": "Un club avec ce nom existe déjà"}, 400

            new_club = Groupes.Club()
            for key, value in json_data.items():
                if key in ALLOWED_CLUB_FIELDS and value is not None:
                    setattr(new_club, key, value)

            g.db_session.add(new_club)
            g.db_session.commit()
            g.db_session.refresh(new_club)

            return {
                "message": "Club créé avec succès",
                "club": new_club.to_dict()
            }, 201
        except Exception as e:
            logger.error(f"Error creating club: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la création"}, 500


class ClubResource(Resource):
    def get(self, id):
        """Get a single club by ID"""
        try:
            club = g.db_session.query(Groupes.Club).filter_by(IdClub=id).first()
            if not club:
                return {"message": "Club non trouvé"}, 404
            return club.to_dict(), 200
        except Exception as e:
            logger.error(f"Error fetching club {id}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def put(self, id):
        """Update a club"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "Aucune donnée fournie"}, 400

            club = g.db_session.query(Groupes.Club).filter_by(IdClub=id).first()
            if not club:
                return {"message": "Club non trouvé"}, 404

            # Check if new name exists
            if "NomClub" in json_data:
                nouveau_nom = json_data["NomClub"].strip()
                existe = g.db_session.query(Groupes.Club).filter(
                    Groupes.Club.NomClub == nouveau_nom,
                    Groupes.Club.IdClub != id
                ).first()
                if existe:
                    return {"message": "Un club avec ce nom existe déjà"}, 400

            for key, value in json_data.items():
                if key in ALLOWED_CLUB_FIELDS:
                    setattr(club, key, value)

            g.db_session.commit()
            return club.to_dict(), 200
        except Exception as e:
            logger.error(f"Error updating club {id}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la mise à jour"}, 500

    def delete(self, id):
        """Delete a club"""
        try:
            club = g.db_session.query(Groupes.Club).filter_by(IdClub=id).first()
            if not club:
                return {"message": "Club non trouvé"}, 404

            # Check if club has grimpeurs
            grimpeur_count = g.db_session.query(func.count(Clients.Grimpeur.NumGrimpeur)).filter_by(
                ClubId=id
            ).scalar()
            
            if grimpeur_count > 0:
                return {
                    "message": f"Ce club ne peut pas être supprimé car il contient {grimpeur_count} grimpeur(s)"
                }, 400

            g.db_session.delete(club)
            g.db_session.commit()
            return {"message": "Club supprimé avec succès"}, 200
        except Exception as e:
            logger.error(f"Error deleting club {id}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la suppression"}, 500


class ClubGrimpeurs(Resource):
    def get(self, id):
        """Get all grimpeurs for a club"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)

            club = g.db_session.query(Groupes.Club).filter_by(IdClub=id).first()
            if not club:
                return {"message": "Club non trouvé"}, 404

            query = g.db_session.query(Clients.Grimpeur).filter_by(ClubId=id).order_by(
                Clients.Grimpeur.NumGrimpeur.desc()
            )
            total = query.count()
            grimpeurs = query.offset(offset).limit(limit).all()

            return {
                "club": club.NomClub,
                "grimpeurs": [g.to_dict() for g in grimpeurs],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching grimpeurs for club {id}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500