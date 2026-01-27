from langchain_core.output_parsers import StrOutputParser
from services.llm import llm
from services.prompts import sql_generation_prompt

sql_generation_chain = (
sql_generation_prompt
| llm
| StrOutputParser()
)