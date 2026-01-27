# backend/db/user_db/user_database.py

from sqlalchemy import create_engine

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


#database schema string

SCHEMA_PATH = BASE_DIR/"user_db_schema.json"

with open(SCHEMA_PATH, "r") as f:
    schema_json = json.load(f)

# Convert JSON → formatted string for LLM context
schema_text = json.dumps(schema_json, indent=2)