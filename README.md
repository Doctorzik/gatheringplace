# Gathering Place API

Gathering Place is a Node.js + Express API for authentication, backed by PostgreSQL with Prisma.
It already includes request hardening with Helmet, Arcjet bot/shield/rate-limit rules, and cookie-based JWT auth.

## What this project currently does
- User signup (`/api/auth/sign-up`)
- User signin (`/api/auth/sign-in`)
- User signout (`/api/auth/sign-out`)
- Health endpoint (`/health`)
- Basic API metadata endpoint (`/api`)

## Stack
- Node.js (ESM)
- Express 5
- Prisma + PostgreSQL
- Arcjet (`shield`, `detectBot`, rate limiting)
- JWT + httpOnly cookies
- Winston + Morgan logging
- Docker + Docker Compose

## Project layout
- `src/app.js`: Express app and middleware wiring
- `src/server.js`: HTTP server bootstrap
- `src/controllers/*`: Route handlers
- `src/services/*`: Domain/data logic
- `src/middleware/*`: Security middleware
- `src/config/*`: Logger, DB, Arcjet config
- `src/prisma/schema.prisma`: Data model

## Local development
1. Install dependencies:
```bash
pnpm install
```
2. Set environment values (copy from `.env.example` or use your own `.env`).
3. Start dev server:
```bash
pnpm dev
```

The app runs on `http://localhost:3000` by default.

## Production build
```bash
pnpm build
pnpm start
```

## Required environment variables
For local development:
- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `ARCJET_KEY`
- `LOG_LEVEL` (optional)

For production (must be present):
- `NODE_ENV=production`
- `DATABASE_URL`
- `JWT_SECRET`
- `ARCJET_KEY`

## API routes
- `GET /`
- `GET /health`
- `GET /api`
- `POST /api/auth/sign-up`
- `POST /api/auth/sign-in`
- `POST /api/auth/sign-out`






## Notes
