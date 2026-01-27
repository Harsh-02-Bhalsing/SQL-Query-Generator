from pydantic import BaseModel
from typing import Optional, Union

class GenerateSQLRequest(BaseModel):
  query:str



class SuccessData(BaseModel):
    query: str
    details: str
    language: str
    res_id: str

class ErrorData(BaseModel):
    error: str
    suggestion: str
    res_id: str

class GenerateSQLResponse(BaseModel):
    status: int
    user_id: str
    data: Union[SuccessData, ErrorData]