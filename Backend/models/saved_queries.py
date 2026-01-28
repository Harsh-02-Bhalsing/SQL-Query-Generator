from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from db.app_db.application_database import Base
from sqlalchemy.sql import func

class DbSavedQuery(Base):
    __tablename__ = "saved_queries"

    query_id = Column(String, primary_key=True, index=True)

    # Firebase user identifier
    user_id = Column(String, nullable=False, index=True)

    # Optional user-defined title
    title = Column(String, nullable=True)

    # Natural language input used to generate SQL
    natural_language_query = Column(Text, nullable=False)

    # Generated SQL query
    sql_query = Column(Text, nullable=False)

    # Timestamp when query was saved
    created_at = Column(DateTime(timezone=True), server_default=func.now())