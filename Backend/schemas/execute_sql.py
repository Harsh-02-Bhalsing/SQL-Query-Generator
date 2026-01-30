from pydantic import BaseModel, Field

class QueryRequest(BaseModel):
    user_id:str=Field(...,descripion="Firebase user id")
    query_id:str = Field(...,descripion="unique query id")
    query: str = Field(..., description="Read-only SELECT SQL query")
    page: int = Field(1, ge=1)
    page_size: int = Field(50, ge=1, le=200)