<!--
generated_by: tessera
source_sha: 92611a51c56234256b71584661527317e866f551
generated_at: 2026-04-16T22:40:31.677Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend React Application  
**Primary Language**: TypeScript (132 files)  
**Total Files**: 180 (1677KB)  
**Stage**: Baseline Analysis

## Application Purpose

Beudox HR is a comprehensive Human Resources management system designed for modern businesses. It provides end-to-end HR functionality including employee management, performance evaluations, leave tracking, payroll processing, and organizational workflow management.

## Key Architectural Insights

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build System**: Vite with SWC compiler for fast development
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL + Auth + Real-time + Storage)
- **State Management**: TanStack Query for server state, React Context for auth
- **Routing**: React Router v6 with protected routes and role-based access
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: TipTap editor for HR policy documents

### Application Structure
- **Component Architecture**: Highly modular with reusable UI components
- **Feature Organization**: Components grouped by domain (evaluations, leave, settings, etc.)
- **Custom Hooks**: Business logic abstracted into reusable hooks
- **Type Safety**: Comprehensive TypeScript usage with auto-generated Supabase types

### Core Features Discovered
1. **Employee Management**: Complete CRUD operations with profile management
2. **Dual Evaluation System**: Quarterly formal reviews + daily peer feedback
3. **Leave Management**: Automated balance tracking and approval workflows
4. **Payroll Processing**: Automated payroll generation with PDF payslips
5. **Project & Client Management**: Business operation tracking
6. **Invoice Management**: Automated invoice generation
7. **HR Policy System**: Rich text documents with version control
8. **Notification System**: Real-time notifications and alerts
9. **Role-Based Security**: Granular permissions (CEO → HR Manager → Team Lead → Employee)

## Important Files and Their Roles

### Application Entry Points
- `src/main.tsx`: React 18 createRoot entry point
- `src/App.tsx`: Main app with routing configuration and providers
- `src/pages/Index.tsx`: Legacy Next.js style routing (not actively used)

### Authentication & Layout
- `src/hooks/useAuth.ts`: Authentication state and user context
- `src/lib/role-access.ts`: Permission checking logic
- `src/components/layout/AppLayout.tsx`: Main application layout
- `src/components/layout/AppSidebar.tsx`: Navigation sidebar with role-based menus

### Key Business Components
- `src/components/evaluations/EvaluationTimeline.tsx`: Timeline view for performance reviews
- `src/components/hr-policies/RichTextEditor.tsx`: TipTap-based policy editor
- `src/components/SearchableEmployeeSelect.tsx`: Employee search interface
- `src/components/BeudoxLogo.tsx`: Brand logo component with variants

### Configuration & Setup
- `package.json`: Dependencies including Supabase, TanStack Query, shadcn/ui
- `vite.config.ts`: Build configuration with path aliases and development tools
- `.env`: Supabase environment variables
- `supabase/config.toml`: Supabase project configuration

### Database Integration
- `src/integrations/supabase/client.ts`: Supabase client setup
- `src/integrations/supabase/types.ts`: Auto-generated database types
- `supabase/migrations/`: 23 SQL migration files for schema evolution

## Business Logic Patterns

### Evaluation System
- **Quarterly Reviews**: Formal performance evaluations with recommendations
- **Daily Feedback**: Peer-to-peer evaluation system
- **Visibility Controls**: Role-based access to evaluation data
- **Scoring System**: 1-5 star ratings with comments

### Leave Management
- **Balance Tracking**: Automatic leave accrual and usage tracking
- **Approval Chains**: Hierarchical approval process
- **Calendar Integration**: Working day calculations excluding holidays

### Payroll Processing
- **Automated Generation**: Monthly payroll with attendance data
- **Overtime Calculation**: Regular and holiday overtime rates
- **Document Generation**: PDF payslip creation via Edge Functions

### Notification System
- **Event-Driven**: Automated notifications for business events
- **Role-Based Targeting**: Notifications sent to relevant stakeholders
- **Real-time Delivery**: Supabase subscriptions for instant updates

## Data Flow and State Management

1. **Authentication Flow**: Supabase Auth → Context Provider → Route Protection
2. **Data Fetching**: Components → TanStack Query → Supabase Client → Database
3. **Optimistic Updates**: UI updates immediately, then syncs with server
4. **Real-time Updates**: Supabase subscriptions for live data synchronization
5. **Form Handling**: React Hook Form → Zod Validation → API Submission

## Security and Access Control

- **Authentication**: Supabase JWT-based authentication
- **Authorization**: Database RLS policies + application-level permission checks
- **Role Hierarchy**: CEO > HR Manager > Team Lead > Employee
- **Route Protection**: Protected routes with role-based access control
- **Data Visibility**: Filtered data access based on user role and relationships

## Development and Build Insights

### Development Workflow
- **Fast Refresh**: Vite HMR for instant updates
- **Type Checking**: Strict TypeScript configuration
- **Linting**: ESLint with React-specific rules
- **Testing**: Vitest for unit tests, Playwright for E2E

### Build Optimization
- **Code Splitting**: Automatic route-based chunking
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization
- **Bundle Analysis**: Development tools for performance monitoring

### Deployment Readiness
- **Static Generation**: Vite builds to deployable static files
- **Environment Handling**: Build-time environment variable injection
- **Database Migrations**: Version-controlled schema changes
- **Edge Functions**: Serverless functions for PDF generation and emails

## Notable Implementation Details

- **Component Library**: Extensive use of shadcn/ui (40+ components)
- **Design System**: Consistent theming with CSS variables and Tailwind
- **Accessibility**: Radix UI primitives provide built-in accessibility
- **Internationalization Ready**: Date formatting with date-fns
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Error Handling**: Comprehensive error boundaries and loading states
- **Performance**: Query caching, lazy loading, and optimistic updates

## Database Schema Complexity

The application manages a complex multi-tenant HR schema with:
- **23 Migration Files**: Progressive schema evolution
- **Employee Relationships**: Hierarchical organization structure
- **Evaluation Networks**: Complex relationships between evaluators and evaluatees
- **Financial Data**: Payroll, invoices, and expense tracking
- **Document Management**: Rich text policies and file attachments

This analysis provides a comprehensive understanding of the Beudox HR codebase, highlighting its sophisticated architecture, comprehensive feature set, and production-ready implementation patterns.