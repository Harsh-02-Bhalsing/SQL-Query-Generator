# AskSQL – Natural Language to SQL Query Platform

## 1. Application Overview

AskSQL is a full-stack web application that converts natural language questions into SQL queries, executes them safely on a database, and presents results in a clean, interactive UI.

The platform is designed to help users explore data without needing deep SQL knowledge, while still maintaining strong security, clear data visibility, and a professional user experience.

The application supports query generation, execution, saving, history tracking, schema exploration, and detailed query inspection — all protected using Firebase authentication.

---

## 2. Key Features

- **Natural Language → SQL Generation**
  - Convert plain English questions into valid SQL using an LLM
- **Safe SQL Execution**
  - Only SELECT queries are allowed
  - Pagination supported for large result sets
- **Saved Queries**
  - Save generated queries for later reuse
  - View, rerun, and delete saved queries
- **Query Detail Page**
  - Dedicated page to inspect a saved query and rerun it
- **Execution History**
  - Track and review previously executed queries
- **Database Schema Viewer**
  - View available tables, columns, and data types
  - Helps users write better queries
- **Secure Authentication**
  - Firebase Authentication (Signup, Login, Logout)
  - Token-based API security
- **Premium UI**
  - Dark, minimal, responsive design
  - Optimized for desktop and smaller screens

---

## 3. Tech Stack

### Frontend
- React
- React Router DOM
- Tailwind CSS
- Firebase Authentication
- Fetch API

### Backend
- FastAPI
- SQLite
- SQLAlchemy
- Firebase Admin SDK
- LangChain + LLM (SQL generation)

---

## 4. Architecture & Data Flow

### High-Level Flow

1. User logs in using Firebase Authentication
2. Frontend retrieves Firebase ID token
3. API requests include token in `Authorization: Bearer <token>` header
4. Backend verifies token and extracts authenticated user ID
5. User-scoped data is fetched or modified securely
6. Responses are rendered in the UI

### Security Model

- User ID is **never trusted from request body**
- Backend derives user identity **only from verified Firebase token**
- All protected routes require valid authentication

---

## 5. Frontend Pages & Routes

| Page | Route | Protected | Description |
|----|----|----|----|
| Landing | `/` | No | Application introduction |
| Signup | `/signup` | No | Create new account |
| Login | `/login` | No | User authentication |
| Dashboard | `/dashboard` | Yes | Main workspace (query input, saved queries, output) |
| Query Detail | `/queries/:id` | Yes | View and rerun saved query |
| History | `/history` | Yes | View query execution history |

---

## 6. Core UI Components

- **QueryInputPanel**
  - Accepts natural language input
  - Supports Enter key submission
- **QueryOutputPanel**
  - Displays SQL execution results
  - Sticky header with pagination
- **SavedQueries**
  - List of saved queries with collapse support
- **SavedQueryCell**
  - Execute, view details, or delete a query
- **QueryDescriptionPanel**
  - Displays query metadata and SQL
- **SchemaViewer**
  - Displays database schema
- **HistoryList / HistoryItem**
  - Displays query execution history

---

## 7. Backend API Reference

### Authentication
All protected endpoints require:


### Query APIs

| Method | Endpoint | Purpose |
|----|----|----|
| POST | `/api/queries/generate` | Generate SQL from natural language |
| POST | `/api/queries/execute` | Execute SQL query |
| POST | `/api/queries/save` | Save a query |
| GET | `/api/queries` | Get all saved queries |
| GET | `/api/queries/{id}` | Get saved query details |
| POST | `/api/queries/{id}/execute` | Rerun saved query |
| DELETE | `/api/queries/{id}` | Delete saved query |
| GET | `/api/queries/history` | Get execution history |

### Database Schema API

| Method | Endpoint | Purpose |
|----|----|----|
| GET | `/api/database/schema` | Retrieve database schema |

---

## 8. Database Structure

### saved_queries
- `query_id` (PK)
- `user_id`
- `title`
- `natural_language_query`
- `sql_query`
- `details`
- `created_at`

### query_execution_history
- `id` (PK)
- `user_id`
- `query`
- `executed_at`
- `total_rows`
- `total_pages`

---

## 9. Application Flow (User Journey)

1. User signs up or logs in
2. User lands on Dashboard
3. User types natural language query
4. SQL is generated and executed
5. Results are displayed
6. User can:
   - Save the query
   - Rerun it
   - View schema
7. Saved queries can be:
   - Viewed in detail
   - Executed again
   - Deleted
8. Execution history can be reviewed
9. User logs out

---

## 10. Error Handling

- Invalid inputs show inline validation messages
- Unauthorized API access returns 401
- Database or execution errors display user-friendly messages
- Loading states are shown during async operations
- Empty states are handled gracefully

---

## 11. Responsive Design

- Works on desktop, tablet, and smaller screens
- Sidebar collapses on reduced width
- Panels resize correctly without layout overflow
- No horizontal scrolling issues

---

## 12. Manual Testing Summary

### Authentication
- Signup works
- Login works
- Logout works
- Protected routes redirect when unauthenticated

### CRUD Operations
- Generate query ✓
- Execute query ✓
- Save query ✓
- View saved queries ✓
- Delete saved query ✓

### Security
- Token-based authentication enforced ✓
- User isolation verified ✓

### UI
- Loading states ✓
- Error states ✓
- Empty states ✓
- Responsive layout ✓

---

## 13. Setup & Run



```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload

```bash
cd Frontend
npm install
npm run dev
