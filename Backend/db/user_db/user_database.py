# backend/db/user_db/user_database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from pathlib import Path
import json

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "chinook.db"

SQLALCHEMY_DB_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DB_URL,
    connect_args={"check_same_thread": False}
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

