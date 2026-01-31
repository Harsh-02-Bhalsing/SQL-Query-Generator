from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from typing import List

class SaveQueryRequest(BaseModel):
    query_id: str = Field(
        ...,
        description="Client-provided unique identifier for the saved query",
    )

    natural_language_query: str = Field(
        ...,
        description="Original natural language input used to generate the SQL query",
        min_length=1,
    )

    sql_query: str = Field(
        ...,
        description="Generated SQL SELECT query",
        min_length=1,
    )

    title: Optional[str] = Field(
        None,
        description="Optional user-defined title for the saved query",
        max_length=255,
    )

    language:Optional[str]=Field(
        None,
        description="Type of database language",
        max_length=100,
    )

    details:Optional[str]=Field(
        None,
        description="Explanation about the query",
        max_length=500,
    )



class SavedQueryItem(BaseModel):
    query_id: str
    user_id: str
    title: Optional[str]
    natural_language_query: str
    sql_query: str
    details:str
    created_at: datetime


class GetSavedQueriesResponse(BaseModel):
    total: int
    queries: List[SavedQueryItem]


