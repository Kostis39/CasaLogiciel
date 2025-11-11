import sqlalchemy
from sqlalchemy.orm import sessionmaker


# Etablissement de la Base
def create_engine():
    with open("../vpn-auth.txt", "r") as file:
        lines = file.readlines()
        secret = lines[1].strip() if len(lines) > 1 else None
    if secret is None:
        print("Secret non trouvé")
        exit(1)

    engine = sqlalchemy.create_engine(
        f"mariadb+mariadbconnector://root:{secret}@172.18.0.5:3306/casabase", echo=True
    )
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
