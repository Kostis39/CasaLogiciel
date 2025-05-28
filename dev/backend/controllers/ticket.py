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
            ticket = session.query(Clients.Ticket).filter_by(IdTicket=id).first()
            if not ticket:
                return {"message": "Ticket not found"}, 404

            session.delete(ticket)
            session.commit()
            return {"message": "Ticket deleted"}, 200
