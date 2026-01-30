from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class QueryHistoryRequest(BaseModel):
    user_id: str


class QueryHistoryResponse(BaseModel):
    id: int
    query_id:str
    sql_query: str
    natural_language_query: Optional[str]
    description: Optional[str]
    total_rows: int
    total_pages: int
    executed_at: datetime


class QueryHistoryListResponse(BaseModel):
    history: List[QueryHistoryResponse]
