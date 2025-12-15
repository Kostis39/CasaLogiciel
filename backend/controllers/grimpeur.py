from flask import request, g
from flask_restful import Resource
from models import Clients, Groupes
from datetime import date
import base64
import os
from sqlalchemy import or_, and_, cast, String
import logging

logger = logging.getLogger(__name__)
signaturePath = "static/uploads/signatures"

ALLOWED_FIELDS = [
    "NomGrimpeur", "PrenomGrimpeur", "DateNaissGrimpeur", "TelGrimpeur",
    "EmailGrimpeur", "NumLicenceGrimpeur", "ClubId", "StatutVoie",
    "TypeAbo", "DateFinAbo", "TypeTicket", "NbSeanceRest",
    "DateFinCoti", "AccordReglement", "AccordParental", "CheminSignature", "Note",
    "TicketId", "AboId", "DateInscrGrimpeur"
]

def validate_grimpeur_data(data):
    """Validate grimpeur data"""
    errors = []
    required = ["NomGrimpeur", "PrenomGrimpeur"]

    # Required fields
    for field in required:
        if field not in data or not str(data[field]).strip():
            errors.append(f"{field} est obligatoire")

    # Phone number
    if "TelGrimpeur" in data and data["TelGrimpeur"]:
        tel = str(data["TelGrimpeur"]).replace(" ", "")
        if not tel.isdigit() or len(tel) < 8:
            errors.append("Numéro de téléphone invalide")

    # Birth date
    if "DateNaissGrimpeur" in data and data["DateNaissGrimpeur"]:
        try:
            d = date.fromisoformat(data["DateNaissGrimpeur"])
            if d > date.today():
                errors.append("La date de naissance ne peut pas être dans le futur")
        except Exception:
            errors.append("Date de naissance invalide")

    # Check SQL column length limits
    for key, value in data.items():
        if key in ALLOWED_FIELDS and isinstance(value, str):
            try:
                col = getattr(Clients.Grimpeur, key)
                if hasattr(col.type, "length") and col.type.length:
                    max_len = col.type.length
                    if len(value) > max_len:
                        errors.append(f"{key} trop long (max {max_len})")
            except AttributeError:
                pass
    
    return errors


class GrimpeursListe(Resource):
    def get(self):
        """Get list of grimpeurs with pagination"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            # Validate pagination params
            limit = min(limit, 100)  # Max 100 per request
            offset = max(offset, 0)

            # Use request-scoped session from app context (from api.py)
            query = g.db_session.query(Clients.Grimpeur).order_by(
                Clients.Grimpeur.NumGrimpeur.desc()
            )
            total = query.count()
            grimpeurs = query.offset(offset).limit(limit).all()
            
            return {
                "data": [g.to_dict() for g in grimpeurs],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching grimpeurs: {e}")
            return {"message": "Erreur lors de la récupération des grimpeurs"}, 500

    def post(self):
        """Create a new grimpeur"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "Aucune donnée fournie"}, 400

            # Validation
            errors = validate_grimpeur_data(json_data)
            if errors:
                return {"message": errors}, 400

            # Verify ClubId exists in Club table (if provided)
            club_id = json_data.get("ClubId")
            if club_id is not None:
                club_exists = g.db_session.query(Groupes.Club).filter_by(
                    IdClub=club_id
                ).first()
                if not club_exists:
                    return {
                        "message": f"ClubId {club_id} n'existe pas"
                    }, 400

            # Create new grimpeur
            nouv_grimp = Clients.Grimpeur()
            for key, value in json_data.items():
                if key in ALLOWED_FIELDS and value is not None:
                    setattr(nouv_grimp, key, value)

            g.db_session.add(nouv_grimp)
            g.db_session.commit()
            g.db_session.refresh(nouv_grimp)
            
            return {
                "message": "Grimpeur créé avec succès",
                "grimpeur": nouv_grimp.to_dict()
            }, 201
        except Exception as e:
            logger.error(f"Error creating grimpeur: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la création"}, 500


