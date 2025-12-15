from datetime import date, datetime
from flask import request, g
from flask_restful import Resource
from models import Clients
import logging

logger = logging.getLogger(__name__)

class Seances(Resource):
    def get(self):
        """Get all seances with pagination"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)

            query = g.db_session.query(Clients.Seance).order_by(
                Clients.Seance.IdSeance.desc()
            )
            total = query.count()
            seances = query.offset(offset).limit(limit).all()

            return {
                "data": [s.to_dict() for s in seances],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching seances: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def post(self):
        """Create a new seance for a grimpeur"""
        try:
            json = request.get_json()
            id_grimpeur = json.get("NumGrimpeur")

            if not id_grimpeur:
                return {"message": "Le champ 'NumGrimpeur' est requis."}, 400

            grimpeur = g.db_session.query(Clients.Grimpeur).filter_by(
                NumGrimpeur=id_grimpeur
            ).first()
            if not grimpeur:
                return {"message": "Grimpeur introuvable."}, 404

            now = datetime.now()
            date_seance = now.date()
            heure_seance = now.time()

            # Check if grimpeur has valid subscription or tickets
            if (grimpeur.DateFinAbo is None or grimpeur.DateFinAbo <= date.today()) and grimpeur.NbSeanceRest <= 0:
                return {"message": "Le grimpeur n'a pas d'entrée valide."}, 403

            nouvelle_seance = Clients.Seance()
            nouvelle_seance.NumGrimpeur = id_grimpeur
            nouvelle_seance.DateSeance = date_seance
            nouvelle_seance.HeureSeance = heure_seance

            if grimpeur.DateFinAbo and grimpeur.DateFinAbo >= date.today():
                # Check if already has seance today
                seance_exist = g.db_session.query(Clients.Seance).filter_by(
                    NumGrimpeur=id_grimpeur, DateSeance=date_seance
                ).first()
                if seance_exist:
                    return {"message": "Une séance d'abonnement existe déjà aujourd'hui."}, 403
                
                nouvelle_seance.AboId = grimpeur.AboId
                message = "abonnement"
            else:
                # Use ticket
                grimpeur.NbSeanceRest -= 1
                nouvelle_seance.TicketId = grimpeur.TicketId
                message = "ticket"

            g.db_session.add(nouvelle_seance)
            g.db_session.commit()
            g.db_session.refresh(nouvelle_seance)

            return {"message": f"Séance créée via {message}.", "seance": nouvelle_seance.to_dict()}, 201
        except Exception as e:
            logger.error(f"Error creating seance: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la création"}, 500


class SeancesById(Resource):
    def get(self, id_seance):
        """Get a specific seance by ID"""
        try:
            seance = g.db_session.query(Clients.Seance).filter_by(IdSeance=id_seance).first()
            if not seance:
                return {"message": f"Aucune séance trouvée avec l'identifiant {id_seance}."}, 404
            return seance.to_dict(), 200
        except Exception as e:
            logger.error(f"Error fetching seance {id_seance}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

    def delete(self, id_seance):
        """Delete a specific seance"""
        try:
            seance = g.db_session.query(Clients.Seance).filter_by(IdSeance=id_seance).first()
            if not seance:
                return {"message": f"Aucune séance trouvée avec l'identifiant {id_seance}."}, 404
            
            g.db_session.delete(seance)
            g.db_session.commit()
            return {"message": f"Séance {id_seance} supprimée avec succès."}, 200
        except Exception as e:
            logger.error(f"Error deleting seance {id_seance}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la suppression"}, 500


class SeancesByGrimpeur(Resource):
    def get(self, num_grimpeur):
        """Get all seances for a grimpeur"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)

            query = g.db_session.query(Clients.Seance).filter_by(
                NumGrimpeur=num_grimpeur
            ).order_by(Clients.Seance.IdSeance.desc())
            total = query.count()
            seances = query.offset(offset).limit(limit).all()

            return {
                "data": [s.to_dict() for s in seances],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching seances for grimpeur {num_grimpeur}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500
        
    def delete(self, num_grimpeur):
        """Delete today's seances for a grimpeur"""
        try:
            grimpeur = g.db_session.query(Clients.Grimpeur).filter_by(
                NumGrimpeur=num_grimpeur
            ).first()
            if not grimpeur:
                return {"message": "Grimpeur not found"}, 404
            
            aujourd_hui = date.today()
            seances_auj = g.db_session.query(Clients.Seance).filter_by(
                NumGrimpeur=num_grimpeur, DateSeance=aujourd_hui
            ).all()
            
            if not seances_auj:
                return {"message": "Aucune séance à supprimer", "success": True}, 200
            
            nb_seances = len(seances_auj)
            for seance in seances_auj:
                if seance.TicketId is not None:
                    grimpeur.NbSeanceRest += 1  # Restore ticket
                g.db_session.delete(seance)

            g.db_session.commit()
            return {
                "message": f"{nb_seances} séance{'s' if nb_seances > 1 else ''} supprimée{'s' if nb_seances > 1 else ''}", 
                "success": True
            }, 200
        except Exception as e:
            logger.error(f"Error deleting seances for grimpeur {num_grimpeur}: {e}")
            g.db_session.rollback()
            return {"message": "Erreur lors de la suppression"}, 500


class SeancesByDate(Resource):
    def get(self, date_str):
        """Get all seances for a specific date"""
        try:
            limit = request.args.get("limit", 20, type=int)
            offset = request.args.get("offset", 0, type=int)
            
            limit = min(limit, 100)
            offset = max(offset, 0)

            query = g.db_session.query(Clients.Seance).filter_by(
                DateSeance=date_str
            ).order_by(Clients.Seance.IdSeance.desc())
            total = query.count()
            seances = query.offset(offset).limit(limit).all()

            return {
                "data": [s.to_dict() for s in seances],
                "total": total
            }, 200
        except Exception as e:
            logger.error(f"Error fetching seances for date {date_str}: {e}")
            return {"message": "Erreur lors de la récupération"}, 500

class SeanceExistante(Resource):
    def get(self, num_grimpeur):
        """Check if grimpeur has a seance today"""
        try:
            aujourd_hui = date.today()
            seance_exist = g.db_session.query(Clients.Seance).filter_by(
                NumGrimpeur=num_grimpeur, DateSeance=aujourd_hui
            ).first()

            if seance_exist:
                return {"est_la": True, "DateSeance": str(aujourd_hui)}, 200
            else:
                return {"est_la": False, "DateSeance": str(aujourd_hui)}, 200
        except Exception as e:
            logger.error(f"Error checking seance for grimpeur {num_grimpeur}: {e}")
            return {"message": "Erreur lors de la vérification"}, 500
