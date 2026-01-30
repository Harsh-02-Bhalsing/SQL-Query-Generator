from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from db.app_db.application_database import Base  # adjust if your Base import differs

class QueryExecutionHistory(Base):
    __tablename__ = "query_execution_history"

    id = Column(Integer, primary_key=True, index=True)
    query_id=Column(String,index=True,nullabe=False)
    user_id = Column(String, index=True, nullable=False)

    sql_query = Column(Text, nullable=False)
    natural_language_query = Column(Text, nullable=True)
    description = Column(Text, nullable=True)

    total_rows = Column(Integer, nullable=False)
    total_pages = Column(Integer, nullable=False)

    executed_at = Column(DateTime(timezone=True), server_default=func.now())
