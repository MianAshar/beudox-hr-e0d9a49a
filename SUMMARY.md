<!--
generated_by: tessera
source_sha: 55b76f913056a5a1f57f2afcd0f1dbe37f5b5d46
generated_at: 2026-05-05T18:12:15.069Z
action: create
-->

# Repository Analysis Summary: Beudox HR Portal

## Overview

This repository contains a comprehensive Human Resources Management System frontend application built with modern React and TypeScript. The application serves as a complete HR portal with employee management, attendance tracking, payroll processing, and administrative tools.

## Key Architectural Insights

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript for type safety
- **Build System**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design tokens and shadcn/ui components
- **Backend**: Supabase (PostgreSQL with real-time capabilities)
- **Routing**: React Router v6
- **Testing**: Vitest for unit tests, Playwright for E2E testing

### Application Structure
The codebase follows a feature-based organization with clear separation between UI components, business logic, and integrations. The 241 files include extensive component libraries and utility functions.

### Core Features Discovered
1. **Employee Management**: Comprehensive profiles with personal info, job history, and documentation
2. **Attendance System**: Automated time tracking with analytics and anomaly detection
3. **Leave Management**: Request/approval workflows with balance tracking
4. **Payroll Processing**: Automated salary calculations with overtime and allowances
5. **Performance Reviews**: Evaluation system with scheduled reviews and increments
6. **Administrative Tools**: Company settings, policies, and user management

## Important Files and Roles

### Entry Points
- `src/main.tsx`: Application initialization and routing setup
- `src/pages/Index.tsx`: Main dashboard component

### Key Components
- `src/components/layout/AppLayout.tsx`: Main application shell
- `src/components/attendance/AttendanceSummary.tsx`: Complex analytics dashboard
- `src/components/MandatoryPasswordChange.tsx`: Authentication flow component
- `src/components/SearchableEmployeeSelect.tsx`: Reusable employee selection UI

### Business Logic
- `src/lib/role-access.ts`: Permission and access control functions
- `src/lib/attendance-format.ts`: Time formatting utilities
- `src/lib/notifications.ts`: Notification system logic
- `src/lib/leave-utils.ts`: Leave balance calculations

### Configuration
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration
- `supabase/config.toml`: Database configuration
- `.env`: Environment variables for Supabase

## Database Integration

The application uses Supabase with 40 migration files indicating a sophisticated database schema including:
- Employee records with authentication integration
- Attendance tracking with time calculations
- Leave management with approval workflows
- Payroll processing with complex calculations
- Project and team management
- Performance evaluation system

## Security and Access Control

- Role-based permissions (employee, manager, admin)
- Mandatory password changes on first login
- Supabase Row Level Security policies
- Secure authentication flow with session management

## UI/UX Approach

- Mobile-responsive design with adaptive layouts
- Consistent design system using shadcn/ui components
- Accessibility features with ARIA labels
- Loading states and error handling throughout
- Searchable interfaces for data selection

## Development Quality

- Strict TypeScript configuration
- ESLint for code quality
- Comprehensive testing setup
- Modular component architecture
- Clear separation of concerns

## Business Value

This application provides enterprise-grade HR management capabilities with:
- Automated attendance and payroll processing
- Comprehensive employee lifecycle management
- Performance tracking and reviews
- Administrative efficiency tools
- Real-time data insights and reporting

The codebase demonstrates production-ready quality with attention to user experience, performance, and maintainability.