class Grimpeur(Resource):
    def get(self, id):
        """Get a single grimpeur by ID"""
        try:
            grimpeur = g.db_session.query(Clients.Grimpeur).filter_by(
                NumGrimpeur=id
            ).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404
            return grimpeur.to_dict(), 200
        except Exception as e:
            logger.error(f"Error fetching grimpeur {id}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def put(self, id):
        """Update a grimpeur"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "Aucune donnée fournie"}, 400

            grimpeur = g.db_session.query(Clients.Grimpeur).filter_by(
                NumGrimpeur=id
            ).first()
            if not grimpeur:
                return {"message": "Grimpeur introuvable"}, 404

            # Verify ClubId if provided
            club_id = json_data.get("ClubId")
            if club_id is not None:
                club_exists = g.db_session.query(Groupes.Club).filter_by(
                    IdClub=club_id
                ).first()
                if not club_exists:
                    return {
                        "message": f"ClubId {club_id} n'existe pas"
                    }, 400

            # Update allowed fields
            for key, value in json_data.items():
                if key in ALLOWED_FIELDS:
                    if key == "CheminSignature" and not value:
                        continue
                    setattr(grimpeur, key, value)

            g.db_session.commit()
            return {
                "message": "Grimpeur mis à jour avec succès",
                "grimpeur": grimpeur.to_dict()
            }, 200
        except Exception as e:
            logger.error(f"Error updating grimpeur {id}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la mise à jour"}, 500

    def delete(self, id):
        """Delete a grimpeur"""
        try:
            grimpeur = g.db_session.query(Clients.Grimpeur).filter_by(
                NumGrimpeur=id
            ).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404
            
            g.db_session.delete(grimpeur)
            g.db_session.commit()
            return {"message": "Grimpeur deleted"}, 200
        except Exception as e:
            logger.error(f"Error deleting grimpeur {id}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la suppression"}, 500


class GrimpeurAccords(Resource):
    def put(self, id):
        """Update grimpeur signature and agreements"""
        try:
            json_data = request.get_json()
            signature_b64 = json_data.get("CheminSignature")
            if not signature_b64:
                return {"message": "Signature manquante"}, 400

            # Decode signature
            try:
                signature_bytes = base64.b64decode(signature_b64.split(",")[-1])
            except Exception:
                return {"message": "Signature invalide"}, 400

            # Create directory
            os.makedirs(signaturePath, exist_ok=True)
            filename = f"grimpeur_{id}_{date.today().isoformat()}.png"
            filepath = os.path.join(signaturePath, filename)

            # Get grimpeur
            grimpeur = g.db_session.query(Clients.Grimpeur).filter_by(
                NumGrimpeur=id
            ).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404

            # Delete old signature if exists
            if grimpeur.CheminSignature and os.path.exists(grimpeur.CheminSignature):
                try:
                    os.remove(grimpeur.CheminSignature)
                except Exception as e:
                    logger.warning(f"Could not delete old signature: {e}")

            # Save new signature
            with open(filepath, "wb") as f:
                f.write(signature_bytes)

            grimpeur.CheminSignature = filepath
            grimpeur.AccordReglement = True

            # Check for parental agreement
            accord_parental = request.args.get("AccordParental")
            if accord_parental is not None:
                grimpeur.AccordParental = True

            g.db_session.commit()

            return {
                "message": "Signature enregistrée",
                "CheminSignature": filepath,
                "AccordReglement": grimpeur.AccordReglement,
                "AccordParental": grimpeur.AccordParental,
            }, 200
        except Exception as e:
            logger.error(f"Error updating signature for grimpeur {id}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de l'enregistrement"}, 500


class GrimpeurSearch(Resource):
    def get(self):
        """Search grimpeurs by name, club, or ID"""
        try:
            query_string = request.args.get("query", type=str)
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)

            # Validate
            if not query_string:
                return {"message": "Requête de recherche vide"}, 400

            # Sanitize pagination
            limit = min(limit, 100)
            offset = max(offset, 0)

            # Split query into tokens
            tokens = [t.strip() for t in query_string.split() if t.strip()]
            if not tokens:
                return {"message": "Requête vide après nettoyage"}, 400

            # Build search conditions
            conditions = []
            for token in tokens:
                subconds = [
                    Clients.Grimpeur.NomGrimpeur.ilike(f"%{token}%"),
                    Clients.Grimpeur.PrenomGrimpeur.ilike(f"%{token}%"),
                    Groupes.Club.NomClub.ilike(f"%{token}%"),
                ]

                # If numeric, search by NumGrimpeur too
                if token.isdigit():
                    subconds.append(
                        cast(Clients.Grimpeur.NumGrimpeur, String).startswith(token)
                    )

                conditions.append(or_(*subconds))

            # Execute query
            grimpeurs = (
                g.db_session.query(Clients.Grimpeur)
                .join(
                    Groupes.Club,
                    Clients.Grimpeur.ClubId == Groupes.Club.IdClub,
                    isouter=True
                )
                .filter(and_(*conditions))
                .order_by(Clients.Grimpeur.NumGrimpeur.desc())
            )

            total = grimpeurs.count()
            grimpeurs = grimpeurs.offset(offset).limit(limit).all()

            return {
                "data": [g.to_dict() for g in grimpeurs],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error searching grimpeurs: {e}")
            return {"message": "Erreur lors de la recherche"}, 500