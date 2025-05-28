from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session

engine = create_engine()
sesh = get_session(engine)


class Produit(Resource):
    def get(self, id):
        with sesh() as session:
            produit = session.query(Clients.Produit).filter_by(IdProduit=id).first()
            if produit:
                return produit.to_dict(), 200
            else:
                return {"message": "Produit not found"}, 404

    def delete(self, id):
        with sesh() as session:

            def delete_recursive(produit_id):
                enfants = (
                    session.query(Clients.Produit)
                    .filter_by(IdProduitParent=produit_id)
                    .all()
                )
                for enfant in enfants:
                    delete_recursive(enfant.IdProduit)
                produit = (
                    session.query(Clients.Produit)
                    .filter_by(IdProduit=produit_id)
                    .first()
                )
                if produit:
                    session.delete(produit)
                    session.flush()

            produit = session.query(Clients.Produit).filter_by(IdProduit=id).first()
            if not produit:
                return {"message": "Produit not found"}, 404

            delete_recursive(id)
            session.commit()
            return {"message": "Produit and its descendants deleted"}, 200


    def put(self, id):
        json_data = request.get_json()
        if not json_data:
            return {"message": "No input data provided"}, 400

        with sesh() as session:
            produit = session.query(Clients.Produit).filter_by(IdProduit=id).first()
            if not produit:
                return {"message": "Produit not found"}, 404

            for key, value in json_data.items():
                if hasattr(produit, key):
                    setattr(produit, key, value)

            session.commit()
            return produit.to_dict(), 200


class SousProduit(Resource):
    def get(self, idParent):
        with sesh() as session:
            produits = (
                session.query(Clients.Produit).filter_by(IdProduitParent=idParent).all()
            )
            if produits:
                return [produit.to_dict() for produit in produits], 200
            else:
                return {"message": "No sous-produits found"}, 404


class RacineProduits(Resource):
    def get(self):
        with sesh() as session:
            produits = (
                session.query(Clients.Produit).filter_by(IdProduitParent=None).all()
            )
            if produits:
                return [produit.to_dict() for produit in produits], 200
            else:
                return {"message": "No root products found"}, 404


class Produits(Resource):
    def get(self):
        with sesh() as session:
            produits = session.query(Clients.Produit).all()
            if produits:
                return [produit.to_dict() for produit in produits], 200
            else:
                return {"message": "No products found"}, 404

    def post(self):
        json = request.get_json()
        if json is None:
            return {"message": "No JSON data provided"}, 400

        nouv_produit = Clients.Produit()
        for key, value in json.items():
            setattr(nouv_produit, key, value)

        with sesh() as session:
            session.add(nouv_produit)
            session.commit()
            session.refresh(nouv_produit)
            return nouv_produit.to_dict(), 201
