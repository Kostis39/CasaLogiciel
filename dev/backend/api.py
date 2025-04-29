from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
from models import Clients
from db import create_engine, get_session, test_connection

# Flask Setup
app = Flask(__name__)
CORS(app)
api = Api(app)

# Init Base
engine = create_engine()
sesh = get_session(engine)

# Test connection
test_connection(engine)


# Fake classes
class Users(Resource):
    def get(self):
        return {"users": ["Alice", "Bob", "Charlie"]}


class Products(Resource):
    def get(self):
        return {"products": ["Laptop", "Smartphone", "Tablet"]}


api.add_resource(Users, "/users")
api.add_resource(Products, "/products")


# Vraies classes
class Grimpeurs(Resource):
    def get(self):
        with sesh() as session:
            grimpeurs = session.query(Clients.Grimpeur).all()
            return jsonify([grimpeur.to_dict() for grimpeur in grimpeurs])

    def post(self):
        pass


api.add_resource(Grimpeurs, "/grimpeurs")
if __name__ == "__main__":
    app.run(debug=True)
