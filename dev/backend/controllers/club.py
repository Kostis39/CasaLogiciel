from flask import request
from flask_restful import Resource
from models import Groupes, Clients
from db import create_engine, get_session
from sqlalchemy import func

engine = create_engine()
sesh = get_session(engine)

ALLOWED_FIELDS = [
    "NomClub", "CodePostClub", "VilleClub", "TelClub",
    "EmailClub", "AdresseClub", "SiteInternet"
]

def validate_club_data(data):
    """Validation basique des champs du club"""
    errors = []

    # Champs obligatoires
    if "NomClub" not in data or not str(data["NomClub"]).strip():
        errors.append("NomClub est obligatoire")

    # Vérifie la longueur max SQL pour les colonnes de type String
    for key, value in data.items():
        if key in ALLOWED_FIELDS and isinstance(value, str):
            col = getattr(Groupes.Club, key)
            if hasattr(col.type, "length") and col.type.length:
                max_len = col.type.length
                if len(value) > max_len:
                    errors.append(f"{key} trop long (max {max_len})")
    return errors


class ClubsListe(Resource):
    def get(self):
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        with sesh() as session:
            query = session.query(Groupes.Club)
            total = query.count()
            clubs = query.offset(offset).limit(limit).all()
            return {"data": [c.to_dict() for c in clubs], "total": total}, 200

    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Aucune donnée fournie"}, 400

        errors = validate_club_data(json_data)
        if errors:
            return {"message": errors, "errors": errors}, 400

        new_club = Groupes.Club()
        for key, value in json_data.items():
            if key in ALLOWED_FIELDS and value is not None:
                setattr(new_club, key, value)

        with sesh() as session:
            session.add(new_club)
            session.commit()
            session.refresh(new_club)
            return {
                "message": "Club créé avec succès",
                "club": new_club.to_dict()
            }, 201


class ClubResource(Resource):
    def get(self, id):
        with sesh() as session:
            club = session.query(Groupes.Club).filter_by(IdClub=id).first()
            if not club:
                return {"message": "Club non trouvé"}, 404
            return club.to_dict(), 200

    def put(self, id):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Aucune donnée fournie"}, 400

        with sesh() as session:
            club = session.query(Groupes.Club).filter_by(IdClub=id).first()
            if not club:
                return {"message": "Club non trouvé"}, 404

            for key, value in json_data.items():
                if key in ALLOWED_FIELDS:
                    setattr(club, key, value)

            session.commit()
            return club.to_dict(), 200

    def delete(self, id):
        with sesh() as session:
            club = session.query(Groupes.Club).filter_by(IdClub=id).first()
            if not club:
                return {"message": "Club non trouvé"}, 404

            # 🔍 Vérifie s'il existe des grimpeurs liés à ce club
            grimpeur_count = session.query(func.count(Clients.Grimpeur.NumGrimpeur)).filter_by(ClubId=id).scalar()
            if grimpeur_count > 0:
                return {"message": "Ce club ne peut pas être supprimé car il contient des grimpeurs"}, 400

            session.delete(club)
            session.commit()
            return {"message": "Club supprimé avec succès"}, 200


class ClubGrimpeurs(Resource):
    def get(self, id):
        with sesh() as session:
            club = session.query(Groupes.Club).filter_by(IdClub=id).first()
            if not club:
                return {"message": "Club non trouvé"}, 404

            grimpeurs = session.query(Clients.Grimpeur).filter_by(ClubId=id).all()
            return {
                "club": club.NomClub,
                "grimpeurs": [g.to_dict() for g in grimpeurs],
                "total": len(grimpeurs)
            }, 200
