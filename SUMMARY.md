<!--
generated_by: tessera
source_sha: d2dd5800dede643bd5c76facc7cd3e7c05224a68
generated_at: 2026-05-05T12:07:36.157Z
action: create
-->

# Beudox HR Portal - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend React Application  
**Primary Language**: TypeScript (176 files)  
**Total Files**: 241 (2201KB)  
**Symbols**: 543 total, 418 public

## What I Discovered

### Application Purpose
This is a comprehensive Human Resources Management System called "Beudox HR Portal" (also branded as "Forte HR Portal"). It provides a complete suite of HR functionality including employee management, attendance tracking, payroll processing, leave management, performance evaluations, and project management.

### Architecture Insights

**Frontend Stack**:
- Modern React 18 application with TypeScript
- Vite build system for fast development
- Component-based architecture with shadcn/ui design system
- Client-side routing with React Router
- Server state management via TanStack Query
- Supabase integration for backend services

**Key Architectural Decisions**:
- **Protected Routes**: Authentication and role-based access control at the route level
- **Layout Composition**: AppLayout component wraps all protected content
- **Component Organization**: Features grouped by domain (attendance, payroll, employee-profile, etc.)
- **State Management**: Combination of React Query for server state and Context API for global state
- **Form Handling**: React Hook Form with Zod validation throughout

### Important Files and Their Roles

**Core Application Files**:
- `src/main.tsx`: Simple entry point rendering the App component
- `src/App.tsx`: Main application with routing, providers, and protected route logic
- `src/components/layout/AppLayout.tsx`: Main layout structure with sidebar and navigation

**Authentication & Security**:
- `src/hooks/useAuth.tsx`: Authentication state and employee data management
- `src/components/MandatoryPasswordChange.tsx`: Password change enforcement
- `src/lib/role-access.ts`: Permission checking utilities

**Business Logic Components**:
- `src/components/attendance/AttendanceSummary.tsx`: Complex analytics component with metrics calculation
- `src/components/SearchableEmployeeSelect.tsx`: Reusable employee selection component
- `src/components/BeudoxLogo.tsx`: Logo component with variant support
- `src/components/NavLink.tsx`: Enhanced NavLink with active state handling

**Utility Libraries**:
- `src/lib/utils.ts`: Core utilities including className merging
- `src/lib/attendance-format.ts`: Time formatting functions
- `src/lib/leave-utils.ts`: Leave balance calculations
- `src/lib/client-activity.ts`: Activity categorization and descriptions

### Database Integration
The application integrates with Supabase, evidenced by:
- 40 SQL migration files in `supabase/migrations/`
- Supabase client configuration in `src/integrations/supabase/`
- Environment variables for Supabase credentials
- Row Level Security and real-time features implied

### Component Patterns Observed

**Form Components**:
- Consistent use of React Hook Form
- Zod schema validation
- Error handling and loading states
- Modal-based create/edit interfaces

**Data Display**:
- Table components with sorting capabilities
- Card-based layouts for dashboards
- Avatar components with fallback initials
- Chart integration (Recharts)

**Navigation**:
- Sidebar navigation with role-based menu items
- Protected routes with automatic redirects
- Breadcrumb navigation patterns

### Key Features Identified

1. **Employee Management**: Complete CRUD operations with profile tabs
2. **Attendance System**: Automated tracking with analytics
3. **Leave Management**: Request/approval workflows
4. **Payroll Processing**: Automated calculations and payslips
5. **Performance Evaluations**: Regular and daily evaluation systems
6. **Project Management**: Team assignments and task tracking
7. **Financial Management**: Invoicing and reporting
8. **HR Documentation**: Policy and job description management

### Technical Highlights

- **Type Safety**: Comprehensive TypeScript usage throughout
- **Accessibility**: shadcn/ui components built on Radix UI primitives
- **Developer Experience**: Modern tooling (Vite, ESLint, Vitest)
- **Scalability**: Modular component architecture
- **User Experience**: Loading states, error handling, and responsive design

## Documentation Generated

Based on this analysis, I generated comprehensive documentation:

1. **README.md**: Project overview, setup instructions, and feature descriptions
2. **llms.txt**: Technical context for AI assistants including architecture details
3. **SUMMARY.md**: This analysis summary

The documentation captures the application's purpose as a full-featured HR management system, its modern React architecture, and key technical decisions that make it maintainable and scalable.