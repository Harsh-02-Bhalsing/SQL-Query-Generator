from pydantic import BaseModel
from typing import Dict, Any, List


class DatabaseSchemaResponse(BaseModel):
    database: str
    dialect: str
    tables: Dict[str, Any]
    relationships: List[dict]
    last_updated: str
