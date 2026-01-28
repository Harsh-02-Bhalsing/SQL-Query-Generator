from fastapi import APIRouter,HTTPException,Depends
from schemas.generate_sql import GenerateSQLRequest,GenerateSQLResponse
from services.sql_generator import generate_sql,format_generate_sql_response
import json
from db.user_db.user_database import get_db
from schemas.execute_sql import QueryRequest
from sqlalchemy.orm import Session
from services.query_executer import execute_query
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
      user_id=request.user_id
    )
  except Exception as e:
    # Log e in real apps
    raise HTTPException(
      status_code=500,
      detail=str(e)
    )
  

@router.post("/execute")
def run_query(
  payload: QueryRequest,
  db: Session = Depends(get_db),
):
  query = payload.query.strip()


  # ---- Hard safety check (VERY important) ----
  if not query.lower().startswith("select"):
    raise HTTPException(
      status_code=400,
      detail="Only SELECT queries are allowed.",
    )


  try:
    return execute_query(
      db=db,
      user_query=query,
      page=payload.page,
      page_size=payload.page_size,
    )


  except Exception as e:
    raise HTTPException(
      status_code=500,
      detail=str(e),
    )