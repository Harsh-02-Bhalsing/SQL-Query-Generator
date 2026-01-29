from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class GetQueryDetailRequest(BaseModel):
    user_id: str = Field(
        ...,
        description="Firebase user ID requesting the query detail",
        min_length=1,
    )


class QueryDetailResponse(BaseModel):
    query_id: str
    user_id: str
    title: Optional[str]
    natural_language_query: str
    sql_query: str
    details: Optional[str]
    created_at: datetime