<!--
generated_by: tessera
source_sha: a15d5b2711d130e083ecc68f33f6a4aff150e0ec
generated_at: 2026-04-01T10:21:10.741Z
action: create
-->

# Repository Analysis Summary: Beudox HR Management System

## Project Overview

This is a comprehensive Human Resources management frontend application built as a React single-page application. The system provides full HR functionality including employee management, project tracking, client relationships, attendance monitoring, payroll processing, and administrative features.

## Key Architectural Insights

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui component library
- **Routing**: React Router DOM with protected routes
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Query for server state, Context API for auth
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest (unit) + Playwright (E2E)

### Application Structure
- **123 total files** (90 TypeScript, 8 SQL migrations, 6 JSON configs)
- **101 symbols** (92 public) indicating well-structured, modular codebase
- **Component-based architecture** with clear separation between UI components, pages, and business logic
- **Role-based access control** implemented at the routing level

### Core Components Analysis

#### Layout System
- `AppLayout`: Main application wrapper with responsive sidebar and content area
- `AppSidebar`: Collapsible navigation with role-filtered menu sections
- `TopBar`: Dynamic page title display based on current route

#### Authentication Flow
- Supabase-powered authentication with email/password
- Protected routes with loading states and role-based redirects
- Password reset and invitation functionality
- Session persistence and automatic redirects

#### Navigation Structure
The sidebar organizes features into logical sections:
- **MAIN**: Dashboard
- **PEOPLE**: Employees, Attendance, Public Holidays, Leave Management
- **FINANCE**: Payroll, Finance Sheet, Loans, Office Expenses, Outsourcing
- **WORK**: Projects, Clients, Evaluations, HR Policies
- **SYSTEM**: Notifications, Settings

### Database Integration
- **8 SQL migration files** indicating active database schema evolution
- Supabase functions for server-side operations (employee management)
- Real-time capabilities for live data updates
- Type-safe database interactions through generated types

### Development Practices
- **Modern tooling**: ESLint, TypeScript strict mode, Prettier-equivalent formatting
- **Testing setup**: Unit tests with Vitest, E2E with Playwright
- **Build optimization**: Vite for fast development and optimized production builds
- **Component library**: Consistent UI through shadcn/ui (Radix UI primitives)

## Important Files and Roles

### Entry Points
- `src/main.tsx`: Standard React 18 entry point
- `src/App.tsx`: Route configuration and provider setup

### Core Business Logic
- `src/hooks/useAuth.tsx`: Authentication state management
- `src/lib/role-access.ts`: Permission checking utilities
- `src/integrations/supabase/`: Database client and type definitions

### UI Architecture
- `src/components/ui/`: Complete design system (40+ components)
- `src/components/layout/`: Application shell components
- `src/pages/`: Route-specific page components

### Configuration
- `package.json`: Rich dependency ecosystem with dev tooling
- `vite.config.ts`: Build configuration
- `supabase/config.toml`: Backend service configuration

## Business Logic Patterns

### Authentication & Authorization
- Multi-stage auth flow: loading → password setup → role check → content
- Route-level protection with automatic redirects
- Role-based menu filtering in sidebar

### Data Flow
- React Query for declarative data fetching
- Optimistic updates and caching strategies
- Real-time subscriptions for live features

### User Experience
- Responsive design with mobile-first approach
- Loading states to prevent content flashing
- Toast notifications for user feedback
- Consistent navigation patterns

## Security & Performance

### Security Measures
- Supabase handles authentication security
- Client-side role validation (server-side assumed)
- Input validation with Zod schemas
- Environment variable management for secrets

### Performance Characteristics
- Vite's fast HMR for development
- Code splitting by routes
- Asset optimization and bundling
- React Query's intelligent caching

## Development Readiness

The codebase appears production-ready with:
- Comprehensive error handling
- Type safety throughout
- Testing infrastructure
- Modern development tooling
- Scalable architecture patterns

## Areas for Further Investigation

While the provided context gives a complete architectural overview, specific implementation details in individual page components and custom hooks would benefit from targeted code reviews for complex business logic validation.