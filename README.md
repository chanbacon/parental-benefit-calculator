# Parental Benefit Calculator

A mobile-friendly web application that calculates Estonia's parental benefits based on gross salary and child's birth date.

## Project Overview

- Users can:
  - Enter gross monthly salary
  - Enter child's birth date
  - View a 12-month payment breakdown
- Calculation rules:
  - Salary capped at €4000
  - Daily rate = salary ÷ 30
  - Monthly payment (except the first month) = days in month x daily rate
  - First month payment = days from birth date to month end x daily rate
- Gross salary and child's birth date are automatically persisted.
- `Benefit Input ID` is returned, stored in browser local storage and used to retrieve results.
- Project plan is available in [notion page](https://www.notion.so/Parental-Benefit-Calculator-30be1dbe16b7816babc4e520640446a4)

## Tech Stack

- Frontend: TypeScript
- Backend: Java 17, Spring Boot
- Database: SQLite
- Testing: JUnit
- Documentation: Swagger (Springdoc)

## Architecture

- Frontend (TypeScript): handles user input, displays results and stores `Benefit Input ID`
- Backend (Java and Spring Boot): handles calculation logic and exposes REST API endpoints
- Database (SQLite): persists calculation results
- Communication: REST API (JSON)

## Key Decisions

- No authentication implemented; progress is persisted without user accounts as data is non-sensitive
- Separation of frontend and backend for clarity and easier future extension
- SQLite for simplicity and local persistence
- Docker for consistent and reliable local setup

## Running the Application with Docker

### Prerequisites

- Docker Desktop installed
- To verify installation: `docker --version`

### Build and Run

- First run: `docker compose up --build`
- Subsequent runs: `docker compose up`

### Access

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

### Stop

- `Ctrl + C` or `docker compose down`
- Database file (`backend/benefits.db`) persists and survives container restarts.

## Running the Application without Docker (optional)

### Backend

- `cd backend`
- `./mvnw spring-boot:run` (Mac/Linux) / `.\mvnw.cmd spring-boot:run` (Windows)

### Frontend

- `cd frontend`
- `npm install`
- `npm run dev`

### Access

- Frontend: `http://localhost:5500`
- Backend: `http://localhost:8080`

## How to Use the App

### Frontend

#### Create Calculation

- Enter gross monthly salary (required, >0, max 2 decimals)
- Enter the child's birth date (required, uses browser date picker; internally stored as ISO format YYYY-MM-DD)
- Click `Calculate`

**Output**

- Month
- Paid days
- Payment amount<br>

Errors are shown for invalid input

#### Load Calculation

- `Benefit Input ID` (displayed as Retrieval Code to users) is returned after calculation
- Enter `Benefit Input ID` to retrieve results
- `Benefit Input ID` is saved in browser local storage.
- The field auto-fills on a return visit

## Automated Tests

- Backend tests cover:
  1. Calculation logic
  2. API endpoints
- Run tests (from `backend` directory):
  - Mac/Linux: `./mvnw clean test`
  - Windows: `.\mvnw.cmd clean test`

## API Endpoints

- `POST /api/benefits` - create calculations
- `GET /api/benefits/{id}` - retrieve calculations
- Full API documentation is available at [Swagger](http://localhost:8080/swagger-ui/index.html) (while the backend is running)

## Future Improvements

- Replace SQLite with PostgreSQL for scalability
- Add authentication if handling sensitive data
- Add export functionality (e.g. CSV, PDF)

## Contributors

- Bacon Chan
- Janne Rinaldo
- Magdaleena Teinemaa
