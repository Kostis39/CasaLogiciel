import sqlalchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from dotenv import load_dotenv
import os

load_dotenv()
PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")

def create_engine():
    if PASSWORD is None:
        print("Password non trouvé")
        exit(1)

    engine = sqlalchemy.create_engine(
        f"mariadb+mariadbconnector://{DB_USER}:{PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
        poolclass=QueuePool,
        pool_size=10,           # Number of connections to keep in pool
        max_overflow=20,        # Additional connections allowed
        pool_recycle=3600,      # Recycle connections after 1 hour
        pool_pre_ping=True,     # Test connection before using
        echo=False              # Set to True for SQL debugging
    )
    return engine

def get_session(engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal

def test_connection(engine):
    try:
        with engine.connect() as connector:
            result = connector.execute(sqlalchemy.text("SHOW TABLES"))
            tables = result.all()
            print("✓ Database connected successfully")
            print(f"✓ Found tables: {tables}")
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        exit(1)