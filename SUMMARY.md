<!--
generated_by: tessera
source_sha: 1cec2ce393d8f182112788746e7935917c082ccd
generated_at: 2026-04-07T21:17:04.205Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend React Application  
**Primary Language**: TypeScript (119 files)  
**Lines of Code**: ~15,000+ (estimated)  
**Architecture**: Modern React SPA with Supabase backend

## What I Discovered

### 1. Application Purpose & Scope
Beudox HR is a comprehensive Human Resources Management System designed for organizations to manage their workforce. The application provides tools for employee management, performance evaluations, payroll processing, project management, and more.

### 2. Technology Architecture
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Routing**: React Router v6 with role-based access control
- **State Management**: React Query for server state, custom hooks for client state
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: Tiptap editor for HR policies
- **Charts**: Recharts for data visualization

### 3. Key Architectural Insights

#### Component Hierarchy
- **UI Components** (`src/components/ui/`): 40+ reusable primitives from shadcn/ui
- **Layout Components** (`src/components/layout/`): AppLayout, AppSidebar, TopBar
- **Feature Components** (`src/components/[feature]/`): Domain-specific components
- **Pages** (`src/pages/`): Route-level components with business logic

#### State Management Strategy
- **Server State**: React Query handles all API data with caching and optimistic updates
- **Authentication**: Custom AuthProvider managing Supabase sessions
- **Client State**: React hooks for local component state

#### Role-Based Access Control
Five distinct user roles with granular permissions:
- **CEO**: Full system access
- **HR Manager**: Employee management, evaluations, policies
- **Finance Manager**: Payroll, invoices, financial operations
- **Team Lead**: Project management, team evaluations
- **Employee**: Personal dashboard and self-service features

### 4. Business Logic & Features

#### Core HR Functionality
- **Employee Management**: Complete lifecycle from hiring to offboarding
- **Performance Management**: Dual evaluation system (quarterly formal + daily feedback)
- **Payroll Processing**: Automated salary calculation with PDF payslips
- **Project Management**: Team assignments and progress tracking
- **Client Management**: Relationship management with invoicing
- **HR Policies**: Rich text policy documents
- **Loan Management**: Employee loan tracking
- **Attendance Tracking**: Time and attendance monitoring

#### Data Flow Patterns
- Supabase real-time subscriptions for live updates
- Optimistic UI updates for better user experience
- Form validation with comprehensive error handling
- PDF generation for invoices and payslips

### 5. Database Integration
- **18 SQL migrations** indicating evolved schema
- **Supabase Edge Functions** for business logic (payroll, invoices, notifications)
- **Row Level Security** policies for data access control
- **Real-time capabilities** for live dashboard updates

### 6. Development Infrastructure
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Code Quality**: ESLint, TypeScript strict mode
- **Development Server**: Vite on port 8080 with HMR
- **Build Optimization**: Code splitting, asset optimization

## Important Files & Their Roles

### Application Entry Points
- `src/main.tsx`: React application bootstrap
- `src/App.tsx`: Main component with routing and providers

### Core Business Logic
- `src/hooks/useAuth.ts`: Authentication state management
- `src/lib/role-access.ts`: Role-based routing permissions
- `src/components/evaluations/EvaluationTimeline.tsx`: Complex evaluation display logic

### Key Components Analyzed
- `BeudoxLogo.tsx`: Brand component with variant support
- `NavLink.tsx`: React Router wrapper with active state styling
- `SearchableEmployeeSelect.tsx`: Advanced employee selection with search
- `RichTextEditor.tsx`: Tiptap-based editor for policies

### Configuration Files
- `package.json`: 70+ dependencies, modern tooling
- `vite.config.ts`: Build configuration with path aliases
- `supabase/config.toml`: Backend configuration

## Architectural Strengths

1. **Modern Tech Stack**: Latest versions of React, TypeScript, and tooling
2. **Scalable Architecture**: Component composition and separation of concerns
3. **Type Safety**: Comprehensive TypeScript usage throughout
4. **User Experience**: Optimistic updates, loading states, error handling
5. **Accessibility**: ARIA compliance and keyboard navigation
6. **Performance**: Code splitting, caching, and optimization
7. **Developer Experience**: Hot reload, type checking, comprehensive tooling

## Key Insights for Development

- **Role-based UI**: Components conditionally render based on user permissions
- **Evaluation Complexity**: Dual evaluation system with different visibility rules
- **Real-time Features**: Supabase subscriptions for live data updates
- **PDF Generation**: Server-side PDF creation for documents
- **Form Patterns**: Consistent validation and error handling across the app
- **Component Reusability**: Extensive use of shared UI components

This analysis reveals a well-architected, feature-rich HR management system built with modern best practices and attention to user experience and developer productivity.