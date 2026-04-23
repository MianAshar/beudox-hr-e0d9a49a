<!--
generated_by: tessera
source_sha: 2a26b34948f18deb6f98a39c116758461a197ea5
generated_at: 2026-04-23T22:51:32.806Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React/TypeScript)  
**Primary Purpose**: Human Resources Management System  
**Architecture**: Single-Page Application with Supabase Backend

## Key Findings

### Application Domain
This is a comprehensive HR management platform that handles:
- Employee lifecycle management (onboarding, profiles, offboarding)
- Time & attendance tracking with automated overtime calculations
- Leave management with approval workflows
- Payroll processing and financial reporting
- Performance reviews and salary increment proposals
- Project management and team assignments
- Administrative settings and policy management

### Technology Stack Analysis
- **Frontend**: React 18 + TypeScript for type-safe development
- **Build System**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design tokens and shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions) for data and server logic
- **State Management**: React Query for server state, local state for UI
- **Testing**: Vitest for unit tests, Playwright for end-to-end testing

### Architectural Insights

#### Component Architecture
- **Feature-based organization**: Components grouped by business domain (employee-profile, leave, payroll, settings)
- **UI component library**: Extensive use of shadcn/ui for consistent, accessible interfaces
- **Layout system**: Modular layout components (AppLayout, AppSidebar, TopBar) for consistent navigation

#### Data Layer
- **Supabase integration**: Real-time database with Row Level Security
- **Edge Functions**: Server-side business logic for payroll generation, notifications, and data processing
- **Migration system**: Version-controlled database schema changes

#### Business Logic Distribution
- **Client-side**: UI logic, form validation, data formatting in `src/lib/`
- **Server-side**: Complex calculations (payroll, attendance parsing) in Supabase functions
- **Database**: Constraints and triggers for data integrity

### Important Files Identified

#### Core Application
- `src/main.tsx`: Application bootstrap and React rendering
- `src/App.tsx`: Main component with routing configuration
- `src/pages/Index.tsx`: Primary dashboard/landing page

#### Key Business Components
- `src/components/employee-profile/AttendanceTab.tsx`: Monthly attendance display with summaries
- `src/components/leave/ApplyLeaveModal.tsx`: Leave request interface
- `src/components/payroll/PayrollSummary.tsx`: Payroll data visualization
- `src/components/settings/CompanyTab.tsx`: Administrative configuration

#### Utility Libraries
- `src/lib/role-access.ts`: Permission checking and role management
- `src/lib/leave-utils.ts`: Leave balance calculations and date logic
- `src/lib/review-schedule.ts`: Performance review scheduling
- `src/lib/notifications.ts`: Notification system for alerts and approvals

#### Configuration
- `package.json`: Dependencies and scripts (uses Bun package manager)
- `vite.config.ts`: Build configuration with React and TypeScript support
- `supabase/config.toml`: Backend service configuration
- `.env`: Environment variables for Supabase connection

### Database Schema Insights
Based on migration files and component queries, the system manages:
- **Employee data**: Personal info, employment details, organizational hierarchy
- **Time tracking**: Daily attendance records with check-in/out times and overtime
- **Leave system**: Requests, approvals, and balance tracking
- **Payroll**: Monthly calculations with allowances, deductions, and historical records
- **Reviews**: Performance evaluations with customizable parameters
- **Projects**: Team assignments and activity logging

### Security & Access Control
- **Role-based permissions**: Hierarchical access (admin, manager, employee)
- **Row Level Security**: Database-level access control
- **Audit logging**: Login tracking with device/OS detection and geolocation
- **JWT authentication**: Secure token-based user sessions

### Development Workflow
- **Modern tooling**: Bun for package management, Vite for building
- **Code quality**: ESLint configuration, TypeScript for type safety
- **Testing strategy**: Unit tests with Vitest, E2E with Playwright
- **Git integration**: Automated documentation updates via Git hooks

## Recommendations for Development

1. **Component Consistency**: New components should follow the established patterns in `src/components/ui/`
2. **Business Logic**: Complex calculations should be moved to Supabase functions when possible
3. **Type Safety**: Leverage TypeScript interfaces for all data structures
4. **Testing**: Maintain test coverage for critical business logic
5. **Documentation**: Keep this analysis updated as the codebase evolves

This analysis provides a foundation for understanding the Beudox HR system's architecture, business logic, and development patterns.