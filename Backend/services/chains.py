from langchain_core.output_parsers import StrOutputParser
from services.llm import llm
from services.prompts import user_sql_generation_prompt,admin_sql_generation_prompt

user_sql_generation_chain = (
user_sql_generation_prompt
| llm
| StrOutputParser()
)

admin_sql_generation_chain = (
  admin_sql_generation_prompt
  | llm
  | StrOutputParser()
)