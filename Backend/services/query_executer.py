from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, ProgrammingError, OperationalError
from models.query_history import QueryExecutionHistory
DEFAULT_PAGE_SIZE = 50
MAX_PAGE_SIZE = 200

def normalize_query(query: str) -> str:
  return query.strip().rstrip(";")

from sqlalchemy import text
from sqlalchemy.orm import Session

DEFAULT_PAGE_SIZE = 50
MAX_PAGE_SIZE = 200


def execute_query(
    db: Session,
    user_query: str,
    page: int,
    page_size: int,
):
    # ---- normalize ----
    query = user_query.strip().rstrip(";")

    if not query.lower().startswith("select"):
        raise ValueError("Only SELECT queries are allowed")

    # ---- pagination safety ----
    page = max(page, 1)
    page_size = min(page_size, MAX_PAGE_SIZE)
    offset = (page - 1) * page_size

    # ---- wrap query ----
    wrapped_query = f"""
    SELECT * FROM (
        {query}
    ) AS user_query
    LIMIT :limit OFFSET :offset
    """

    try:
        result = db.execute(
            text(wrapped_query),
            {"limit": page_size, "offset": offset},
        )

        rows = result.fetchall()
        data = [dict(row._mapping) for row in rows]

        count_query = f"""
        SELECT COUNT(*) FROM (
            {query}
        ) AS user_query
        """


        total_rows = db.execute(text(count_query)).scalar()
        total_pages = (total_rows + page_size - 1) // page_size

        if page == 1:
            history = QueryExecutionHistory(
                user_id=user_id,
                sql_query=query,
                natural_language_query=natural_language_query,
                total_rows=total_rows,
                total_pages=total_pages,
                description="Query executed successfully",
            )
            db.add(history)
            db.commit()

        return {
            "page": page,
            "page_size": page_size,
            "returned_rows": len(data),
            "total_rows": total_rows,
            "total_pages": total_pages,
            "data": data,
        }
    except (ProgrammingError, OperationalError) as e:
        db.rollback()
        # These are SQL/user-related errors
        raise ValueError(f"SQL execution failed: {str(e.orig)}")


    except SQLAlchemyError:
        db.rollback()
        # Generic SQLAlchemy error
        raise ValueError("Database error occurred while executing the query")


    except Exception:
        db.rollback()
        # Truly unexpected error
        raise RuntimeError("Unexpected server error while executing query")