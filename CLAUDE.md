# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Terrarossa is a Next.js application for booking tennis courts at clubs. Users can view calendars, make reservations (single or recurrent), and manage their profiles. Club admins can manage club settings.

## Tech Stack

- **Frontend**: Next.js 15, React 18, Material-UI (MUI) 6, FullCalendar 6
- **Backend**: tRPC 10.45, Prisma 7 with PostgreSQL
- **Auth**: NextAuth.js with Auth0 provider
- **State**: Zustand stores (calendar, profile, search) merged via `useMergedStoreContext`
- **Testing**: Cypress (e2e + component tests)
- **Package Manager**: pnpm

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm dev:test         # Start with NEXT_PUBLIC_APP_ENV=test

# Build
pnpm build            # Production build

# Testing
pnpm cypress          # Open Cypress UI
pnpm cypress-run-e2e  # Run e2e tests headless
pnpm cypress-run-component  # Run component tests headless

# Code Quality
pnpm lint             # ESLint
pnpm prettier         # Format code

# Database
docker-compose up -d  # Start PostgreSQL container
pnpm db:seed          # Push schema + seed demo data
```

## Architecture

### Data Flow

```
React Components → tRPC hooks (src/hooks/*TrpcHooks.ts)
    → tRPC routers (src/server/api/routers/)
    → Prisma Client (src/server/db.ts)
    → PostgreSQL
```

### State Management

Three Zustand stores merged via context provider:

- `calendarStoreCreator.ts` - Calendar page state
- `profileStoreCreator.ts` - User profile state
- `searchStoreCreator.ts` - Club search state

Access via: `useMergedStoreContext(state => state.someValue)`

### Key Directories

- `src/pages/` - Next.js pages (uses Pages Router, not App Router)
- `src/components/` - React components
- `src/server/api/routers/` - tRPC route handlers
- `src/hooks/` - Custom hooks and Zustand stores
- `prisma/` - Database schema and migrations

### tRPC Procedures

- `publicProcedure` - No auth required
- `protectedProcedure` - Requires NextAuth session

### Key Components

- `Calendar.tsx` - Main calendar page, centralizes data fetching
- `ReserveDialog.tsx` - Reservation creation form
- `EventDetailDialog.tsx` - Reservation details/edit/delete
- `FullCalendarWrapper.tsx` - FullCalendar integration

## Conventions

### Dates

- Use Dayjs for all date handling
- Store in UTC in database, display in local time

### Reservations

- Single reservations: standalone `Reservation` records
- Recurrent reservations: `RecurrentReservation` parent with linked `Reservation` children
- Deleting parent cascades to all children

### Validation

- Zod schemas for tRPC input validation
- Schemas defined in hook files (e.g., `reservationQueryInputSchema` in `calendarTrpcHooks.ts`)

### Environment Variables

- `NEXT_PUBLIC_APP_ENV`: "development" | "test" | "production" - controls feature flags
- Server vars validated in `src/env.mjs`

### Path Alias

- `~/` maps to `src/` (e.g., `import { api } from "~/utils/api"`)

## Database Models

Key relationships:

- `Club` → many `Court` → many `Reservation`
- `User` → many `Reservation`
- `Reservation` → optional `RecurrentReservation` parent
- `Club` → one `ClubSettings` (booking hours, visibility window, max bookings)
