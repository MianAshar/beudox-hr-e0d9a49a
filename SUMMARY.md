<!--
generated_by: tessera
source_sha: d555f419dd478f04f76a7eee67dfc80145106d69
generated_at: 2026-04-13T11:02:03.589Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview
This is a comprehensive Human Resources Management System called "Beudox HR" built as a modern React single-page application. The codebase contains 180 files with 304 symbols, primarily written in TypeScript, representing a fully-featured HR platform.

## Key Architectural Insights

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite build system
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **State Management**: TanStack Query for server state, React Context for auth
- **Routing**: React Router v6 with protected routes
- **Forms**: React Hook Form with Zod validation

### Application Structure
The application follows a well-organized component-based architecture:
- **Layout Components**: App shell with collapsible sidebar and top navigation
- **Feature Components**: Modular components for HR features (evaluations, leave, payroll)
- **UI Components**: Extensive shadcn/ui component library usage
- **Pages**: Route-based page components with consistent layout wrapping

### Core Features Identified
1. **Authentication System**: Complete login/logout with password reset
2. **Employee Management**: Profiles, roles, and organizational structure
3. **Performance Management**: Quarterly and daily evaluation systems
4. **Leave Management**: Request and approval workflows
5. **Payroll Processing**: Automated payroll with payslip generation
6. **Project Management**: Client and project tracking
7. **Financial Management**: Invoicing and expense tracking
8. **HR Policies**: Rich text document management
9. **Settings**: Configurable company parameters

### Security & Access Control
- **Role-Based Access**: CEO, HR Manager, Team Lead, and Employee roles
- **Route Protection**: Authentication and authorization guards
- **Database Security**: Row Level Security (RLS) policies
- **Permission Checks**: Component-level access control

## Important Files and Their Roles

### Application Entry Points
- `src/main.tsx`: React application bootstrap
- `src/App.tsx`: Main routing configuration with 20+ protected routes
- `src/pages/Index.tsx`: Next.js style page routing (though using Vite)

### Authentication & Authorization
- `src/hooks/useAuth.tsx`: Authentication context provider
- `src/lib/role-access.ts`: Permission checking utilities
- `src/components/layout/AppLayout.tsx`: Protected layout wrapper

### Key Business Components
- `src/components/evaluations/EvaluationTimeline.tsx`: Performance history visualization
- `src/components/leave/ApplyLeaveModal.tsx`: Leave request interface
- `src/components/SearchableEmployeeSelect.tsx`: Employee search and selection
- `src/components/hr-policies/RichTextEditor.tsx`: Rich text editing with TipTap
- `src/components/BeudoxLogo.tsx`: Brand logo component with variants

### Configuration Files
- `package.json`: 70+ dependencies including Supabase, UI libraries, and dev tools
- `vite.config.ts`: Build configuration with path aliases and optimization
- `tailwind.config.ts`: Styling configuration
- `supabase/config.toml`: Backend configuration

## Database Integration
The application heavily integrates with Supabase:
- **23 SQL migrations** for database schema
- **Edge functions** for complex business logic (payroll, invoices, notifications)
- **Real-time subscriptions** for live updates
- **Authentication** via Supabase Auth
- **File storage** for avatars and documents

## Development Practices
- **TypeScript**: Strict typing throughout the codebase
- **Component Composition**: Reusable UI components
- **Error Handling**: Loading states and error boundaries
- **Testing**: Unit tests with Vitest, E2E with Playwright
- **Code Quality**: ESLint configuration
- **Performance**: Query caching and code splitting

## Business Logic Patterns
- **Data Fetching**: TanStack Query for efficient API calls
- **Form Validation**: Zod schemas with React Hook Form
- **Date Handling**: date-fns for formatting and calculations
- **Notification System**: Automated alerts for HR events
- **Search Functionality**: Client-side filtering and search

## Scalability Considerations
- **Modular Architecture**: Feature-based component organization
- **Query Optimization**: Efficient data fetching patterns
- **Role-Based UI**: Conditional rendering based on permissions
- **Responsive Design**: Mobile-friendly interface
- **Performance Monitoring**: Built-in loading and error states

This codebase represents a production-ready HR management system with enterprise-level features, security, and user experience considerations.