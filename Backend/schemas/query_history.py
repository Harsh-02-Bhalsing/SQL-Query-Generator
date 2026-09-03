from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class QueryHistoryResponse(BaseModel):
    id: int
    query_id:str
    user_id:str
    sql_query: str
    description: Optional[str]
    total_rows: Optional[int] = None
    total_pages: Optional[int] = None
    executed_at: datetime


class QueryHistoryListResponse(BaseModel):
    history: List[QueryHistoryResponse]