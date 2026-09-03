from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, ProgrammingError, OperationalError
from models.query_history import QueryExecutionHistory
import re

DEFAULT_PAGE_SIZE = 50
MAX_PAGE_SIZE = 200

# ─────────────────────────────────────────────────────────────
#  SQL TYPE CLASSIFIER
#  Determines execution strategy from the first keyword.
# ─────────────────────────────────────────────────────────────

_DQL_KEYWORDS = {"SELECT"}
_DML_KEYWORDS = {"INSERT", "UPDATE", "DELETE", "MERGE"}
_DDL_KEYWORDS = {"CREATE", "DROP", "ALTER", "TRUNCATE", "RENAME"}
_DCL_KEYWORDS = {"GRANT", "REVOKE"}
_TCL_KEYWORDS = {"COMMIT", "ROLLBACK", "SAVEPOINT", "RELEASE"}


def classify_query(query: str) -> str:
    """
    Returns one of: 'DQL' | 'DML' | 'DDL' | 'DCL' | 'TCL' | 'UNKNOWN'
    based on the first keyword in the query.
    """
    first_word = query.strip().split()[0].upper()
    if first_word in _DQL_KEYWORDS: return "DQL"
    if first_word in _DML_KEYWORDS: return "DML"
    if first_word in _DDL_KEYWORDS: return "DDL"
    if first_word in _DCL_KEYWORDS: return "DCL"
    if first_word in _TCL_KEYWORDS: return "TCL"
    return "UNKNOWN"


# ─────────────────────────────────────────────────────────────
#  EXECUTION STRATEGIES — one function per SQL type
# ─────────────────────────────────────────────────────────────

def _execute_dql(db: Session, query: str, page: int, page_size: int) -> dict:
    """
    SELECT queries — returns paginated rows + column names.
    """
    page      = max(page, 1)
    page_size = min(page_size, MAX_PAGE_SIZE)
    offset    = (page - 1) * page_size

    wrapped = f"""
        SELECT * FROM (
            {query}
        ) AS _user_query
        LIMIT :limit OFFSET :offset
    """

    result     = db.execute(text(wrapped), {"limit": page_size, "offset": offset})
    rows       = result.fetchall()
    columns    = list(result.keys())
    data       = [dict(row._mapping) for row in rows]

    count_sql  = f"SELECT COUNT(*) FROM ({query}) AS _user_query"
    total_rows = db.execute(text(count_sql)).scalar()
    total_pages = (total_rows + page_size - 1) // page_size

    return {
        "type": "DQL",
        "page": page,
        "page_size": page_size,
        "returned_rows": len(data),
        "total_rows": total_rows,
        "total_pages": total_pages,
        "columns": columns,
        "data": data,
    }


def _execute_dml(db: Session, query: str) -> dict:
    """
    INSERT / UPDATE / DELETE / MERGE — returns affected row count.
    Committed immediately so the change is persisted.
    """
    result       = db.execute(text(query))
    affected     = result.rowcount        # -1 if driver doesn't support it
    db.commit()

    return {
        "type": "DML",
        "affected_rows": affected if affected >= 0 else None,
        "message": (
            f"{affected} row(s) affected."
            if affected >= 0
            else "Statement executed successfully (row count unavailable)."
        ),
    }


def _execute_ddl(db: Session, query: str) -> dict:
    """
    CREATE / DROP / ALTER / TRUNCATE / RENAME — no rows returned.
    Uses autocommit via connection-level execution so DDL is not
    wrapped inside SQLAlchemy's implicit transaction (which would
    conflict on databases that auto-commit DDL like MySQL/PostgreSQL).
    """
    # Get underlying raw connection and set autocommit for this statement
    with db.get_bind().connect() as conn:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text(query))

    first_word = query.strip().split()[0].upper()

    return {
        "type": "DDL",
        "affected_rows": None,
        "message": f"DDL statement executed successfully: {first_word}",
    }


