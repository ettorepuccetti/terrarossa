# Terrarossa - Tennis Court Booking System

## Project Overview

Next.js application for booking tennis courts at clubs. Features calendar-based reservations, user authentication, and club management.

## Tech Stack

- **Frontend**: Next.js 15, React 18, Material-UI (MUI), FullCalendar
- **Backend**: tRPC, Prisma ORM with SQLite (dev) / LibSQL (prod)
- **Auth**: NextAuth.js with Prisma adapter
- **State**: Zustand stores (calendar, profile, search) merged via context
- **Testing**: Cypress (e2e + component)
- **Build**: pnpm, TypeScript, ESLint, Prettier

## Key Architecture Patterns

- **Data Flow**: tRPC queries/mutations → Prisma → SQLite/LibSQL
- **State Management**: Separate Zustand stores for domains, accessed via `useMergedStoreContext`
- **Components**: MUI Grid2/Box for layout, consistent spacing/padding
- **Validation**: Zod schemas in tRPC hooks (e.g., `reservationQueryInputSchema`)
- **Dates**: Dayjs for all date handling, UTC storage in DB
- **Logging**: Pino logger in tRPC routes with user context

## Critical Workflows

- **Development**: `pnpm dev` (sets `NEXT_PUBLIC_APP_ENV=test`)
- **Build**: `pnpm build` (sets `NEXT_PUBLIC_APP_ENV=production`)
- **Testing**: `pnpm cypress-run-e2e` or `pnpm cypress-run-component` (requires test env)
- **Database**: `pnpm db:seed` (pushes schema + seeds demo data)
- **Lint/Format**: `pnpm lint` and `pnpm prettier`

## Project-Specific Conventions

- **Reservations**: Single or recurrent (linked via `recurrentReservationId`)
- **Club Settings**: Control visibility window, max bookings/user, cancellation hours
- **User Roles**: Default "USER", club association via `clubId`
- **Court Naming**: Unique per club (`@@unique([name, clubId])`)
- **Environment**: Use `NEXT_PUBLIC_APP_ENV` for feature flags (test/prod)

## Key Files for Reference

- **Schema**: `prisma/schema.prisma` - Data models and relations
- **API**: `src/server/api/routers/` - tRPC routers (reservation-query.ts, etc.)
- **State**: `src/hooks/useMergedStoreContext.tsx` - Store access pattern
- **Components**: `src/components/Calendar.tsx` - Data provider pattern for calendar page
- **Hooks**: `src/hooks/calendarTrpcHooks.ts` - Query schemas and hooks

## Common Patterns

- Calendar component centralizes data fetching: club data set in store when query completes, reservation operations passed as props to child dialogs
- Use `protectedProcedure` for user-specific operations
- Handle deletion of recurrent reservations by deleting parent record
- Display reservations in calendar using FullCalendar events
- Validate inputs with Zod before Prisma operations</content>
  <parameter name="filePath">/Users/ettorepuccetti/Dev/terrarossa/.github/copilot-instructions.md
