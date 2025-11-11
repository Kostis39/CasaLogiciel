from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session

engine = create_engine()
sesh = get_session(engine)

class Tickets(Resource):
    def get(self):
        with sesh() as session:
            tickets = session.query(Clients.Ticket).all()
            return [ticket.to_dict() for ticket in tickets], 200

    def post(self):
        json = request.get_json()
        if json is None:
            return {"message": "No JSON data provided"}, 400

        nouveau_ticket = Clients.Ticket()
        for key, value in json.items():
            setattr(nouveau_ticket, key, value)

        with sesh() as session:
            session.add(nouveau_ticket)
            session.commit()
            session.refresh(nouveau_ticket)
            return nouveau_ticket.to_dict(), 201


class Ticket(Resource):
    def get(self, id):
        with sesh() as session:
            ticket = session.query(Clients.Ticket).filter_by(IdTicket=id).first()
            if ticket:
                return ticket.to_dict(), 200
            else:
                return {"message": "Ticket not found"}, 404

    def put(self, id):
        json_data = request.get_json()
        if not json_data:
            return {"message": "No input data provided"}, 400

        with sesh() as session:
            ticket = session.query(Clients.Ticket).filter_by(IdTicket=id).first()
            if not ticket:
                return {"message": "Ticket not found"}, 404

            for key, value in json_data.items():
                if hasattr(ticket, key):
                    setattr(ticket, key, value)

            session.commit()
            return ticket.to_dict(), 200

    def delete(self, id):
        with sesh() as session:
            # Recherche du ticket
            ticket = session.query(Clients.Ticket).filter_by(IdTicket=id).first()
            if not ticket:
                return {"message": "Ticket not found"}, 404

            # Vérifie si le ticket est utilisé dans une transaction
            transaction_first = (
                session.query(Clients.Transaction)
                .filter_by(TypeObjet="ticket", IdObjet=id)
                .first()
            )
            transaction_count = (
                session.query(Clients.Transaction)
                .filter_by(TypeObjet="ticket", IdObjet=id)
                .count()
            )

            # Vérifie si le ticket est attribué à un grimpeur
            grimpeur_first = (
                session.query(Clients.Grimpeur)
                .filter_by(TicketId=id)
                .first()
            )
            grimpeur_count = (
                session.query(Clients.Grimpeur)
                .filter_by(TicketId=id)
                .count()
            )

            # Vérifie si le ticket est utilisé dans une séance
            seance_first = (
                session.query(Clients.Seance)
                .filter_by(TicketId=id)
                .first()
            )
            seance_count = (
                session.query(Clients.Seance)
                .filter_by(TicketId=id)
                .count()
            )

            if transaction_first:
                return {
                    "message": (
                        f"Impossible de supprimer le ticket ({id}) : il a déjà été utilisé "
                        f"dans {transaction_count} transaction(s), première transaction ID = {transaction_first.IdTransac}."
                    )
                }, 400

            if grimpeur_first:
                return {
                    "message": (
                        f"Impossible de supprimer le ticket ({id}) : il est attribué à "
                        f"{grimpeur_count} grimpeur(s), premier grimpeur NumGrimpeur = {grimpeur_first.NumGrimpeur}."
                    )
                }, 400

            if seance_first:
                return {
                    "message": (
                        f"Impossible de supprimer le ticket ({id}) : il est utilisé dans "
                        f"{seance_count} séance(s), première séance ID = {seance_first.IdSeance}."
                    )
                }, 400


            # Si non utilisé → suppression autorisée
            session.delete(ticket)
            session.commit()
            return {"message": "Ticket supprimé avec succès."}, 200

