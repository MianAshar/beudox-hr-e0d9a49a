<!--
generated_by: tessera
source_sha: b5485c341bfd9d2120406250767f8b36d408f25c
generated_at: 2026-04-19T21:33:49.847Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React SPA)  
**Primary Language**: TypeScript  
**Framework**: React 18 + Vite  
**Backend**: Supabase (PostgreSQL + Auth)  
**UI Library**: shadcn/ui (Radix UI)  
**Styling**: Tailwind CSS  
**State Management**: React Query (TanStack)  
**Routing**: React Router v6  

## Architecture Insights

### Application Structure
The application follows a modern React architecture with clear separation of concerns:

- **Pages**: Route-based components organized by feature
- **Components**: Reusable UI components with feature-specific subdirectories
- **Hooks**: Custom hooks for business logic and data fetching
- **Lib**: Utility functions and business logic
- **Integrations**: External service configurations (Supabase)

### Key Architectural Patterns
1. **Protected Routes**: Role-based access control with route-level permissions
2. **Provider Composition**: Multiple context providers (Auth, Query, Theme, Tooltip)
3. **Component Composition**: Extensive use of compound components and render props
4. **Optimistic Updates**: React Query for immediate UI feedback
5. **Custom Hooks**: Business logic abstracted into reusable hooks

### Database Integration
- **Supabase Client**: Centralized database and auth operations
- **React Query**: Declarative data fetching with caching
- **Real-time Subscriptions**: Live data updates where needed
- **Edge Functions**: Server-side logic for complex operations (payroll, emails)

## Core Features Discovered

### 1. Authentication & User Management
- JWT-based authentication with Supabase Auth
- Role-based permissions (CEO, HR Manager, Team Lead, Employee)
- Password reset and employee invitation flows
- Session management with automatic token refresh

### 2. Employee Lifecycle Management
- Complete CRUD operations for employee records
- Profile management with avatar uploads
- Department and role assignments
- Employment status tracking and deactivation

### 3. Performance Management System
- **Quarterly Evaluations**: Bi-annual reviews with scoring (1-5 scale) and recommendations
- **Daily Evaluations**: Real-time feedback with directional ratings
- **Evaluation Timeline**: Historical view with role-based visibility filtering
- Custom evaluation parameters configurable in settings

### 4. Financial Management
- **Payroll Processing**: Automated calculations including overtime, bonuses, and deductions
- **Loan Management**: Employee loans with repayment tracking
- **Financial Dashboard**: 6-month trend analysis with interactive charts
- **Invoice Management**: Client billing with PDF generation
- **Expense Tracking**: Monthly expense recording and reporting

### 5. Leave Management
- Multiple leave types (annual, sick, maternity, etc.)
- Balance tracking with automatic accrual
- Approval workflows with hierarchical permissions
- Calendar integration and conflict prevention

### 6. Project & Task Management
- Project creation with team assignment
- Task management within projects
- Activity logging and progress tracking
- Client relationship management
- Project categorization and status management

### 7. HR Administration
- Company-wide settings configuration
- Department and role management
- Public holiday management
- Rich text HR policy documents
- System preferences and customization

## Technical Implementation Details

### Component Architecture
- **UI Primitives**: 50+ shadcn/ui components for consistent design
- **Layout Components**: AppLayout, Sidebar, TopBar, UserMenu for navigation
- **Feature Components**: Specialized components for evaluations, finance, payroll, etc.
- **Form Components**: Complex forms with validation using React Hook Form + Zod

### Data Flow Patterns
- **Queries**: Declarative data fetching with React Query hooks
- **Mutations**: Optimistic updates with error handling and rollbacks
- **Real-time**: Supabase subscriptions for live updates
- **Caching**: Intelligent cache invalidation based on data dependencies

### Business Logic
- **Role Access Control**: Permission checking at route and component levels
- **Date Utilities**: Custom date formatting and manipulation functions
- **Leave Calculations**: Complex business rules for leave balances and accruals
- **Payroll Calculations**: Overtime, bonus, and deduction computations

## Database Schema Understanding

### Core Entities
- **Companies**: Multi-tenant architecture support
- **Employees**: Central user entity with roles and departments
- **Evaluations**: Performance review data with quarterly and daily variants
- **Payroll Records**: Monthly compensation data with detailed breakdowns
- **Leave Requests**: Leave management with approval workflows
- **Projects**: Project definitions with team assignments
- **Tasks**: Granular task tracking within projects
- **Invoices**: Client billing records
- **HR Policies**: Document management with rich text content

### Key Relationships
- Employees linked to companies with role-based access
- Evaluations connecting evaluators and evaluatees
- Payroll aggregated monthly by employee
- Projects with many-to-many employee relationships
- Leave requests with hierarchical approval chains

## Configuration and Build System

### Development Environment
- **Vite**: Fast development server with HMR
- **TypeScript**: Strict type checking and IntelliSense
- **ESLint**: Code quality and consistency enforcement
- **Path Aliases**: `@/` for clean imports

### Build Configuration
- **SWC**: Fast TypeScript compilation
- **Asset Optimization**: Image and font optimization
- **Dependency Optimization**: Pre-bundling of React and core libraries
- **Development Tools**: Component tagging for development insights

### Testing Infrastructure
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing for critical flows
- **Test Setup**: Shared test configuration and utilities

## Security and Performance

### Security Measures
- **Row Level Security**: Database-level access control via Supabase RLS
- **Input Validation**: Zod schemas for runtime type validation
- **Authentication**: Secure JWT token management
- **Authorization**: Role-based permissions throughout the application

### Performance Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: Component and image lazy loading
- **Memoization**: React.memo and useMemo for expensive computations
- **Query Optimization**: Efficient database queries with proper indexing
- **Caching**: React Query caching with intelligent invalidation

## Key Files and Their Purposes

### Application Entry Points
- `src/main.tsx`: React application bootstrap
- `src/App.tsx`: Main application component with routing setup

### Core Components
- `src/components/layout/AppLayout.tsx`: Main application layout
- `src/components/layout/AppSidebar.tsx`: Navigation sidebar
- `src/components/SearchableEmployeeSelect.tsx`: Employee selection interface
- `src/components/EvaluationTimeline.tsx`: Performance history visualization
- `src/components/FinanceSummary.tsx`: Financial dashboard with charts

### Business Logic
- `src/hooks/useAuth.ts`: Authentication state management
- `src/lib/role-access.ts`: Permission checking utilities
- `src/lib/leave-utils.ts`: Leave calculation functions
- `src/lib/client-activity.ts`: Activity logging utilities

### Configuration
- `vite.config.ts`: Build system configuration
- `package.json`: Dependencies and scripts
- `tailwind.config.ts`: Styling configuration
- `.env`: Environment variables for Supabase

## Summary of Analysis

This is a well-architected, feature-rich HR management system built with modern React patterns and best practices. The codebase demonstrates:

- **Scalable Architecture**: Clean separation of concerns with reusable components
- **Type Safety**: Comprehensive TypeScript usage throughout
- **Performance**: Optimized data fetching and rendering patterns
- **Security**: Proper authentication and authorization implementation
- **User Experience**: Rich, interactive interfaces with real-time updates
- **Maintainability**: Well-organized code structure with clear naming conventions

The application successfully implements a complete HR suite with sophisticated business logic for payroll, evaluations, and workflow management, making it suitable for small to medium-sized organizations requiring comprehensive HR functionality.