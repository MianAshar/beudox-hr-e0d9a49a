<!--
generated_by: tessera
source_sha: d00bdd87ef74df4d9f3d9037dee4c8e6c466a45a
generated_at: 2026-04-20T20:34:22.965Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React/TypeScript)  
**Primary Language**: TypeScript (149 files)  
**Total Files**: 201 (1.9MB)  
**Lines of Code**: ~25,000+ (estimated)

## Architecture & Technology Stack

### Frontend Framework
- **React 18** with TypeScript for type safety
- **Vite** as build tool with SWC compiler for fast development
- **React Router v6** for client-side routing
- **React Query (TanStack Query)** for server state management

### UI & Styling
- **Tailwind CSS** with custom design system
- **shadcn/ui** component library built on Radix UI
- **Lucide React** for icons
- **Recharts** for data visualization
- **CSS Custom Properties** for theming and dark mode support

### Backend & Database
- **Supabase** as BaaS (Backend as a Service)
  - PostgreSQL database with real-time subscriptions
  - Built-in authentication and authorization
  - Edge functions for server-side logic
  - Row Level Security (RLS) for data access control
- **27 SQL migrations** defining comprehensive HR schema

### Development Tools
- **TypeScript** with strict configuration
- **ESLint** for code quality
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **React Hook Form** with validation

## Application Features (Discovered from Code)

### 1. Employee Management
- Complete employee profiles with avatars, roles, and departments
- Organizational hierarchy with role-based permissions
- Employee search and selection components

### 2. Performance Management
- **Bi-annual Evaluations**: Comprehensive performance reviews with scoring (1-5 scale)
- **Daily Feedback System**: Peer and manager feedback with direction tracking
- **Evaluation Timeline**: Historical view of all evaluations with filtering
- **Recommendation System**: Career development suggestions

### 3. Leave Management
- Multiple leave types (annual, sick, maternity, etc.)
- Balance tracking with automatic calculations
- Approval workflows with multi-level authorization
- Leave request forms and status tracking

### 4. Payroll & Finance
- Automated payroll calculations including:
  - Base salary + overtime (regular + holiday)
  - Bonuses and loan deductions
- Monthly expense tracking and categorization
- Financial dashboard with trend analysis
- PKR currency formatting and reporting

### 5. Project Management
- Project creation and team assignment
- Task tracking and activity logging
- Team management modals
- Project status monitoring

### 6. Administrative Features
- **Settings Management**: Departments, roles, leave types, expense categories
- **HR Policies**: Rich text editor for company policies
- **Company Settings**: Organization-wide configuration
- **Evaluation Parameters**: Configurable performance criteria

### 7. Communication & Notifications
- Automated notification system for HR events
- Notification preferences management
- Real-time updates for collaborative features

## Codebase Structure Analysis

### Component Architecture
- **292 public symbols** across 357 total symbols
- **Atomic design pattern**: ui → feature → page components
- **16 custom functions** for business logic
- **5 interfaces** defining key data structures

### Key Component Categories
- **UI Components** (70+): Buttons, forms, tables, charts, etc.
- **Layout Components**: AppLayout, AppSidebar, TopBar, UserMenu
- **Feature Components**: EvaluationTimeline, FinanceSummary, SearchableEmployeeSelect
- **Business Logic**: Leave utilities, role access control, notifications

### Data Flow Patterns
- **React Query** for all server state management
- **Custom hooks** for complex state logic (useAuth, useToast, useSort)
- **Context API** for global application state
- **Optimistic updates** for better user experience

## Database Schema Insights

Based on the 27 Supabase migrations, the system manages:

- **Employee data**: Profiles, roles, departments, contact info
- **Performance data**: Evaluations, daily feedback, recommendations
- **Financial data**: Payroll, expenses, bonuses, deductions
- **Leave data**: Requests, balances, approval workflows
- **Project data**: Teams, tasks, activity logs
- **Organizational data**: Departments, roles, policies, settings

## Security & Access Control

- **Role-based permissions**: Employee → Team Lead → HR Manager → CEO
- **Database-level security**: Row Level Security policies
- **API security**: Server-side validation in Edge functions
- **Authentication**: Supabase Auth with JWT tokens

## Key Technical Insights

### Performance Optimizations
- Code splitting with React.lazy
- Query caching and background refetching
- Image optimization for avatars
- Bundle size management

### Developer Experience
- Hot module replacement in development
- Type-safe API calls with generated types
- Comprehensive component library
- Consistent code formatting and linting

### Scalability Considerations
- Modular component architecture
- Separated business logic from UI
- Database normalization for complex relationships
- Real-time subscriptions for live updates

## Notable Implementation Details

### Evaluation System
- Supports both quarterly and daily evaluations
- Role-based visibility (managers see recommendations, employees don't)
- Timeline view with unified sorting and filtering
- Star rating system with decimal precision

### Financial Dashboard
- 6-month trend analysis with interactive charts
- Month-over-month comparison with percentage changes
- Separate tracking of payroll vs. expenses
- PKR currency formatting with proper localization

### Employee Selection
- Searchable dropdown with avatar display
- Support for "All Employees" option
- Keyboard navigation and accessibility
- Initials fallback for missing avatars

### Logo Component
- Multiple variants (default, sidebar)
- Configurable size and wordmark display
- SVG assets with proper fallbacks

## Conclusion

Beudox HR is a comprehensive, well-architected HR management system built with modern web technologies. The codebase demonstrates strong engineering practices with proper separation of concerns, type safety, and scalable architecture. The application covers all major HR functions with a focus on user experience and data-driven decision making.

The analysis reveals a production-ready application with robust features, proper security implementation, and maintainable code structure suitable for enterprise deployment.