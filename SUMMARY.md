<!--
generated_by: tessera
source_sha: ec2e01acba141080ac54074ec9a8a8aea5064674
generated_at: 2026-04-23T10:41:03.431Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React SPA)  
**Primary Language**: TypeScript (163 files)  
**Total Files**: 217 (2005KB)  
**Symbols**: 424 total, 319 public

## Application Purpose

Beudox HR is a comprehensive Human Resources Management System designed to handle all aspects of employee lifecycle management, from onboarding to payroll processing. The application provides a web-based interface for HR administrators, managers, and employees to manage organizational workflows.

## Key Architectural Insights

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC compiler
- **UI Library**: shadcn/ui (Radix UI primitives) + Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest (unit) + Playwright (e2e)

### Application Structure
- **Component Architecture**: Well-organized with reusable UI components and feature-specific components
- **Routing**: Extensive route structure covering all HR functions (40+ routes)
- **Authentication**: Role-based access control with protected routes
- **Database**: 29 SQL migrations indicating complex schema with relationships

### Core Features Identified
1. **Employee Management**: Profiles, forms, lifecycle management
2. **Attendance Tracking**: Daily records, working hours, overtime
3. **Leave Management**: Requests, balances, approvals
4. **Payroll Processing**: Salary calculations, payslips
5. **Performance Evaluations**: Regular and daily assessments
6. **Project Management**: Teams, tasks, activity logs
7. **Client & Invoice Management**: CRM and billing
8. **HR Policies**: Document management
9. **Job Descriptions**: Role definitions
10. **Finance**: Expense tracking and summaries

## Important Files and Components

### Entry Points
- `src/main.tsx`: Application bootstrap
- `src/App.tsx`: Main routing and layout configuration
- `src/pages/Index.tsx`: Root page

### Key Components
- `AppLayout.tsx`: Main application shell
- `AppSidebar.tsx`: Navigation component
- `BeudoxLogo.tsx`: Branding component
- `SearchableEmployeeSelect.tsx`: Employee selection UI
- `AttendanceTab.tsx`: Attendance data display

### Configuration Files
- `vite.config.ts`: Build configuration (port 8080, HMR)
- `package.json`: Dependencies and npm scripts
- `tailwind.config.ts`: Styling configuration
- `.env`: Supabase environment variables

### Business Logic
- `src/lib/role-access.ts`: Permission system
- `src/lib/leave-utils.ts`: Leave calculations
- `src/lib/review-schedule.ts`: Performance review logic
- `src/lib/notifications.ts`: Notification system

## Database Insights

The application uses Supabase with extensive database schema:
- **Migrations**: 29 SQL files covering initial setup through feature additions
- **Tables**: Employees, attendance, leave, payroll, evaluations, projects, clients, invoices, policies
- **Relationships**: Complex foreign key relationships between entities
- **Functions**: Supabase Edge Functions for payroll generation, notifications, etc.

## Development Environment

- **Port**: 8080 (development server)
- **Package Manager**: npm/bun supported
- **Scripts**: dev, build, test, lint, preview
- **Environment**: Requires Supabase credentials
- **Hot Reload**: Configured with HMR

## Code Quality Observations

- **TypeScript**: Fully typed codebase
- **Component Library**: Consistent use of shadcn/ui
- **Code Organization**: Clear separation of concerns
- **Testing**: Unit and e2e test setup
- **Linting**: ESLint configuration
- **Imports**: Path aliases (@/ for src/)

## Notable Patterns

- **Protected Routes**: Authentication and role-based route protection
- **Query Caching**: Extensive use of TanStack Query
- **Form Validation**: Zod schemas with React Hook Form
- **Real-time Updates**: Supabase subscriptions for live data
- **Modular Components**: Reusable UI components
- **Custom Hooks**: Business logic abstracted into hooks

## Areas for Further Investigation

- Supabase Edge Functions (located in supabase/functions/)
- Specific business logic implementations in lib/ directory
- Testing coverage and test files
- Performance optimization patterns
- Error handling and loading states

This analysis provides a comprehensive understanding of the Beudox HR codebase, establishing a foundation for ongoing documentation and development.