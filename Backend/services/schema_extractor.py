from sqlalchemy import inspect
from datetime import datetime
from db.user_db.user_database import engine

def get_database_schema() -> dict:
    """
    Extracts the database schema and RETURNS it as a JSON-serializable dict.
    """
    inspector = inspect(engine)

    schema = {
        "database": engine.url.database,
        "dialect": engine.url.get_backend_name(),
        "tables": {},
        "relationships": [],
        "last_updated": datetime.utcnow().isoformat()
    }

    pk_cache = {}
    unique_cache = {}

    # ---------- TABLES & COLUMNS ----------
    for table in inspector.get_table_names():
        pk_cache[table] = set(
            inspector.get_pk_constraint(table).get("constrained_columns", [])
        )

        uniques = set()
        for uc in inspector.get_unique_constraints(table):
            for col in uc.get("column_names", []):
                uniques.add(col)
        unique_cache[table] = uniques

        columns = {}
        for col in inspector.get_columns(table):
            col_name = col["name"]

            columns[col_name] = {
                "type": str(col["type"]),
                "nullable": col["nullable"]
            }

            if col_name in pk_cache[table]:
                columns[col_name]["primary_key"] = True

            if col_name in unique_cache[table]:
                columns[col_name]["unique"] = True

        schema["tables"][table] = {
            "columns": columns
        }

    # ---------- FOREIGN KEYS ----------
    for table in inspector.get_table_names():
        for fk in inspector.get_foreign_keys(table):
            if not fk.get("referred_table"):
                continue

            local_col = fk["constrained_columns"][0]
            remote_table = fk["referred_table"]
            remote_col = fk["referred_columns"][0]

            schema["tables"][table]["columns"][local_col]["foreign_key"] = (
                f"{remote_table}.{remote_col}"
            )

            schema["relationships"].append({
                "from": f"{table}.{local_col}",
                "to": f"{remote_table}.{remote_col}",
                "type": "many-to-one"
            })

    return schema
