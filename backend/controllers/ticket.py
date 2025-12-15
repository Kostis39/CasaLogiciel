from flask import request, g
from flask_restful import Resource
from models import Clients
import logging

logger = logging.getLogger(__name__)

class Tickets(Resource):
    def get(self):
        """Get all tickets"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)
            
            query = g.db_session.query(Clients.Ticket).order_by(
                Clients.Ticket.IdTicket.desc()
            )
            total = query.count()
            tickets = query.offset(offset).limit(limit).all()
            
            return {
                "data": [ticket.to_dict() for ticket in tickets],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching tickets: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def post(self):
        """Create a new ticket"""
        try:
            json = request.get_json()
            if json is None:
                return {"message": "No JSON data provided"}, 400

            nouveau_ticket = Clients.Ticket()
            for key, value in json.items():
                if value is not None and hasattr(nouveau_ticket, key):
                    setattr(nouveau_ticket, key, value)

            g.db_session.add(nouveau_ticket)
            g.db_session.commit()
            g.db_session.refresh(nouveau_ticket)
            return nouveau_ticket.to_dict(), 201
        except Exception as e:
            logger.error(f"Error creating ticket: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la création"}, 500


class Ticket(Resource):
    def get(self, id):
        """Get a single ticket by ID"""
        try:
            ticket = g.db_session.query(Clients.Ticket).filter_by(IdTicket=id).first()
            if not ticket:
                return {"message": "Ticket not found"}, 404
            return ticket.to_dict(), 200
        except Exception as e:
            logger.error(f"Error fetching ticket {id}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def put(self, id):
        """Update a ticket"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            ticket = g.db_session.query(Clients.Ticket).filter_by(IdTicket=id).first()
            if not ticket:
                return {"message": "Ticket not found"}, 404

            for key, value in json_data.items():
                if hasattr(ticket, key):
                    setattr(ticket, key, value)

            g.db_session.commit()
            return ticket.to_dict(), 200
        except Exception as e:
            logger.error(f"Error updating ticket {id}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la mise à jour"}, 500

    def delete(self, id):
        """Delete a ticket (with integrity checks)"""
        try:
            ticket = g.db_session.query(Clients.Ticket).filter_by(IdTicket=id).first()
            if not ticket:
                return {"message": "Ticket not found"}, 404

            # Check if used in transactions
            transaction_first = g.db_session.query(Clients.Transaction).filter_by(
                TypeObjet="ticket", IdObjet=id
            ).first()
            transaction_count = g.db_session.query(Clients.Transaction).filter_by(
                TypeObjet="ticket", IdObjet=id
            ).count()

            if transaction_first:
                return {
                    "message": f"Impossible de supprimer le ticket ({id}) : utilisé dans {transaction_count} transaction(s)"
                }, 400

            # Check if assigned to grimpeurs
            grimpeur_first = g.db_session.query(Clients.Grimpeur).filter_by(TicketId=id).first()
            grimpeur_count = g.db_session.query(Clients.Grimpeur).filter_by(TicketId=id).count()

            if grimpeur_first:
                return {
                    "message": f"Impossible de supprimer le ticket ({id}) : assigné à {grimpeur_count} grimpeur(s)"
                }, 400

            # Check if used in seances
            seance_first = g.db_session.query(Clients.Seance).filter_by(TicketId=id).first()
            seance_count = g.db_session.query(Clients.Seance).filter_by(TicketId=id).count()

            if seance_first:
                return {
                    "message": f"Impossible de supprimer le ticket ({id}) : utilisé dans {seance_count} séance(s)"
                }, 400

            g.db_session.delete(ticket)
            g.db_session.commit()
            return {"message": "Ticket supprimé avec succès."}, 200
        except Exception as e:
            logger.error(f"Error deleting ticket {id}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la suppression"}, 500

