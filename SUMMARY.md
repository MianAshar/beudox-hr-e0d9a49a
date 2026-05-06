<!--
generated_by: tessera
source_sha: 3929819abf0e12b9f52e71b3a47fb8eb6bac72e3
generated_at: 2026-05-06T15:19:33.829Z
action: create
-->

# Beudox HR Portal - Analysis Summary

## Repository Overview

This is a comprehensive Human Resources Management System built as a modern React TypeScript application. The codebase consists of 242 files (2206KB) with 543 symbols, primarily TypeScript code. It's a frontend application that integrates with Supabase as the backend database and authentication provider.

## Key Architectural Insights

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript for type safety
- **Build System**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, Context API for global state
- **Routing**: React Router DOM with protected routes
- **Backend**: Supabase (PostgreSQL + Auth + Real-time + Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest for unit tests, Playwright for E2E tests

### Application Structure
The application follows a feature-based organization with clear separation of concerns:
- **Components**: Organized by feature (attendance, payroll, employee-profile, etc.)
- **Pages**: Route-based page components
- **Hooks**: Custom React hooks for business logic
- **Lib**: Utility functions and business logic
- **Integrations**: External service configurations

### Authentication & Authorization
- Role-based access control with multiple user roles (Admin, HR Manager, Manager, Employee)
- Protected routes with permission checks
- Mandatory password change for new users
- Session management with automatic redirects

## Important Files and Their Roles

### Core Application
- `src/App.tsx`: Main application with routing, providers, and protected route logic
- `src/main.tsx`: Application entry point
- `src/components/layout/AppLayout.tsx`: Main layout wrapper with sidebar and navigation

### Authentication
- `src/hooks/useAuth.tsx`: Authentication context and user state management
- `src/lib/role-access.ts`: Permission checking utilities
- `src/components/MandatoryPasswordChange.tsx`: Password reset modal for new users

### Business Logic Components
- `src/components/attendance/AttendanceSummary.tsx`: Complex analytics component calculating attendance rates, overtime, and detecting anomalies
- `src/components/SearchableEmployeeSelect.tsx`: Reusable employee selection component with search and filtering
- `src/components/NavLink.tsx`: Enhanced navigation link with active state styling

### Configuration
- `package.json`: Project dependencies and scripts
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration
- `supabase/config.toml`: Backend configuration
- `.env`: Environment variables for Supabase connection

## Database Schema Insights

Based on the 40+ migration files, the system manages a comprehensive HR database with:

- **Employee Lifecycle**: Profiles, onboarding, roles, departments
- **Time & Attendance**: Daily records, working hours, overtime tracking
- **Leave Management**: Requests, approvals, balance tracking
- **Payroll**: Monthly processing, payslips, salary history
- **Performance**: Evaluations, daily assessments, review cycles
- **Projects**: Management, task tracking, team assignments
- **Finance**: Invoicing, client management, expense tracking
- **Administration**: Policies, job descriptions, system settings

## Key Business Logic Patterns

### Attendance Analytics
The `AttendanceSummary` component demonstrates sophisticated business logic:
- Calculates attendance rates across working days
- Tracks overtime (regular and holiday)
- Identifies punctuality patterns and anomalies
- Detects frequent absences and incomplete records
- Provides insights for management decision-making

### Access Control
- Route-level protection with role checking
- UI component conditional rendering based on permissions
- Database query filtering by company and user roles

### Data Flow
- React Query manages server state with intelligent caching
- Optimistic updates for better UX
- Real-time subscriptions for live updates
- Form validation with comprehensive error handling

## Development and Deployment

### Scripts Available
- `npm run dev`: Development server
- `npm run build`: Production build
- `npm run test`: Unit tests
- `npm run lint`: Code linting
- `npm run preview`: Preview production build

### Environment Setup
- Requires Supabase project configuration
- Environment variables for API keys
- Database migrations must be applied

## Notable Implementation Details

1. **Mobile-First Design**: Responsive components that work across devices
2. **Accessibility**: Uses Radix UI primitives with proper ARIA attributes
3. **Performance**: Code splitting, lazy loading, and optimized re-renders
4. **Type Safety**: Comprehensive TypeScript usage throughout
5. **Real-time Features**: Live updates via Supabase subscriptions
6. **Error Boundaries**: Graceful error handling and user feedback

This codebase represents a production-ready HR management system with enterprise-level features, proper architecture, and modern development practices.