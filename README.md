# SQL Query Generator from Natural Language

## Project Overview

The SQL Query Generator is a web application that allows users to ask questions in natural language (English) and automatically converts them into SQL queries. The application executes these queries against a sample database and displays the results in a user-friendly format. Users can view the generated SQL query, understand how it works, save queries for later use, and rerun them.

## Technology Stack

### Frontend
- React 19
- Vite (build tool)
- Tailwind CSS (styling)
- React Router DOM (routing)
- Firebase Authentication (email/password)

### Backend
- Python 3.12+
- FastAPI (REST API)
- Uvicorn (ASGI server)
- Pydantic (data validation)

### Database
- SQLite (for application data: saved queries, query history)
- SQLite (for sample database with demo data)

### AI/ML
- LangChain (for SQL generation agent)
- Google Gemini LLM (for natural language to SQL conversion)

## Project Structure

```
sql-query-generator/
├── Backend/                    # FastAPI backend application
│   ├── main.py                 # Main backend server file
│   ├── routes/                 # API route handlers
│   ├── database/              # Database models and queries
│   ├── services/              # Business logic and LLM integration
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── Frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service functions
│   │   ├── config/           # Configuration files (Firebase)
│   │   └── App.jsx           # Main app component
│   ├── package.json          # Node.js dependencies
│   └── vite.config.js        # Vite configuration
│
├── issues/                    # Project issues (19 issues)
│   ├── issue-01-project-setup.md
│   ├── issue-02-landing-page-ui.md
│   └── ...
│
├── project_details.md        # Complete project planning document
└── PROJECT-README.md          # This file
```

## Features

- **User Authentication**: Firebase Authentication for secure user accounts
- **Natural Language Query Input**: Users can type questions in plain English
- **AI-Powered SQL Generation**: LangChain with LLM converts natural language to SQL queries
- **Query Execution**: Execute generated SQL queries against sample database
- **Results Display**: Display query results in table format
- **Query Management**: Save queries for later use with optional titles
- **Query History**: Track and view query execution history
- **Database Schema Viewer**: View available tables and columns
- **Query Detail Page**: View saved query details and rerun queries

## Issue Flow

### Foundation Phase (Issues 1-8)
1. **Project Setup**: Initialize project structure and dependencies
2. **Landing Page UI**: Create static landing page
3. **Signup Page UI**: Create static signup form
4. **Login Page UI**: Create static login form
5. **Firebase Auth Setup**: Configure Firebase Authentication
6. **Integrate Signup**: Connect signup form to Firebase
7. **Integrate Login**: Connect login form to Firebase
8. **Dashboard UI**: Create protected dashboard page

### Core Features Phase (Issues 9-15)
9. **Natural Language Query Input**: Frontend component for query input
10. **SQL Query Generation with LLM**: LangChain SQL agent integration
11. **Query Execution Backend**: Execute SQL queries safely
12. **Query Results Display**: Display results and SQL query
13. **Save Query Feature**: Save queries for later use
14. **View Saved Queries**: Display list of saved queries
15. **Delete Saved Query**: Remove saved queries

### Advanced Features Phase (Issues 16-18)
16. **Query Detail Page**: View saved query details and rerun queries
17. **Query History**: Track and display query execution history
18. **Database Schema Viewer**: Display database schema information

### Testing Phase (Issue 19)
19. **Final Testing**: Complete application flow verification and documentation

## API Endpoints

### Query Generation & Execution
- `POST /api/queries/generate` - Convert natural language to SQL (LLM integration)
- `POST /api/queries/execute` - Execute SQL query against database

### Query Management
- `POST /api/queries/save` - Save query for later use
- `GET /api/queries` - Get all saved queries for user
- `GET /api/queries/:id` - Get single saved query details
- `POST /api/queries/:id/execute` - Rerun saved query
- `DELETE /api/queries/:id` - Delete saved query

### History & Schema
- `GET /api/queries/history` - Get query execution history
- `GET /api/database/schema` - Get database schema information

## Pages and Routes

| Page | Route | Protected | Description |
|------|-------|-----------|-------------|
| Landing | / | No | Welcome page with app information |
| Signup | /signup | No | User registration page |
| Login | /login | No | User authentication page |
| Dashboard | /dashboard | Yes | Main page with query input and saved queries |
| Query Detail | /queries/:id | Yes | View saved query details and rerun |
| History | /history | Yes | Query execution history page |

## Key Components

### Navigation & Layout
- **Navbar**: Navigation header with user info and logout
- **Footer**: Footer with links

### Authentication
- **SignupForm**: User registration form
- **LoginForm**: User authentication form

### Query Interface
- **QueryInput**: Natural language query input component
- **SQLDisplay**: Display generated SQL query and explanation
- **QueryResults**: Display query results in table format

### Query Management
- **SavedQueriesList**: List of saved queries
- **SavedQueryCard**: Individual saved query card
- **QueryDetail**: Complete query information container
- **ExecuteButton**: Button to rerun saved queries

### History & Schema
- **HistoryList**: Query execution history list
- **HistoryItem**: Individual history entry
- **SchemaViewer**: Database schema display component

### Utility Components
- **LoadingSpinner**: Loading indicator
- **ErrorMessage**: Error display component

## Database Schema (High-Level)

### Tables
- **saved_queries**: User's saved queries with natural language, SQL, and optional title
- **query_history**: Query execution history tracking
- **sample_database tables**: Pre-populated tables for querying (employees, departments, products, orders, customers)

Note: Specific fields and relationships are designed by developers during implementation.

## LLM Integration

The application uses LangChain with Google Gemini LLM for:

1. **SQL Query Generation**: Convert natural language questions to SQL queries using LangChain SQL agent
2. **Schema Context**: Provide database schema information to LLM for accurate query generation
3. **Query Explanation**: Generate explanations of how SQL queries work

All LLM features use basic LangChain chains - no complex agent frameworks.

## Development Workflow

1. **Setup**: Complete Issue #01 to set up project structure
2. **Foundation**: Complete Issues #02-08 for UI and authentication
3. **Core Features**: Complete Issues #09-15 for main functionality
4. **Advanced Features**: Complete Issues #16-18 for additional capabilities
5. **Testing**: Complete Issue #19 for final verification

## Getting Started

1. Clone the repository
2. Follow Issue #01 (Project Setup) for initial setup
3. Complete issues sequentially from #02 onwards
4. Each issue builds upon previous work
5. Refer to project_details.md for complete project specifications

## Important Considerations

- **Query Safety**: Always validate SQL queries before execution to prevent destructive operations
- **Error Handling**: Provide user-friendly error messages for SQL errors and LLM failures
- **Schema Context**: Provide database schema information to LLM for accurate query generation
- **Sample Data**: Ensure sample database has enough realistic data for meaningful queries
- **User Experience**: Make the natural language to SQL conversion feel intuitive

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)
- [LangChain SQL Agent](https://python.langchain.com/docs/integrations/toolkits/sql_database)
- [Google Gemini LLM](https://ai.google.dev/docs)

## Notes

- All authentication is handled by Firebase (frontend only)
- All application data is stored in SQLite
- LLM features use LangChain basic chains only
- Query validation prevents unsafe SQL operations
- Focus on learning and building a complete, working application
