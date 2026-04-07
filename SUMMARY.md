<!--
generated_by: tessera
source_sha: 1cec2ce393d8f182112788746e7935917c082ccd
generated_at: 2026-04-07T21:17:57.033Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React/TypeScript SPA)  
**Primary Purpose**: Human Resources Management System  
**Lines of Code**: ~1.5MB across 162 files  
**Main Technologies**: React 18, TypeScript, Vite, Supabase, Tailwind CSS

## Key Architectural Insights

### 1. Modern React Architecture
- Built with React 18 and TypeScript for type safety and modern features
- Uses Vite for fast development and optimized builds
- Component-based architecture with clear separation between UI components and business logic
- Custom hooks for state management and side effects

### 2. Comprehensive UI Component Library
- Extensive use of shadcn/ui components (50+ UI primitives)
- Custom business components for HR-specific functionality
- Consistent design system with Tailwind CSS styling
- Accessible components built on Radix UI primitives

### 3. Supabase-Centric Backend Integration
- Full-stack application with Supabase handling database, auth, and serverless functions
- Real-time capabilities through Supabase subscriptions
- Type-safe database operations with generated TypeScript types
- Edge functions for complex business logic (payroll, invoicing, notifications)

### 4. Role-Based Access Control
- Four user roles: Employee, Team Lead, HR Manager, CEO
- Component-level permission checking
- Filtered data visibility based on user roles and relationships
- Secure API access through Supabase Row Level Security

### 5. Evaluation Management System
- Dual evaluation types: Quarterly (comprehensive) and Daily (quick feedback)
- Timeline-based presentation of evaluation history
- Directional daily evaluations (upward/downward feedback)
- Score-based assessment with comments and recommendations

## Important Files and Their Roles

### Application Entrypoints
- `src/main.tsx`: React application bootstrap and root rendering
- `src/App.tsx`: Main application component with routing configuration
- `src/pages/Index.tsx`: Primary dashboard/landing page

### Core Layout Components
- `src/components/layout/AppLayout.tsx`: Main application shell
- `src/components/layout/AppSidebar.tsx`: Navigation and menu system
- `src/components/layout/TopBar.tsx`: User actions and notifications

### Key Business Components
- `src/components/evaluations/EvaluationTimeline.tsx`: Evaluation history visualization
- `src/components/hr-policies/RichTextEditor.tsx`: Policy document editing
- `src/components/SearchableEmployeeSelect.tsx`: Employee selection interface
- `src/components/BeudoxLogo.tsx`: Brand identity component

### Settings Management
- `src/components/settings/CompanyTab.tsx`: Company configuration
- `src/components/settings/DepartmentsTab.tsx`: Department management
- `src/components/settings/RolesTab.tsx`: Role definition and permissions
- `src/components/settings/EvaluationParametersTab.tsx`: Assessment criteria

### Infrastructure Files
- `src/integrations/supabase/client.ts`: Backend API client
- `src/lib/utils.ts`: Utility functions and helpers
- `src/hooks/useAuth.ts`: Authentication state management
- `src/hooks/use-toast.ts`: Notification system

### Configuration Files
- `package.json`: Dependencies and scripts
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration
- `supabase/config.toml`: Backend configuration
- `.env`: Environment variables for Supabase

## Database and API Structure

### Key Database Tables
- `companies`, `departments`, `employees`: Organizational structure
- `evaluations`, `daily_evaluations`: Performance management
- `hr_policies`: Document management
- `payroll_records`, `invoices`: Financial operations

### Supabase Functions
- `generate-payroll`: Automated payroll calculations
- `generate-invoice-pdf`: PDF document generation
- `send-invoice-email`: Automated notifications
- `invite-employee`: User onboarding
- `deactivate-employee`: Account management

## Development and Testing Setup

- **Package Manager**: Bun for fast dependency resolution
- **Testing Framework**: Vitest for unit tests, Playwright for E2E
- **Code Quality**: ESLint configuration
- **Build Process**: Vite with TypeScript compilation
- **Database Migrations**: 18 SQL migration files in `supabase/migrations/`

## Notable Patterns and Conventions

1. **Component Naming**: PascalCase for components, camelCase for utilities
2. **File Organization**: Feature-based directory structure
3. **Type Safety**: Comprehensive TypeScript usage with generated database types
4. **State Management**: TanStack Query for server state, React hooks for UI state
5. **Styling**: Utility-first approach with Tailwind CSS classes
6. **Error Handling**: Toast notifications for user feedback
7. **Accessibility**: ARIA attributes and keyboard navigation support

## Areas of Interest for Future Development

- **Scalability**: Current architecture supports growth with modular components
- **Real-time Features**: Supabase subscriptions enable live updates
- **Mobile Responsiveness**: Component design supports responsive layouts
- **Internationalization**: Structure allows for i18n implementation
- **Analytics Integration**: Framework in place for adding tracking and metrics

This codebase represents a well-structured, production-ready HR management application with modern development practices and comprehensive feature coverage.