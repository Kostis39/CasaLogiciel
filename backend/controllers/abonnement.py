from flask import request, g
from flask_restful import Resource
from models import Clients
import logging

logger = logging.getLogger(__name__)

class Abonnements(Resource):
    def get(self):
        """Get all abonnements"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)
            
            query = g.db_session.query(Clients.Abonnement).order_by(
                Clients.Abonnement.IdAbo.desc()
            )
            total = query.count()
            abos = query.offset(offset).limit(limit).all()
            
            return {
                "data": [abo.to_dict() for abo in abos],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching abonnements: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def post(self):
        """Create a new abonnement"""
        try:
            json = request.get_json()
            if json is None:
                return {"message": "No JSON data provided"}, 400

            nouvel_abo = Clients.Abonnement()
            for key, value in json.items():
                if value is not None and hasattr(nouvel_abo, key):
                    setattr(nouvel_abo, key, value)

            g.db_session.add(nouvel_abo)
            g.db_session.commit()
            g.db_session.refresh(nouvel_abo)
            
            return nouvel_abo.to_dict(), 201
        except Exception as e:
            logger.error(f"Error creating abonnement: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la création"}, 500


class Abonnement(Resource):
    def get(self, id):
        """Get a single abonnement by ID"""
        try:
            abo = g.db_session.query(Clients.Abonnement).filter_by(IdAbo=id).first()
            if not abo:
                return {"message": "Abonnement not found"}, 404
            return abo.to_dict(), 200
        except Exception as e:
            logger.error(f"Error fetching abonnement {id}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def put(self, id):
        """Update an abonnement"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            abo = g.db_session.query(Clients.Abonnement).filter_by(IdAbo=id).first()
            if not abo:
                return {"message": "Abonnement not found"}, 404

            for key, value in json_data.items():
                if hasattr(abo, key):
                    setattr(abo, key, value)

            g.db_session.commit()
            return abo.to_dict(), 200
        except Exception as e:
            logger.error(f"Error updating abonnement {id}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la mise à jour"}, 500

    def delete(self, id):
        """Delete an abonnement (with integrity checks)"""
        try:
            abo = g.db_session.query(Clients.Abonnement).filter_by(IdAbo=id).first()
            if not abo:
                return {"message": "Abonnement not found"}, 404

            # Check if used in transactions
            transaction_first = g.db_session.query(Clients.Transaction).filter_by(
                TypeObjet="abonnement", IdObjet=id
            ).first()
            transaction_count = g.db_session.query(Clients.Transaction).filter_by(
                TypeObjet="abonnement", IdObjet=id
            ).count()

            if transaction_first:
                return {
                    "message": f"Impossible de supprimer l'abonnement ({id}) : utilisé dans {transaction_count} transaction(s)"
                }, 400

            # Check if assigned to grimpeurs
            grimpeur_first = g.db_session.query(Clients.Grimpeur).filter_by(AboId=id).first()
            grimpeur_count = g.db_session.query(Clients.Grimpeur).filter_by(AboId=id).count()

            if grimpeur_first:
                return {
                    "message": f"Impossible de supprimer l'abonnement ({id}) : assigné à {grimpeur_count} grimpeur(s)"
                }, 400

            # Check if used in seances
            seance_first = g.db_session.query(Clients.Seance).filter_by(AboId=id).first()
            seance_count = g.db_session.query(Clients.Seance).filter_by(AboId=id).count()

            if seance_first:
                return {
                    "message": f"Impossible de supprimer l'abonnement ({id}) : utilisé dans {seance_count} séance(s)"
                }, 400

            g.db_session.delete(abo)
            g.db_session.commit()
            return {"message": "Abonnement supprimé avec succès."}, 200
        except Exception as e:
            logger.error(f"Error deleting abonnement {id}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la suppression"}, 500

