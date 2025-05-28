from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session
from datetime import date

engine = create_engine()
sesh = get_session(engine)


class Transactions(Resource):
    def get(self):
        with sesh() as session:
            transacs = session.query(Clients.Transaction).all()
            if transacs == []:
                return {"message": "No transactions found"}, 404
            return [transac.to_dict() for transac in transacs], 200

    def post(self):
        json = request.get_json()
        if not json:
            return {"message": "No JSON data provided"}, 400

        new_transac = Clients.Transaction()
        for key, value in json.items():
            setattr(new_transac, key, value)

        with sesh() as session:
            session.add(new_transac)
            session.commit()
            session.refresh(new_transac)
            return new_transac.to_dict(), 201


class TransactionByDate(Resource):
    def get(self):
        date = request.args.get("date")
        if not date:
            return {"message": "Date parameter is required"}, 400

        with sesh() as session:
            transactions = session.query(Clients.Transaction).filter_by(
                DateTransac=date
            )
            return [transac.to_dict() for transac in transactions], 200
