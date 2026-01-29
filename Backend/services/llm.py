import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# Load .env from backend root
load_dotenv()

GEMINI_API_KEY= os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY_2 not found in .env")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    api_key="AIzaSyCPj2bUa3xZsggyrrXCZJfl3MiZDFuN8ls"
)