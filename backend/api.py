from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Resource, Api
from models import Clients
from db import create_engine, get_session, test_connection

from controllers.grimpeur import *
from controllers.produits import *
from controllers.abonnement import *
from controllers.ticket import *
from controllers.seance import *
from controllers.transaction import *
from controllers.club import *

# Flask Setup
app = Flask(__name__)
CORS(app)
api = Api(app)

# Init Base
engine = create_engine()
sesh = get_session(engine)

# Test connection
test_connection(engine)


# Vraies classes
# Api endpoints (les vrais)

api.add_resource(GrimpeursListe, "/grimpeurs")
api.add_resource(Grimpeur, "/grimpeurs/<int:id>")
api.add_resource(GrimpeurSearch, "/grimpeurs/search")
api.add_resource(GrimpeurAccords, "/grimpeurs/accord/<int:id>")
api.add_resource(Seances, "/seances")
api.add_resource(SeancesById, "/seances/id/<int:id_seance>")
api.add_resource(SeancesByGrimpeur, "/seances/grimpeur/<int:num_grimpeur>")
api.add_resource(SeancesByDate, "/seances/date/<string:date_str>")
api.add_resource(SeanceExistante, '/seances/grimpeur/<int:num_grimpeur>/aujourdhui')
api.add_resource(Produit, "/produit/<int:id>")
api.add_resource(SousProduit, "/sousproduits/<int:idParent>")
api.add_resource(RacineProduits, "/racineproduits")
api.add_resource(Produits, "/produits")
api.add_resource(Tickets, "/tickets")
api.add_resource(Ticket, "/ticket/<int:id>")
api.add_resource(Abonnements, "/abonnements")
api.add_resource(Abonnement, "/abonnement/<int:id>")
api.add_resource(Transactions, "/transactions")
api.add_resource(TransactionById, "/transactions/id/<int:id_transac>")
api.add_resource(TransactionsByGrimpeur, "/transactions/grimpeur/<int:num_grimpeur>")
api.add_resource(TransactionsByDate, "/transactions/date/<string:date_str>")

api.add_resource(ClubsListe, "/clubs")                              # GET all, POST new
api.add_resource(ClubResource, "/clubs/<int:id>")                   # GET, PUT, DELETE by id
api.add_resource(ClubGrimpeurs, "/clubs/<int:id>/grimpeurs")        # GET tous les grimpeurs d’un club



if __name__ == "__main__":
    app.run(debug=True)
