from fastapi import APIRouter,HTTPException
from schemas.generate_sql import GenerateSQLRequest,GenerateSQLResponse
from services.sql_generator import generate_sql,format_generate_sql_response
import json
router=APIRouter(
  prefix="/api/queries",
  tags=["queries"]
)

@router.post("/generate",response_model=GenerateSQLResponse)
def generate_sql_query(
  request:GenerateSQLRequest
):
  try:
    llm_response = generate_sql(request.query)

    return format_generate_sql_response(
      llm_response=llm_response,
      user_id="123"
    )
  except Exception as e:
    # Log e in real apps
    raise HTTPException(
      status_code=500,
      detail=str(e)
    )