def _execute_dcl(db: Session, query: str) -> dict:
    """
    GRANT / REVOKE — no rows returned.
    Also needs autocommit on most databases.
    """
    with db.get_bind().connect() as conn:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text(query))

    first_word = query.strip().split()[0].upper()

    return {
        "type": "DCL",
        "affected_rows": None,
        "message": f"DCL statement executed successfully: {first_word}",
    }


def _execute_tcl(db: Session, query: str) -> dict:
    """
    COMMIT / ROLLBACK / SAVEPOINT — SQLAlchemy manages transactions,
    so we honour explicit TCL by acting on the session directly rather
    than passing raw TCL strings to the DB (which would conflict with
    SQLAlchemy's own transaction tracking).
    """
    first_word = query.strip().split()[0].upper()

    if first_word == "COMMIT":
        db.commit()
        message = "Transaction committed successfully."
    elif first_word == "ROLLBACK":
        db.rollback()
        message = "Transaction rolled back successfully."
    elif first_word in ("SAVEPOINT", "RELEASE"):
        # Pass through — SQLAlchemy doesn't abstract savepoints in Session.execute
        db.execute(text(query))
        db.commit()
        message = f"TCL statement executed: {first_word}"
    else:
        message = f"TCL statement executed: {first_word}"

    return {
        "type": "TCL",
        "affected_rows": None,
        "message": message,
    }


# ─────────────────────────────────────────────────────────────
#  HISTORY WRITER
# ─────────────────────────────────────────────────────────────

def _write_history(
    app_db: Session,
    query_id: str,
    user_id: str,
    sql_query: str,
    query_type: str,
    result: dict,
) -> None:
    """
    Persists execution record on the first page only (avoids duplicate
    history entries for paginated DQL calls).
    """
    total_rows  = result.get("total_rows")   # DQL only
    total_pages = result.get("total_pages")  # DQL only

    history = QueryExecutionHistory(
        query_id    = query_id,
        user_id     = user_id,
        sql_query   = sql_query,
        total_rows  = total_rows,
        total_pages = total_pages,
        description = result.get("message", "Query executed successfully"),
    )
    app_db.add(history)
    app_db.commit()


# ─────────────────────────────────────────────────────────────
#  PUBLIC ENTRY POINT
# ─────────────────────────────────────────────────────────────

def execute_query(
    db: Session,
    app_db: Session,
    user_id: str,
    query_id: str,
    user_query: str,
    page: int,
    page_size: int,
) -> dict:
    """
    Classifies the SQL query type and routes it to the appropriate
    execution strategy. Returns a structured response in all cases.

    Response envelope:
      {
        "query_type" : "DQL" | "DML" | "DDL" | "DCL" | "TCL",
        "result"     : { ...type-specific fields... }
      }
    """
    query      = user_query.strip().rstrip(";")
    query_type = classify_query(query)

    try:
        if query_type == "DQL":
            result = _execute_dql(db, query, page, page_size)

        elif query_type == "DML":
            result = _execute_dml(db, query)

        elif query_type == "DDL":
            result = _execute_ddl(db, query)

        elif query_type == "DCL":
            result = _execute_dcl(db, query)

        elif query_type == "TCL":
            result = _execute_tcl(db, query)

        else:
            raise ValueError(f"Unrecognised SQL statement type: {query.split()[0]}")

        # Write history only on first page (or for non-paginated types)
        if query_type != "DQL" or page == 1:
            _write_history(app_db, query_id, user_id, query, query_type, result)

        return {
            "query_type": query_type,
            "result": result,
        }

    except (ProgrammingError, OperationalError) as e:
        db.rollback()
        raise ValueError(f"SQL execution failed: {str(e.orig)}")

    except SQLAlchemyError:
        db.rollback()
        raise ValueError("Database error occurred while executing the query")

    except ValueError:
        raise   # re-raise our own validation errors as-is

    except Exception:
        db.rollback()
        raise RuntimeError("Unexpected server error while executing query")