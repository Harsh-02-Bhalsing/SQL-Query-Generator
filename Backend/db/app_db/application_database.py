from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pathlib import Path

Base=declarative_base()

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "application_database.db"

SQLALCHEMY_DB_URL = f"sqlite:///{DB_PATH}"

engine=create_engine(
    SQLALCHEMY_DB_URL,connect_args={"check_same_thread":False}
)

SessionLocal=sessionmaker(
  autoflush=False,
  autocommit=False,
  bind=engine
)

def get_db():
  db=SessionLocal()
  try:
    yield db
  finally:
    db.close()
