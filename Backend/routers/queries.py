from fastapi import APIRouter,HTTPException,Depends
from schemas.generate_sql import GenerateSQLRequest,GenerateSQLResponse
from services.sql_generator import generate_sql,format_generate_sql_response
import json
from db.user_db.user_database import get_db
from schemas.execute_sql import QueryRequest
from sqlalchemy.orm import Session
from services.query_executer import execute_query
from schemas.saved_queries import SaveQueryRequest
from db.app_db.application_database import get_db as get_app_db
from models.saved_queries import DbSavedQuery
from sqlalchemy.orm import Session
from schemas.saved_queries import GetSavedQueriesResponse,SavedQueryItem
from schemas.query_detail import QueryDetailResponse
from schemas.query_history import QueryHistoryResponse,QueryHistoryListResponse
from models.query_history import QueryExecutionHistory
from dependencies.auth import get_current_user_id

router=APIRouter(
  prefix="/api/queries",
  tags=["queries"]
)
\

@router.get("/", response_model=GetSavedQueriesResponse)
def get_saved_queries(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_app_db),
):
    try:
        saved_queries = (
            db.query(DbSavedQuery)
            .filter(DbSavedQuery.user_id == user_id)
            .order_by(DbSavedQuery.created_at.desc())
            .all()
        )

        return {
            "total": len(saved_queries),
            "queries": [
                {
                    "query_id": q.query_id,
                    "user_id": q.user_id,
                    "title": q.title,
                    "natural_language_query": q.natural_language_query,
                    "sql_query": q.sql_query,
                    "details":q.details,
                    "created_at": q.created_at,
                }
                for q in saved_queries
            ],
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch saved queries",
        )



@router.post("/generate",response_model=GenerateSQLResponse)
def generate_sql_query(
  request:GenerateSQLRequest,
  user_id: str = Depends(get_current_user_id),
):
  try:
    llm_response = generate_sql(request.query)

    return format_generate_sql_response(
      llm_response=llm_response,
      user_id=user_id,
      natural_language_query=request.query
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
  app_db:Session=Depends(get_app_db),
  user_id: str = Depends(get_current_user_id),
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
      app_db=app_db,
      user_id=user_id,
      query_id=payload.query_id,
      user_query=query,
      page=payload.page,
      page_size=payload.page_size,
    )


  except Exception as e:
    raise HTTPException(
      status_code=500,
      detail=str(e),
    )
  

from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

@router.post("/save")
def save_query(
    request: SaveQueryRequest,
    db: Session = Depends(get_app_db),
    user_id: str = Depends(get_current_user_id),
):
    # Check if query already saved for this user
    existing_query = (
        db.query(DbSavedQuery)
        .filter(
            DbSavedQuery.query_id == request.query_id,
            DbSavedQuery.user_id == user_id,
        )
        .first()
    )

    if existing_query:
        raise HTTPException(
            status_code=400,
            detail="Query already saved for this user",
        )

    try:
        new_saved_query = DbSavedQuery(
            query_id=request.query_id,
            user_id=user_id,
            natural_language_query=request.natural_language_query,
            sql_query=request.sql_query,
            title=request.title,
            details=request.details,
        )

        db.add(new_saved_query)
        db.commit()
        db.refresh(new_saved_query)

        return {
            "query_id": new_saved_query.query_id,
            "user_id": new_saved_query.user_id,
            "title": new_saved_query.title,
            "created_at": new_saved_query.created_at,
            "message": "Query saved successfully",
        }

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to save query",
        )
    
@router.get("/history", response_model=QueryHistoryListResponse)
def get_query_history(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_app_db),
):
    try:
        history = (
            db.query(QueryExecutionHistory)
            .filter(QueryExecutionHistory.user_id == user_id)
            .order_by(QueryExecutionHistory.executed_at.desc())
            .all()
        )

        return {"history": history}

    except SQLAlchemyError:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch query history",
        )

@router.delete("/{query_id}")
def delete_saved_query(
    query_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_app_db),
):
    saved_query = (
        db.query(DbSavedQuery)
        .filter(
            DbSavedQuery.query_id == query_id,
            DbSavedQuery.user_id == user_id,
        )
        .first()
    )

    if not saved_query:
        raise HTTPException(
            status_code=404,
            detail="Saved query not found or unauthorized",
        )

    try:
        db.delete(saved_query)
        db.commit()
        return {"message": "Query deleted successfully"}
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to delete saved query",
        )
    

@router.get("/{query_id}", response_model=QueryDetailResponse)
def get_query_detail(
    query_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_app_db),
):
    try:
        saved_query = (
            db.query(DbSavedQuery)
            .filter(
                DbSavedQuery.query_id == query_id,
                DbSavedQuery.user_id == user_id,
            )
            .first()
        )

        if not saved_query:
            raise HTTPException(
                status_code=404,
                detail="Query not found or unauthorized",
            )

        return {
            "query_id": saved_query.query_id,
            "user_id": saved_query.user_id,
            "title": saved_query.title,
            "natural_language_query": saved_query.natural_language_query,
            "sql_query": saved_query.sql_query,
            "details": saved_query.details,
            "created_at": saved_query.created_at,
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch query details",
        )
    

