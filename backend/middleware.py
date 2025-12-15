import time
import logging
from flask import request, g

logger = logging.getLogger(__name__)

def setup_logging(app):
    @app.before_request
    def log_request():
        g.start_time = time.time()
        logger.info(f"→ {request.method} {request.path}")

    @app.after_request
    def log_response(response):
        if hasattr(g, 'start_time'):
            elapsed = time.time() - g.start_time
            logger.info(f"← {request.method} {request.path} - {response.status_code} ({elapsed:.2f}s)")
            
            # Alert on slow requests
            if elapsed > 5:
                logger.warning(f"⚠️  SLOW REQUEST: {request.method} {request.path} took {elapsed:.2f}s")
        
        return response