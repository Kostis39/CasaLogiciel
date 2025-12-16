from flask import Flask, g
from flask_cors import CORS
from flask_restful import Api
from db import create_engine, get_session, test_connection

from controllers.grimpeur import *
from controllers.abonnement import *
from controllers.ticket import *
from controllers.seance import *
from controllers.transaction import *
from controllers.club import *
from middleware import setup_logging


# Flask Setup
app = Flask(__name__)
CORS(app)
api = Api(app)

# Init Database
engine = create_engine()
test_connection(engine)

setup_logging(app)

# Database session management
@app.before_request
def before_request():
    """Create a new database session for each request"""
    g.db_session = get_session(engine)()

@app.teardown_appcontext
def shutdown_session(exception=None):
    """Close database session at end of request"""
    db_session = g.pop('db_session', None)
    if db_session is not None:
        db_session.close()

@app.errorhandler(Exception)
def handle_error(error):
    """Catch any unhandled errors"""
    print(f"✗ Error: {error}")
    return {"error": str(error)}, 500



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

"""
if __name__ == "__main__":
    app.run(debug=True)
"""