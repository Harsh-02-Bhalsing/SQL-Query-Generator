"""
Backend - FastAPI Application

Available Endpoints:
    GET /                    - Welcome message
    GET /health              - Health check endpoint
    GET /api/random-quote    - Sample endpoint to connect Frontend and Backend (generates random quote using Gemini LLM)

To run this server:
    uvicorn main:app --reload

The server will start at: http://localhost:8000
API documentation will be available at: http://localhost:8000/docs

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



app = FastAPI(title="Backend API", version="0.1.0")

# Enable CORS (Cross-Origin Resource Sharing) to allow frontend to connect
# This is necessary because the frontend runs on a different port than the backend
# Without CORS, browsers will block requests from frontend to backend
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