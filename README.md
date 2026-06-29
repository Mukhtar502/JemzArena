# JemzArena

JemzArena is a food-ordering MVP with a NestJS backend, Prisma/PostgreSQL data layer, and a lightweight frontend shell for product browsing and checkout flow testing.

## Project overview

- Backend: NestJS + Prisma + PostgreSQL + JWT authentication
- Frontend: simple static client shell for UI integration
- API docs: Swagger available from the backend once it is running

## Repository structure

- backend/ — API server, Prisma schema, Swagger docs, tests
- frontend/ — frontend assets and future UI app entry points
- Project materials/ — design and planning assets

## Local development

### Backend

```bash
cd backend
npm install
docker-compose up -d
npx prisma migrate dev
npm run seed
npm run start:dev
```

The API will run at http://localhost:3000 and Swagger will be available at http://localhost:3000/api/docs.

### Frontend

If you are working on the frontend shell, open the frontend directory in your preferred editor and wire it to the running backend API.

## Environment setup

Create a backend/.env file based on the example below:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/jemz_arena"
JWT_SECRET="change-this-in-production"
JWT_EXPIRATION="24h"
NODE_ENV="development"
```

A sample file is included at backend/.env.example.

## Collaboration workflow

### Branching

- Create a feature branch for every task:
  - feature/short-description
  - fix/short-description
  - chore/short-description

### Commit etiquette

- Keep commits focused and descriptive.
- Use clear messages such as:
  - feat: add checkout flow
  - fix: sanitize order responses
  - chore: update docs for GitHub

### Before opening a pull request

1. Run the backend tests:
   ```bash
   cd backend
   npm test -- --runInBand --no-cache
   ```
2. Review the diff and ensure no secrets or local environment files are included.
3. Open a pull request with a summary of the change and any relevant screenshots or notes.

### Pushing to GitHub

From the project root:

```bash
git init
git add .
git commit -m "chore: initial project setup"
git branch -M main
git remote add origin https://github.com/<your-username>/jemzarena.git
git push -u origin main
```

## Notes for contributors

- Do not commit secrets, API keys, or local database credentials.
- Keep documentation and setup instructions current.
- Prefer small, reviewable changes.
