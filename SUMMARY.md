<!--
generated_by: tessera
source_sha: 99a40ba569414f43251b340331e742906aca530b
generated_at: 2026-05-06T15:49:16.492Z
action: create
-->

# Beudox HR Portal - Code Analysis Summary

## Repository Overview

This is a comprehensive Human Resources Management System built as a modern React/TypeScript frontend application. The codebase consists of 242 files (2202KB) with a primary focus on HR operations including employee management, attendance tracking, payroll processing, and organizational administration.

## Key Architectural Insights

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui components with Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Routing**: React Router Pages Router pattern

### Application Structure
The application follows a feature-based component organization with clear separation between UI primitives (`components/ui/`) and business feature components (`components/[feature]/`). Business logic is centralized in the `lib/` directory with utilities for attendance formatting, leave calculations, role access control, and notifications.

### Database Integration
The application uses Supabase extensively with 40+ migration files defining a comprehensive HR schema including employees, attendance records, payroll data, leave management, performance reviews, and system configuration.

## Important Files and Their Roles

### Core Application Files
- `src/main.tsx` - Application entry point and React root rendering
- `src/App.tsx` - Main application component with routing setup
- `src/pages/Index.tsx` - Root page component

### Key Components
- `src/components/layout/AppLayout.tsx` - Main application layout with sidebar
- `src/components/attendance/AttendanceSummary.tsx` - Complex attendance analytics dashboard
- `src/components/MandatoryPasswordChange.tsx` - Password setup modal for new users
- `src/components/SearchableEmployeeSelect.tsx` - Reusable employee selection component
- `src/components/BeudoxLogo.tsx` - Logo component with multiple variants

### Business Logic
- `src/lib/role-access.ts` - Role-based permission system
- `src/lib/attendance-format.ts` - Time formatting utilities
- `src/lib/leave-utils.ts` - Leave balance calculations
- `src/lib/notifications.ts` - Employee notification system
- `src/lib/review-schedule.ts` - Performance review scheduling

### Configuration
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `supabase/config.toml` - Backend configuration
- `.env` - Environment variables for Supabase

## Notable Implementation Details

### Authentication Flow
The application implements a secure authentication flow with temporary passwords that require mandatory change on first login, handled by the `MandatoryPasswordChange` component.

### Attendance Analytics
The `AttendanceSummary` component provides sophisticated analytics including attendance rates, overtime tracking, punctuality metrics, and anomaly detection (frequent absences, incomplete records).

### Component Patterns
- Extensive use of shadcn/ui components for consistent design
- Custom hooks for shared logic (authentication, sorting)
- TypeScript interfaces for type safety
- Responsive design with mobile-first approach

### Data Management
- Direct Supabase client usage throughout components
- Real-time capabilities available but not heavily utilized
- Comprehensive database schema with proper relationships

## Development Environment

The project is well-configured for modern development with:
- Hot module replacement via Vite
- TypeScript for type safety
- ESLint for code quality
- Comprehensive testing setup
- Supabase CLI integration for database management

## Areas of Complexity

1. **Attendance Processing**: Complex business logic for calculating working hours, overtime, and attendance analytics
2. **Payroll Calculations**: Server-side functions handle complex payroll computations
3. **Role-based Permissions**: Multi-level permission system across different user roles
4. **Performance Reviews**: Scheduled review system with increment proposals

This codebase represents a production-ready HR management system with enterprise-level features and robust architecture.