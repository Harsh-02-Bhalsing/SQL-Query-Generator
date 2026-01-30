"""
Backend - FastAPI Application



Setup:
    1. Install dependencies: pip install -r requirements.txt
    2. Get your Google API key from: https://makersuite.google.com/app/apikey
    3. Create a .env file in the Backend directory with: GOOGLE_API_KEY=your_api_key_here
    4. Run the server: uvicorn main:app --reload
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
from routers import queries as query_router
from routers import database as database_router
from db.app_db.application_database import Base
from db.app_db.application_database import engine as app_db_engine

Base.metadata.create_all(bind=app_db_engine)

app = FastAPI(title="Backend API", version="0.1.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port and common React port
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "Hello from AI Interviewer Backend!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


app.include_router(query_router.router)   
app.include_router(database_router.router)