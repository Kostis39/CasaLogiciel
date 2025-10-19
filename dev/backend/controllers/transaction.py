from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session

engine = create_engine()
sesh = get_session(engine)


class Transactions(Resource):
    def get(self):
        """Récupère la liste complète des transactions avec pagination."""
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        with sesh() as session:
            query = session.query(Clients.Transaction)
            total = query.count()
            transactions = query.offset(offset).limit(limit).all()

            if not transactions:
                return {"message": "Aucune transaction trouvée."}, 404

            return {
                "data": [t.to_dict() for t in transactions],
                "total": total
            }, 200

    def post(self):
        """Crée une nouvelle transaction."""
        json = request.get_json()
        if not json:
            return {"message": "Aucune donnée JSON fournie."}, 400

        nouvelle_transac = Clients.Transaction()
        for key, value in json.items():
            setattr(nouvelle_transac, key, value)

        with sesh() as session:
            session.add(nouvelle_transac)
            session.commit()
            session.refresh(nouvelle_transac)
            return {
                "message": "Transaction créée avec succès.",
                "data": nouvelle_transac.to_dict()
            }, 201

    def put(self):
        """Met à jour une transaction existante."""
        json = request.get_json()
        if not json:
            return {"message": "Aucune donnée JSON fournie."}, 400

        transac_id = json.get("IdTransac")
        if not transac_id:
            return {"message": "L'identifiant de la transaction est requis."}, 400

        with sesh() as session:
            transac = session.get(Clients.Transaction, transac_id)
            if not transac:
                return {"message": f"Aucune transaction trouvée avec l'identifiant {transac_id}."}, 404

            for key, value in json.items():
                if hasattr(transac, key) and key != "IdTransac":
                    setattr(transac, key, value)

            session.commit()
            session.refresh(transac)

            return {
                "message": "Transaction mise à jour avec succès.",
                "data": transac.to_dict()
            }, 200


class TransactionById(Resource):
    """GET /transactions/id/<id> — Récupère une transaction spécifique."""
    def get(self, id_transac):
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        with sesh() as session:
            query = session.query(Clients.Transaction).filter_by(IdTransac=id_transac)
            total = query.count()
            transactions = query.offset(offset).limit(limit).all()

            if not transactions:
                return {"message": f"Aucune transaction trouvée avec l'identifiant {id_transac}."}, 404

            return {
                "data": [t.to_dict() for t in transactions],
                "total": total
            }, 200


class TransactionsByGrimpeur(Resource):
    """GET /transactions/grimpeur/<num_grimpeur> — Récupère les transactions d’un grimpeur."""
    def get(self, num_grimpeur):
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        with sesh() as session:
            query = session.query(Clients.Transaction).filter_by(NumGrimpeur=num_grimpeur)
            total = query.count()
            transactions = query.offset(offset).limit(limit).all()

            if not transactions:
                return {"message": f"Aucune transaction trouvée pour le grimpeur {num_grimpeur}."}, 404

            return {
                "data": [t.to_dict() for t in transactions],
                "total": total
            }, 200


class TransactionsByDate(Resource):
    """GET /transactions/date/<date_str> — Récupère les transactions à une date donnée."""
    def get(self, date_str):
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        with sesh() as session:
            query = session.query(Clients.Transaction).filter_by(DateTransac=date_str)
            total = query.count()
            transactions = query.offset(offset).limit(limit).all()

            if not transactions:
                return {"message": f"Aucune transaction trouvée pour la date {date_str}."}, 404

            return {
                "data": [t.to_dict() for t in transactions],
                "total": total
            }, 200
