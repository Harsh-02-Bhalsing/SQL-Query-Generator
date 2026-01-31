from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.exc import SQLAlchemyError
from services.schema_extractor import get_database_schema
from schemas.database_schema import DatabaseSchemaResponse
from dependencies.auth import get_current_user_id

router = APIRouter(
    prefix="/api/database",
    tags=["database"]
)

@router.get("/schema", response_model=DatabaseSchemaResponse)
def fetch_database_schema(
    user_id: str = Depends(get_current_user_id),
):
    try:
        return get_database_schema()

    except SQLAlchemyError:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve database schema"
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unexpected server error while fetching schema"
        )
