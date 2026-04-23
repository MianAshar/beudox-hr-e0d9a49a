<!--
generated_by: tessera
source_sha: 5907e75cc306a3ede9543ace57e5bf93a77fd02b
generated_at: 2026-04-23T22:09:30.254Z
action: create
-->

# Beudox HR - Analysis Summary

## Repository Overview

**Beudox HR** is a comprehensive Human Resources Management System built as a modern React TypeScript application. The codebase contains 220 files (2042KB) with 461 symbols, primarily written in TypeScript (165 files) and backed by a Supabase database with 30 migration files.

## Key Architectural Insights

### Technology Stack & Architecture
- **Frontend**: React 18 SPA with TypeScript, built with Vite
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **UI**: shadcn/ui component library with Tailwind CSS
- **State Management**: TanStack Query for server state, React Context for auth
- **Routing**: React Router v6 with protected routes and role-based access
- **Forms**: React Hook Form with Zod validation

### Application Structure
The application follows a feature-based organization with clear separation between:
- **Pages**: Route-based components (Dashboard, Employees, Projects, etc.)
- **Components**: Reusable UI elements organized by feature (employee-profile, leave, payroll)
- **Hooks**: Custom logic for authentication, sorting, toasts
- **Lib**: Utility functions for business logic (leave calculations, notifications, role access)
- **Integrations**: Supabase client and type definitions

## Core Business Domains

### 1. Employee Lifecycle Management
- Complete employee records with personal, employment, and organizational data
- Onboarding flow with invite emails and password setup
- Profile management with tabs for attendance, leave, payroll, documents

### 2. Time & Attendance
- Daily attendance tracking with check-in/out times
- Automated calculation of working hours and overtime
- Monthly attendance reports with present/absent/late summaries
- CSV upload functionality for bulk attendance data

### 3. Leave Management
- Multiple leave types (annual, sick, maternity, etc.)
- Leave request and approval workflow
- Balance tracking and utilization reporting
- Integration with attendance system

### 4. Payroll & Compensation
- Automated payroll processing with salary calculations
- Overtime and allowance management
- Payslip generation (PDF via Supabase Edge Functions)
- Salary history and increment tracking

### 5. Performance Management
- Scheduled performance evaluations
- Daily micro-evaluations for continuous feedback
- Competency-based rating systems
- Review scheduling based on hire dates

### 6. Project & Resource Management
- Project creation and team assignment
- Activity logging and progress tracking
- Client management and invoicing
- Resource allocation and utilization

### 7. Organizational Structure
- Department and role management
- Hierarchical reporting relationships
- Company-wide settings and policies
- HR policy documentation with rich text editing

## Important Files & Components

### Entry Points
- `src/main.tsx`: Application bootstrap
- `src/App.tsx`: Main routing and provider setup
- `src/pages/Index.tsx`: Placeholder component (not actively used)

### Authentication System
- `src/hooks/useAuth.tsx`: Authentication state and session management
- `src/lib/role-access.ts`: Role-based permission checking
- Protected route implementation with loading states

### Core Components
- `src/components/layout/AppLayout.tsx`: Main application shell
- `src/components/layout/AppSidebar.tsx`: Navigation and menu system
- `src/components/SearchableEmployeeSelect.tsx`: Employee selection with search
- `src/components/employee-profile/AttendanceTab.tsx`: Attendance data display

### Business Logic
- `src/lib/leave-utils.ts`: Leave balance calculations
- `src/lib/review-schedule.ts`: Performance review scheduling
- `src/lib/client-activity.ts`: Activity categorization and logging
- `src/lib/notifications.ts`: Notification system for alerts

### Configuration
- `package.json`: Dependencies and scripts
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration
- `.env`: Supabase environment variables

## Database Integration

The application uses Supabase with:
- **30 migration files** indicating extensive database schema
- **Edge Functions** for AI-powered attendance parsing and PDF generation
- **Real-time capabilities** for live updates
- **Authentication** with custom user roles and permissions

## Development & Build Setup

- **Package Manager**: npm/bun support
- **Development**: `npm run dev` with hot reload
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Linting**: ESLint configuration
- **Build**: Vite production build with optimization

## Security & Access Control

- Role-based access control with granular permissions
- Supabase Row Level Security policies
- Protected routes with authentication checks
- Secure password reset and invite flows

## Key Insights for Development

1. **Modular Architecture**: Well-organized component structure by feature
2. **Type Safety**: Comprehensive TypeScript usage throughout
3. **Modern React Patterns**: Hooks, context, and functional components
4. **Performance**: Query caching, code splitting, and optimized builds
5. **Scalability**: Supabase backend supports real-time features and edge computing
6. **User Experience**: Loading states, optimistic updates, and responsive design

This codebase represents a production-ready HR management system with enterprise-level features and modern development practices.