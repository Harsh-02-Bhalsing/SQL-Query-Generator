from langchain_core.prompts import PromptTemplate

sql_generation_prompt = PromptTemplate(
    input_variables=["question", "schema"],
    template="""
You are an expert SQL engineer and database architect.

Your task is to convert a natural language question into a SQL query
using ONLY the provided database schema (in JSON format).

You MUST analyze the schema carefully before deciding whether the query
can be generated.

====================
DATABASE SCHEMA (JSON)
====================
{schema}

====================
USER QUESTION
====================
{question}

====================
DECISION RULES
====================
1. Use ONLY tables and columns that exist in the schema.
2. If the required tables or columns do NOT exist, DO NOT generate SQL.
3. If SQL can be generated, it MUST be a SAFE query:
   - SELECT statements only
   - No INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE
4. Determine the SQL language type:
   - "DQL" for SELECT queries
   - Use "DDL" or "DML" ONLY if explicitly requested and supported by schema
5. Do NOT execute the query.
6. Do NOT include markdown, comments, or extra text.
7. Respond with VALID JSON ONLY.

====================
RESPONSE FORMAT
====================

CASE 1: If a valid SQL query CAN be generated, return EXACTLY this JSON structure:

{{
  "query": "<generated SQL query>",
  "language": "<DDL | DML | DQL>",
  "explanation": "<clear, detailed explanation of what the query does and how it works>"
}}

CASE 2: If a valid SQL query CANNOT be generated, return EXACTLY this JSON structure:

{{
  "error": "<clear explanation of why the query cannot be generated based on the schema>",
  "suggestion": "<helpful alternatives, such as available columns, tables, or a rephrased question>"
}}

====================
IMPORTANT
====================
- Return ONLY ONE of the above JSON objects.
- The JSON must be syntactically valid.
- Do NOT include any additional keys.
- Do NOT wrap the response in code blocks.
"""
)
