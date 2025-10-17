# TorneoLive - Football Tournament Management Platform

## Overview

TorneoLive is a real-time football tournament management platform that enables administrators to create and manage tournaments, teams, players, and matches while providing live updates to spectators. The application features comprehensive statistics tracking including rankings, top scorers, and match results with goal-by-goal details.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript using Vite as the build tool
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod for form validation

**UI System**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with a custom Material Design-inspired theme
- Design system follows "New York" style variant with dark mode support
- Custom color palette optimized for sports/football aesthetics:
  - Primary brand: Vibrant green (142 85% 45%)
  - Admin zone: Energetic orange (25 95% 53%)
  - Functional colors for wins/losses/draws
  - Dark mode as default with blue-gray backgrounds

**Typography Strategy**
- Inter font for body text and data readability
- Montserrat for display/headlines (sporty energy)
- JetBrains Mono for scores and statistics (monospace)

**Component Structure**
- Reusable UI components in `/client/src/components/ui`
- Feature components (Header, Hero, MatchCard, RankingsTable, etc.) in `/client/src/components`
- Page-level components in `/client/src/pages` (HomeReal, Admin, NotFound)
- Example components for development reference in `/client/src/components/examples`

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- ESM module system throughout the application
- Custom middleware for request logging and error handling

**API Design Pattern**
- RESTful API structure under `/api` prefix
- Resource-based endpoints for tournaments, teams, players, matches, goals
- CRUD operations with proper HTTP methods (GET, POST, PATCH, DELETE)
- Nested routes for relationships (e.g., `/api/tournaments/:id/teams`)

**Data Access Layer**
- Storage abstraction interface (`IStorage`) in `server/storage.ts`
- Separates business logic from database implementation
- Supports statistics computation (rankings, top scorers)

**Request Flow**
- Express middleware logs all API requests with timing
- JSON request/response handling with proper error status codes
- Vite development middleware integration for HMR in development

### Data Storage Solutions

**Database Technology**
- PostgreSQL via Neon serverless database
- Drizzle ORM for type-safe database queries
- WebSocket-based connection pooling for serverless environments

**Schema Design**
- Five core tables: tournaments, teams, players, matches, goals
- Cascading deletes to maintain referential integrity
- UUID primary keys generated at database level
- Timestamps for match scheduling and tournament duration

**Schema Relationships**
- Tournaments → Teams (one-to-many)
- Teams → Players (one-to-many)
- Tournaments → Matches (one-to-many)
- Matches reference two Teams (teamAId, teamBId)
- Goals reference Match and Player (many-to-one)

**Data Validation**
- Zod schemas generated from Drizzle tables via drizzle-zod
- Server-side validation on all create/update endpoints
- Type safety shared between client and server via `/shared/schema.ts`

### Authentication and Authorization

**Current State**
- No authentication system implemented
- Admin functions accessible without login
- Session management infrastructure present (connect-pg-simple) but unused

**Admin Mode**
- Frontend toggle for admin UI (client-side only)
- Admin page at `/admin` for tournament/team/player/match management
- No server-side protection on admin endpoints

### External Dependencies

**Core Dependencies**
- `@neondatabase/serverless`: Neon PostgreSQL serverless driver with WebSocket support
- `drizzle-orm` & `drizzle-kit`: Type-safe ORM and migration tools
- `@tanstack/react-query`: Async state management and caching
- `@radix-ui/*`: Unstyled accessible UI primitives (18+ packages)
- `date-fns`: Date formatting and manipulation
- `zod`: Runtime type validation and schema definition

**UI & Styling**
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority` & `clsx`: Dynamic className utilities
- `cmdk`: Command menu component
- `embla-carousel-react`: Carousel/slider functionality

**Development Tools**
- `vite`: Build tool and dev server
- `tsx`: TypeScript execution for development
- `esbuild`: Production bundler for server code
- `@replit/*` plugins: Replit-specific development tools

**Font Loading**
- Google Fonts CDN for Inter, Montserrat, JetBrains Mono
- Preconnect optimization in HTML for performance

**Asset Management**
- Generated images stored in `/attached_assets/generated_images`
- Vite alias `@assets` for easy asset imports
- Hero background image using local asset reference