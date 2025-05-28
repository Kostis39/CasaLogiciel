from flask import request
from flask_restful import Resource
from models import Clients
from db import create_engine, get_session

engine = create_engine()
sesh = get_session(engine)


class Produit(Resource):
    def get(self, id):
        """Retourne un produit spécifique par son identifiant.

        Args:
            id (int): l'identifiant du produit

        Returns:
            tuple: une réponse JSON contenant les détails du produit et un code de statut HTTP.
            - Si le produit est trouvé, retourne (produit.to_dict(), 200).
            - Si le produit n'est pas trouvé, retourne ({"message": "Produit not found"}, 404).
        """
        with sesh() as session:
            produit = session.query(Clients.Produit).filter_by(IdProduit=id).first()
            if produit:
                return produit.to_dict(), 200
            else:
                return {"message": "Produit not found"}, 404

    def delete(self, id):
        """
        Supprime un produit et tous ses produits descendants de manière récursive dans la base de données.

        Args:
            id (int): L'identifiant du produit à supprimer.

        Returns:
            tuple: Un message de réponse JSON et un code de statut HTTP.
            - Si le produit n'est pas trouvé, retourne ({"message": "Produit not found"}, 404).
            - Si le produit et ses descendants sont supprimés avec succès, retourne ({"message": "Produit and its descendants deleted"}, 204).

        Remarques :
            - Cette méthode utilise une fonction récursive pour supprimer tous les produits enfants avant de supprimer le produit parent.
            - Toutes les suppressions sont effectuées dans une seule session de base de données et validées à la fin.
        """

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
            return {"message": "Produit and its descendants deleted"}, 204

    def put(self, id):
        """
        Met à jour un produit spécifique.
        Args :
            id (int) : Identifiant unique du produit.
        Input :
            JSON correctement formaté représentant les nouvelles informations du produit.
        Returns :
            - Si le produit est trouvé et mis à jour : objet produit mis à jour avec son identifiant, HTTP 200 OK.
            - Si le produit n'est pas trouvé : {"message": "Produit not found"}, HTTP 404.
            - Si aucune donnée n'est fournie : {"message": "No input data provided"}, HTTP 400.
        """

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
        """Donne les produits à la racine (sans parent).

        Returns:
            tuple: Une liste de produits racine et un code de statut HTTP.
            - Si des produits racine sont trouvés, retourne ([produit.to_dict() for produit in produits], 200).
            - Si aucun produit racine n'est trouvé, retourne ({"message": "No root products found"}, 404).
        """
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
        """Retourne tous les produits.
        Returns:
            tuple: Une liste de produits et un code de statut HTTP.
            - Si des produits sont trouvés, retourne ([produit.to_dict() for produit in produits], 200).
            - Si aucun produit n'est trouvé, retourne ({"message": "No products found"}, 404).
        """
        with sesh() as session:
            produits = session.query(Clients.Produit).all()
            if produits:
                return [produit.to_dict() for produit in produits], 200
            else:
                return {"message": "No products found"}, 404

    def post(self):
        """Ajoute un nouveau produit à la base de données.
        Returns:
            tuple: Détails du nouveau produit et un code de statut HTTP.
            - Si le produit est créé avec succès, retourne (nouv_produit.to_dict(), 201).
            - Si aucune donnée JSON n'est fournie, retourne ({"message": "No JSON data provided"}, 400).
        """

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


# class VisibiliteProduit(Resource):
