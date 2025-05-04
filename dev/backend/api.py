from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Resource, Api
from models import Clients
from db import create_engine, get_session, test_connection

from controllers.grimpeur import GrimpeursListe, Grimpeur, Seances

# Flask Setup
app = Flask(__name__)
CORS(app)
api = Api(app)

# Init Base
engine = create_engine()
sesh = get_session(engine)

# Test connection
test_connection(engine)


# Tests classes
class Users(Resource):
    def get(self):
        return {"users": ["Alice", "Bob", "Charlie"]}


class Products(Resource):
    def get(self):
        return {"products": ["Laptop", "Smartphone", "Tablet"]}


api.add_resource(Users, "/users")
api.add_resource(Products, "/products")


# Vraies classes
# Api endpoints (les vrais)

api.add_resource(GrimpeursListe, "/grimpeurs")
api.add_resource(Grimpeur, "/grimpeurs/<int:id>")
api.add_resource(Seances, "/seances")

if __name__ == "__main__":
    app.run(debug=True)
