from services.schema_extractor import get_database_schema
import json

schema_json = get_database_schema()

# Convert schema → formatted string for LLM context
schema_text = json.dumps(schema_json, indent=2)