from pydantic import BaseModel, Field

class QueryRequest(BaseModel):
    query: str = Field(..., description="Read-only SELECT SQL query")
    page: int = Field(1, ge=1)
    page_size: int = Field(50, ge=1, le=200)