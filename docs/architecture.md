<!--
generated_by: tessera
source_sha: 7b605e9472f6b8c714de14d5769583c23a81c06a
generated_at: 2026-04-07T21:29:46.483Z
action: create
-->

# Beudox HR - Architecture Documentation

## Application Overview

Beudox HR is a comprehensive Human Resources Management System built as a single-page application (SPA) using React 18 and TypeScript. The application provides a complete suite of HR tools including employee management, project tracking, performance evaluations, payroll processing, and policy management.

## Technology Architecture

### Frontend Stack
- **React 18** with TypeScript for component-based development
- **Vite** as the build tool with fast hot module replacement
- **React Router DOM** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent UI components

### Backend & Data
- **Supabase** providing:
  - PostgreSQL database with Row Level Security
  - Authentication and authorization
  - Real-time subscriptions
  - Edge Functions for server-side logic
  - File storage for documents and images

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type checking
- **Vitest** for unit testing
- **Playwright** for end-to-end testing

## Application Structure

### Directory Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui component library
│   ├── layout/         # Application layout components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── types/              # TypeScript definitions
```

### Component Architecture

#### Layout Components
- **AppLayout**: Main application wrapper providing consistent layout structure
- **AppSidebar**: Navigation sidebar with role-based menu visibility
- **TopBar**: Top navigation with user menu and notifications

#### Feature Components
- **EvaluationTimeline**: Complex timeline component showing evaluation history
- **SearchableEmployeeSelect**: Advanced employee selection with search functionality
- **RichTextEditor**: WYSIWYG editor for content creation
- **Settings Tabs**: Modular settings interface with multiple configuration areas

## Routing & Navigation

### Route Structure
The application uses a hierarchical routing system with protected routes:

- **Public Routes**: Login, password recovery
- **Protected Routes**: All main application features with role-based access
- **Nested Routes**: CRUD operations for resources (employees, projects, etc.)

### Route Protection
- **Authentication Check**: Redirects unauthenticated users to login
- **Authorization Check**: Validates user roles against route permissions
- **Loading States**: Prevents flash of unauthorized content

## State Management

### Client State
- **React useState/useReducer** for local component state
- **Custom hooks** for shared stateful logic

### Server State
- **React Query** for:
  - Data fetching and caching
  - Background refetching
  - Optimistic updates
  - Error handling

### Authentication State
- **Supabase Auth** integration
- **Custom useAuth hook** providing user session and profile data
- **Role-based permissions** affecting UI and data access

## Data Flow

### API Integration
- **Supabase Client** configured with environment variables
- **Type-safe queries** using generated TypeScript definitions
- **Real-time subscriptions** for live data updates

### Query Patterns
- **Resource-based keys**: `['employees', companyId]`
- **Detail queries**: `['employee', id, companyId]`
- **Mutation invalidation** to update cached data

## Security Model

### Authentication
- **Email/password authentication**
- **Invite-based registration**
- **Password reset flow**
- **Session management**

### Authorization
- **Role-based access control** with four roles:
  - CEO: Full system access
  - HR Manager: HR operations and management
  - Team Lead: Team management and evaluations
  - Employee: Personal data access
- **Database RLS policies** enforcing data access rules
- **API-level validation** preventing unauthorized operations

## Component Patterns

### UI Components
- **shadcn/ui** for consistent, accessible components
- **Compound components** for complex interactions
- **Custom variants** using Tailwind CSS classes

### Business Logic Components
- **Container/Presentational pattern** separating logic from UI
- **Custom hooks** for reusable business logic
- **Error boundaries** for graceful error handling

## Performance Optimizations

### Build Optimizations
- **Vite bundling** with code splitting
- **Tree shaking** removing unused code
- **SWC compiler** for fast TypeScript compilation

### Runtime Optimizations
- **React Query caching** reducing API calls
- **Lazy loading** for route components
- **Memoization** for expensive computations
- **Virtual scrolling** for large lists

## Testing Strategy

### Unit Testing
- **Vitest** for fast test execution
- **Testing Library** for component testing
- **Mock implementations** for external dependencies

### Integration Testing
- **API integration tests**
- **Component interaction tests**
- **Form validation tests**

### End-to-End Testing
- **Playwright** for browser automation
- **User workflow testing**
- **Cross-browser compatibility**

## Deployment & DevOps

### Development Environment
- **Local development server** on port 8080
- **Hot module replacement** for fast development
- **Environment configuration** via .env files

### Build Process
- **Production builds** optimized for performance
- **Asset optimization** (images, fonts, CSS)
- **Bundle analysis** for size monitoring

## Database Design

### Schema Overview
The application uses a relational database with the following key entities:

- **Companies**: Multi-tenant organization data
- **Employees**: User profiles and organizational relationships
- **Projects**: Project management with team assignments
- **Clients**: Client relationship management
- **Evaluations**: Performance review system
- **Payroll**: Compensation and payroll records
- **Policies**: HR policy documentation

### Data Relationships
- **Company-centric** data isolation
- **Employee hierarchies** with manager relationships
- **Project assignments** linking employees to work
- **Evaluation chains** connecting reviewers and reviewees

## Edge Functions

### Server-side Processing
- **Payroll calculation** with complex business rules
- **PDF generation** for invoices and reports
- **Email notifications** for system events
- **Bulk operations** for data management

### Function Architecture
- **TypeScript implementation**
- **Supabase client integration**
- **Error handling and logging**
- **Security validation**

## Design System

### Visual Design
- **Custom color palette** with brand colors
- **Typography scale** with display and body fonts
- **Consistent spacing** using Tailwind scales
- **Dark mode support** with CSS custom properties

### Component Library
- **Accessible components** following WCAG guidelines
- **Consistent API** across all components
- **Theme customization** via CSS variables
- **Responsive design** patterns

## Future Considerations

### Scalability
- **Component lazy loading** for bundle size management
- **Database indexing** for query performance
- **Caching strategies** for improved response times
- **CDN integration** for static assets

### Maintainability
- **TypeScript strict mode** for code quality
- **Automated testing** for regression prevention
- **Code documentation** for developer onboarding
- **Modular architecture** for feature development