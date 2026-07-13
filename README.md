# HR Portal

This project implements the HR login, signup, and user management workflows requested in Jira tickets:

- [MA-531 HR login](https://aiagents-tec.atlassian.net/browse/MA-531)
- [MA-532 HR signup](https://aiagents-tec.atlassian.net/browse/MA-532)
- [MA-533 HR user CRUD](https://aiagents-tec.atlassian.net/browse/MA-533)

## Repository layout

- `/backend` – Express API with SQLite persistence, JWT authentication, validation, and Jest/Supertest coverage.
- `/frontend` – Create React App single-page application with login, signup, and a dashboard-driven HR user management experience.

## Getting started

1. Copy `.env.example` to `.env` in the project root and adjust values if needed.
2. Follow the backend and frontend instructions below in separate terminals.

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend listens on `http://localhost:4000` by default and exposes:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- CRUD under `/api/users` (protected, administrator only).

### Frontend

```bash
cd frontend
npm install
npm start
```

The React app runs on `http://localhost:3000` and talks to the backend using `REACT_APP_API_URL`.

## Testing

- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`

## Environment variables

See `.env.example` (root and `backend/.env.example`) for keys such as `JWT_SECRET`, `DATABASE_URL`, and `REACT_APP_API_URL`.

## Jira traceability

Links to the implemented stories/tickets are listed in the overview above.
