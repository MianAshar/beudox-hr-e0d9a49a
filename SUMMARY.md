<!--
generated_by: tessera
source_sha: ee620c4cb89bbae5b73469faa38110b90495fae1
generated_at: 2026-04-27T23:33:58.166Z
action: create
-->

# Beudox HR Portal - Analysis Summary

## What I Discovered

This repository contains a comprehensive Human Resources Management System called "Beudox HR Portal" (also referred to as "Forte HR Portal" in some components). It's a modern, full-featured web application built with React and TypeScript that provides complete HR functionality for managing employees, attendance, payroll, and organizational operations.

## Key Architectural Insights

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite for fast development and building
- **Backend**: Supabase (PostgreSQL database + Authentication + Edge Functions)
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, Context for auth
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router with protected routes and role-based access

### Application Structure
The codebase is well-organized with clear separation of concerns:
- **Components**: Reusable UI components in `src/components/ui/`, feature-specific components by domain
- **Pages**: Route-based page components in `src/pages/`
- **Hooks**: Custom React hooks for business logic
- **Lib**: Utility functions and business logic
- **Integrations**: External service configurations

### Core Features Identified
1. **Employee Management**: Complete CRUD operations with detailed profiles
2. **Attendance Tracking**: Excel import with AI parsing, time calculations, overtime
3. **Leave Management**: Request/approval system with balance tracking
4. **Payroll Processing**: Complex salary calculations with PDF generation
5. **Performance Evaluations**: Regular and daily evaluation systems
6. **Project Management**: Team assignments and progress tracking
7. **Financial Management**: Invoicing, client management
8. **HR Administration**: Policies, job descriptions, company settings

## Important Files and Their Roles

### Application Entry Points
- `src/main.tsx`: Renders the React app
- `src/App.tsx`: Main app component with routing and providers

### Key Business Components
- `AttendanceUploadFlow.tsx`: Complex multi-step attendance import wizard
- `MandatoryPasswordChange.tsx`: First-login password change modal
- `SearchableEmployeeSelect.tsx`: Reusable employee selection component
- `BeudoxLogo.tsx`: Logo component with variant support

### Layout System
- `AppLayout.tsx`: Main application shell with sidebar
- `AppSidebar.tsx`: Navigation menu
- `TopBar.tsx`: Top navigation with user menu

### Authentication Flow
- Role-based routing protection
- Mandatory password change on first login
- JWT-based auth with Supabase

## Business Logic Highlights

### Attendance Processing
The attendance upload system is particularly sophisticated:
- Excel file parsing using SheetJS library
- AI-powered data normalization via Supabase Edge Function
- Automatic calculation of working hours, overtime, and penalties
- Handling of unmatched employee codes
- Batch processing with progress tracking

### Access Control
- Hierarchical role system with granular permissions
- Route-level protection
- Component-level access restrictions

### Data Relationships
- Complex relationships between employees, departments, roles
- Attendance data linked to payroll calculations
- Leave balances and approval workflows
- Project assignments and team management

## Technical Implementation Notes

### State Management Strategy
- React Query for API state and caching
- Context API for authentication state
- Local state for UI interactions
- Optimistic updates where appropriate

### UI/UX Approach
- Consistent design system using shadcn/ui
- Accessible components with Radix UI
- Toast notifications for user feedback
- Loading states and error handling

### Development Experience
- TypeScript for type safety
- ESLint for code quality
- Vitest for unit testing
- Playwright for E2E testing
- Hot reload development with Vite

## Repository Statistics
- **Total Files**: 225
- **Primary Language**: TypeScript (166 files)
- **Database Migrations**: 34 SQL files indicating complex schema
- **UI Components**: Extensive component library (70+ UI components)
- **Public Interfaces**: 68+ React components
- **Test Coverage**: Basic test setup with Vitest

This is a production-ready, enterprise-grade HR management system with sophisticated features and clean, maintainable code architecture.