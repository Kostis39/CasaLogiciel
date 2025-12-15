from flask import request, g
from flask_restful import Resource
from models import Clients
import logging

logger = logging.getLogger(__name__)

class Transactions(Resource):
    def get(self):
        """Get all transactions with pagination"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)

            query = g.db_session.query(Clients.Transaction).order_by(
                Clients.Transaction.IdTransac.desc()
            )
            total = query.count()
            transactions = query.offset(offset).limit(limit).all()

            return {
                "data": [t.to_dict() for t in transactions],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching transactions: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def post(self):
        """Create a new transaction"""
        try:
            json = request.get_json()
            if not json:
                return {"message": "Aucune donnée JSON fournie."}, 400

            nouvelle_transac = Clients.Transaction()
            for key, value in json.items():
                if value is not None and hasattr(nouvelle_transac, key):
                    setattr(nouvelle_transac, key, value)

            g.db_session.add(nouvelle_transac)
            g.db_session.commit()
            g.db_session.refresh(nouvelle_transac)
            
            return {
                "message": "Transaction créée avec succès.",
                "data": nouvelle_transac.to_dict()
            }, 201
        except Exception as e:
            logger.error(f"Error creating transaction: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la création"}, 500


class TransactionById(Resource):
    def get(self, id_transac):
        """Get a specific transaction by ID"""
        try:
            transac = g.db_session.query(Clients.Transaction).filter_by(
                IdTransac=id_transac
            ).first()
            if not transac:
                return {"message": f"Aucune transaction trouvée avec l'identifiant {id_transac}."}, 404
            return transac.to_dict(), 200
        except Exception as e:
            logger.error(f"Error fetching transaction {id_transac}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def delete(self, id_transac):
        """Delete a specific transaction"""
        try:
            transac = g.db_session.query(Clients.Transaction).filter_by(
                IdTransac=id_transac
            ).first()
            if not transac:
                return {"message": f"Aucune transaction trouvée avec l'identifiant {id_transac}."}, 404
            
            g.db_session.delete(transac)
            g.db_session.commit()
            return {"message": f"Transaction {id_transac} supprimée avec succès."}, 200
        except Exception as e:
            logger.error(f"Error deleting transaction {id_transac}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la suppression"}, 500


class TransactionsByGrimpeur(Resource):
    def get(self, num_grimpeur):
        """Get all transactions for a grimpeur"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)

            query = g.db_session.query(Clients.Transaction).filter_by(
                NumGrimpeur=num_grimpeur
            ).order_by(Clients.Transaction.IdTransac.desc())
            total = query.count()
            transactions = query.offset(offset).limit(limit).all()

            return {
                "data": [t.to_dict() for t in transactions],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching transactions for grimpeur {num_grimpeur}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500


class TransactionsByDate(Resource):
    def get(self, date_str):
        """Get all transactions for a specific date"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)

            query = g.db_session.query(Clients.Transaction).filter_by(
                DateTransac=date_str
            ).order_by(Clients.Transaction.IdTransac.desc())
            total = query.count()
            transactions = query.offset(offset).limit(limit).all()

            return {
                "data": [t.to_dict() for t in transactions],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching transactions for date {date_str}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500
