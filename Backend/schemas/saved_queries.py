from pydantic import BaseModel, Field
from typing import Optional


class SaveQueryRequest(BaseModel):
    query_id: str = Field(
        ...,
        description="Client-provided unique identifier for the saved query",
    )

    user_id: str = Field(
        ...,
        description="Firebase user ID associated with the saved query",
        min_length=1,
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