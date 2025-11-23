import sqlalchemy
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
PASSWORD=os.getenv("DB_PASSWORD")
DB_HOST=os.getenv("DB_HOST")
DB_PORT=os.getenv("DB_PORT")
DB_NAME=os.getenv("DB_NAME")

# Etablissement de la Base
def create_engine():
    if PASSWORD is None:
        print("Password non trouvé")
        exit(1)

    engine = sqlalchemy.create_engine(
        f"mariadb+mariadbconnector://root:{PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",    )
    return engine


# Creation de session
def get_session(engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal


# Test
def test_connection(engine):
    with engine.connect() as connector:
        result = connector.execute(sqlalchemy.text("SHOW TABLES"))
        print(result.all())
