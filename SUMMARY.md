<!--
generated_by: tessera
source_sha: 9c111b985ea060cf573e05d196278bcc245cedcc
generated_at: 2026-04-30T11:06:58.788Z
action: create
-->

# Repository Analysis Summary: Beudox HR Portal

## What I Discovered

This repository contains a comprehensive Human Resources Management System (HRMS) built as a modern web application. The codebase represents a production-ready SaaS platform designed for companies to manage their workforce, featuring over 200 TypeScript files and 37 database migrations.

## Key Architectural Insights

### Technology Stack & Architecture
- **Frontend**: React 18 + TypeScript + Vite, following modern best practices with component-driven architecture
- **UI Framework**: Radix UI primitives with Tailwind CSS for accessible, customizable interfaces
- **State Management**: React Query for server state, Context for global state, local state for UI
- **Backend**: Supabase (PostgreSQL + Auth + Real-time + Edge Functions)
- **Forms**: React Hook Form with Zod validation for type-safe, robust form handling
- **Routing**: React Router with protected routes and role-based access control

### Application Structure
The application is organized around HR domains with clear feature boundaries:
- **Authentication**: Login, password reset, mandatory password changes
- **Employee Management**: Profiles, hierarchies, organizational structure
- **Attendance**: Time tracking, overtime, reporting, and analytics
- **Leave Management**: Request/approval workflows for various leave types
- **Payroll**: Automated calculations, payslips, salary history
- **Performance**: Regular evaluations, daily feedback, review cycles
- **Projects**: Team management, task tracking, client relationships
- **Administrative**: Policies, job descriptions, company settings

### Notable Implementation Details

1. **Role-Based Security**: Granular permissions with route-level protection and database RLS policies
2. **Real-time Features**: Live updates for attendance, notifications, and collaborative editing
3. **Complex Calculations**: Server-side functions handle payroll generation, PDF creation, and AI-powered attendance parsing
4. **Multi-tenant Architecture**: Company-scoped data isolation for SaaS functionality
5. **Rich Analytics**: Dashboard with visual metrics, attendance summaries, and financial insights
6. **File Management**: Document uploads, avatar management, and Excel import/export capabilities

## Important Files & Components

### Core Application Files
- `src/App.tsx`: Main routing configuration with 30+ protected routes
- `src/main.tsx`: React 18 bootstrap
- `src/components/layout/AppLayout.tsx`: Main application shell with navigation

### Key Business Logic Components
- `src/components/attendance/AttendanceSummary.tsx`: Complex analytics component calculating attendance metrics, overtime, and anomalies
- `src/components/MandatoryPasswordChange.tsx`: Secure password update flow for new users
- `src/components/SearchableEmployeeSelect.tsx`: Reusable employee selection with search functionality

### Utility Libraries
- `src/lib/role-access.ts`: Permission checking functions
- `src/lib/attendance-format.ts`: Time formatting utilities
- `src/lib/leave-utils.ts`: Leave balance calculations
- `src/lib/notifications.ts`: Notification targeting logic

### Configuration & Setup
- `package.json`: Comprehensive dependency management with 70+ packages
- `vite.config.ts`: Build optimization and development server config
- `.env`: Supabase configuration
- `supabase/migrations/`: 37 database schema migrations

## Business Logic & Data Flow

### Authentication Flow
1. User logs in with Supabase Auth
2. New users are forced through mandatory password change
3. Session management with automatic refresh
4. Role-based route protection

### Attendance System
- Records check-in/check-out times
- Calculates working hours and overtime
- Handles holidays, weekends, and leave integration
- Provides detailed analytics and anomaly detection

### Payroll Processing
- Automated salary calculations
- Overtime and allowance processing
- PDF payslip generation via serverless functions
- Historical salary tracking

### Evaluation System
- Regular performance reviews
- Daily feedback mechanisms
- Configurable evaluation parameters
- Review schedule management

## Development & Deployment

### Development Environment
- Vite for fast development with HMR
- TypeScript for type safety
- ESLint for code quality
- Vitest for unit testing
- Playwright for E2E testing

### Production Build
- Optimized bundling with tree shaking
- Static asset optimization
- Environment-based configuration
- Deployable to any static hosting platform

## Security & Performance

### Security Measures
- Supabase Auth with secure session handling
- Row-level security in database
- Input validation with Zod schemas
- Company-scoped data isolation

### Performance Features
- React Query caching and optimistic updates
- Code splitting by routes
- Lazy loading of components
- Database query optimization
- Real-time subscriptions for live updates

This codebase demonstrates enterprise-level software development practices with a focus on user experience, security, and maintainability. The application successfully balances complex business requirements with modern web development best practices.