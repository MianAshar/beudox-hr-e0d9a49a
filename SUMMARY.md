<!--
generated_by: tessera
source_sha: 25225680b7caec66aa1060dd843b361d1669e911
generated_at: 2026-04-17T22:50:22.249Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Project Overview
Beudox HR is a comprehensive Human Resources Management System implemented as a modern React single-page application with Supabase backend. The application provides complete HR functionality for small to medium businesses, featuring employee management, project tracking, financial operations, and organizational workflows.

## Key Architectural Insights

### Technology Stack & Architecture
- **Frontend**: React 18 + TypeScript + Vite build system
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **UI Framework**: shadcn/ui components on Tailwind CSS
- **State Management**: React Query for server state, Context API for auth
- **Routing**: React Router v6 with role-based route protection
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: TipTap editor for policy documents

### Application Structure
The codebase follows a feature-based organization with clear separation of concerns:
- `src/components/`: Reusable UI components organized by feature
- `src/pages/`: Route-level page components
- `src/hooks/`: Custom React hooks for business logic
- `src/lib/`: Utility functions and configurations
- `src/integrations/`: External service integrations (Supabase)

### Core Design Patterns
1. **Role-Based Access Control**: Centralized permission system with 5 user roles
2. **Protected Routes**: Route-level authentication and authorization
3. **Provider Composition**: Multiple context providers for different concerns
4. **Component Composition**: Heavy use of compound components
5. **Custom Hooks**: Business logic abstracted into reusable hooks
6. **Optimistic Updates**: React Query patterns for better UX

## Major Features & Functionality

### 1. Authentication & User Management
- Supabase Auth integration with email/password
- Password reset and account recovery flows
- Employee profile management with avatar uploads
- Role-based permissions (employee, hr_manager, finance_manager, team_lead, ceo)

### 2. Employee Lifecycle Management
- Complete employee CRUD operations
- Organizational hierarchy with departments
- Employee search and filtering
- Profile completeness tracking

### 3. Leave Management System
- Leave request submission and approval workflow
- Balance tracking with automatic calculations
- Working day calculations (excluding weekends/holidays)
- Leave type configuration (vacation, sick, personal)

### 4. Performance Evaluation System
- **Quarterly Evaluations**: Formal performance reviews with recommendations
- **Daily Evaluations**: Quick feedback and check-ins
- Role-based visibility controls
- Evaluation timeline with historical data
- Manager-only recommendation access

### 5. Project & Client Management
- Project creation with team assignments
- Client database with contact management
- Project status tracking and timelines
- Resource allocation and workload management

### 6. Financial Operations
- **Payroll Processing**: Automated payroll runs with PDF generation
- **Invoice Management**: Client billing with email delivery
- **Expense Tracking**: Category-based expense management
- **Loan Management**: Employee loan tracking and repayments

### 7. HR Administration
- HR policy management with rich text editing
- Public holiday configuration
- Company settings and configuration
- Notification system for important events

## Database Design & Relationships

### Multi-Tenant Architecture
- Company-based data isolation
- Row Level Security (RLS) policies
- Shared schema with company_id foreign keys

### Key Entity Relationships
- **Employees** → **Companies** (many-to-one)
- **Employees** → **Roles** (many-to-many via employee_roles)
- **Employees** → **Departments** (many-to-one)
- **Evaluations** → **Employees** (evaluator/reviewee relationships)
- **Projects** → **Employees** (many-to-many assignments)
- **Invoices** → **Clients** → **Projects** (hierarchical billing)

### Data Flow Patterns
- React Query for declarative data fetching
- Optimistic updates for immediate UI feedback
- Background synchronization for data consistency
- Real-time subscriptions for live updates

## Security & Access Control

### Authentication Security
- JWT-based authentication via Supabase
- Secure password reset flows
- Session persistence and automatic refresh
- Logout and session cleanup

### Authorization Model
- **CEO**: Full system access
- **HR Manager**: Employee management, evaluations, policies
- **Finance Manager**: Payroll, invoices, financial operations
- **Team Lead**: Project management, team evaluations
- **Employee**: Personal data, leave requests, evaluations

### Data Security
- Row Level Security policies in PostgreSQL
- Input validation with Zod schemas
- SQL injection prevention
- File upload security and validation

## Development Workflow & Tooling

### Build & Development Tools
- **Vite**: Fast development server and optimized builds
- **TypeScript**: Type safety and developer experience
- **ESLint**: Code quality and consistency
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

### Code Quality Practices
- Strict TypeScript configuration
- Component composition over inheritance
- Custom hooks for logic reuse
- Consistent naming conventions
- Comprehensive error handling

### Performance Optimizations
- React Query caching and background updates
- Code splitting and lazy loading
- Image optimization and CDN usage
- Database indexing and query optimization
- Bundle analysis and tree shaking

## Integration Points & External Services

### Supabase Ecosystem
- **Database**: PostgreSQL with real-time capabilities
- **Auth**: User authentication and authorization
- **Storage**: File uploads and static assets
- **Edge Functions**: Serverless business logic
- **Real-time**: Live data synchronization

### Third-Party Libraries
- **UI Components**: Radix UI primitives via shadcn/ui
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form for complex form handling
- **Rich Text**: TipTap for document editing
- **Styling**: Tailwind CSS with custom design system

## Scalability & Performance Considerations

### Frontend Performance
- Component lazy loading for route-based splitting
- React Query for intelligent caching
- Optimistic updates for perceived performance
- Image optimization and responsive loading

### Backend Scalability
- Supabase's serverless architecture
- Edge Functions for compute-intensive tasks
- Database connection pooling
- CDN for static asset delivery

### Monitoring & Maintenance
- Error boundaries for graceful failure handling
- Logging and error tracking integration points
- Performance monitoring hooks
- Database query optimization

## Key Files & Entry Points

### Application Bootstrap
- `src/main.tsx`: React application entry point
- `src/App.tsx`: Main application component with routing
- `vite.config.ts`: Build configuration

### Core Business Logic
- `src/hooks/useAuth.tsx`: Authentication state management
- `src/lib/role-access.ts`: Permission checking logic
- `src/lib/leave-utils.ts`: Leave calculation utilities
- `src/components/layout/AppLayout.tsx`: Main application shell

### Configuration Files
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.ts`: Styling configuration
- `.env`: Environment variables

This analysis reveals a well-architected, production-ready HR management system with modern development practices, comprehensive feature coverage, and strong foundations for scalability and maintenance.