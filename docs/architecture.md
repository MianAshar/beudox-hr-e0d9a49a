<!--
generated_by: tessera
source_sha: 09e0c31289d212e2667da89ff8a6b0a3a8b71061
generated_at: 2026-04-18T00:43:27.978Z
action: create
-->

# Beudox HR System - Architecture Documentation

## System Architecture Overview

Beudox HR is a modern web-based HR management system built with a React frontend and Supabase backend. The architecture follows a client-server model with real-time capabilities and role-based access control.

## Frontend Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC compiler
- **Routing**: React Router v6
- **State Management**: TanStack React Query + React Context
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Rich Text**: Tiptap editor

### Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives
│   ├── layout/         # App layout components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and business logic
├── integrations/       # External service integrations
└── types/              # TypeScript definitions
```

### Component Architecture

#### UI Components (`src/components/ui/`)
- **Design System**: Consistent component library with variants
- **Accessibility**: WCAG-compliant components using Radix UI
- **Theming**: CSS custom properties for light/dark mode support
- **Composition**: Compound components with flexible APIs

#### Layout Components (`src/components/layout/`)
- **AppLayout**: Main application wrapper with sidebar and header
- **AppSidebar**: Navigation sidebar with role-based menu items
- **TopBar**: User menu, notifications, and search
- **NotificationBell**: Real-time notification system

#### Feature Components
- **Evaluations**: Timeline views, evaluation forms, scoring systems
- **Leave Management**: Request forms, approval workflows, calendar views
- **Employee Management**: Profile cards, searchable selects, forms
- **Project Management**: Activity logs, team assignments, progress tracking

### State Management Strategy

#### Server State (TanStack React Query)
- **Caching**: Intelligent caching with background refetching
- **Synchronization**: Real-time updates via Supabase subscriptions
- **Error Handling**: Global error handling with retry logic
- **Optimistic Updates**: Immediate UI feedback for mutations

#### Client State (React Context)
- **Authentication**: User session and profile management
- **Theme**: Light/dark mode preferences
- **Toast Notifications**: Global notification system

### Routing & Navigation

#### Protected Routes
- **Role-Based Access**: Route-level permission checking
- **Authentication Guards**: Automatic redirects for unauthenticated users
- **Loading States**: Proper loading indicators during auth checks

#### Route Structure
```
/                     # Root redirect
/login               # Authentication
/dashboard           # Main dashboard
/employees           # Employee management
  /:id              # Employee profile
  /new              # New employee form
  /:id/edit         # Edit employee
/projects           # Project management
  /:id              # Project details
  /new              # New project
  /:id/edit         # Edit project
/evaluations        # Performance evaluations
  /daily            # Daily feedback
  /:id              # Evaluation details
/leave              # Leave management
/payroll            # Payroll processing
/settings           # System settings
```

## Backend Architecture

### Supabase Integration

#### Database (PostgreSQL)
- **Schema**: Normalized relational database
- **Migrations**: Version-controlled schema changes
- **Row Level Security**: Database-level access control
- **Real-time**: Live data synchronization

#### Authentication
- **Provider**: Supabase Auth
- **Methods**: Email/password, magic links
- **Session Management**: JWT tokens with automatic refresh
- **User Management**: Profile data and role assignments

#### Edge Functions
- **Runtime**: Deno/TypeScript
- **Use Cases**: PDF generation, email sending, complex calculations
- **Deployment**: Automatic deployment with schema changes

### Database Schema

#### Core Tables
- `companies` - Multi-tenant organization data
- `employees` - User profiles and organizational information
- `departments` - Organizational structure
- `projects` - Work assignments and teams
- `evaluations` - Performance review data
- `daily_evaluations` - Quick feedback entries
- `leave_requests` - Time-off requests
- `leave_types` - Configurable leave categories
- `invoices` - Client billing
- `payroll_records` - Salary processing
- `loans` - Employee loan tracking
- `hr_policies` - Company policies
- `notifications` - System notifications

#### Key Relationships
- **Employees → Companies**: Multi-tenant isolation
- **Employees → Departments**: Organizational hierarchy
- **Projects ↔ Employees**: Many-to-many team assignments
- **Evaluations → Employees**: Performance tracking
- **Leave Requests → Employees**: Time-off management
- **Invoices → Projects**: Revenue tracking

## Security Architecture

### Authentication
- **Multi-factor**: Email verification and password requirements
- **Session Security**: Secure token storage and automatic expiration
- **Password Reset**: Secure recovery flow with email verification

### Authorization
- **Role-Based Access Control**: 5 distinct user roles
  - `ceo`: Full system access
  - `hr_manager`: HR operations and employee management
  - `finance_manager`: Financial operations and reporting
  - `team_lead`: Team management and limited HR access
  - `employee`: Personal dashboard and self-service
- **Route Protection**: Frontend permission checking
- **Database Security**: Row Level Security policies

### Data Protection
- **Encryption**: Data encrypted at rest and in transit
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Automatic escaping and sanitization

## Performance Architecture

### Frontend Optimizations
- **Code Splitting**: Route-based and component lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Lazy loading and responsive images
- **Caching**: Service worker and browser caching strategies

### Database Optimizations
- **Indexing**: Strategic indexes on frequently queried columns
- **Query Optimization**: Efficient JOIN operations and pagination
- **Connection Pooling**: Supabase handles connection management
- **Real-time Efficiency**: Targeted subscriptions for data changes

### Monitoring & Analytics
- **Error Tracking**: Global error boundaries and logging
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Usage patterns and feature adoption
- **Database Monitoring**: Query performance and usage statistics

## Deployment Architecture

### Build Process
- **Development**: Hot reload with Vite dev server
- **Production**: Optimized build with asset optimization
- **Testing**: Automated testing in CI/CD pipeline
- **Deployment**: Static hosting with CDN distribution

### Environment Management
- **Development**: Local Supabase instance for development
- **Staging**: Mirror production environment for testing
- **Production**: Live Supabase project with backups
- **Configuration**: Environment-specific configuration files

## Scalability Considerations

### Horizontal Scaling
- **Stateless Frontend**: Easy scaling with CDN distribution
- **Database Scaling**: Supabase handles read replicas and scaling
- **Edge Functions**: Serverless scaling for compute-intensive tasks

### Feature Scaling
- **Modular Architecture**: Independent feature development
- **API Design**: RESTful endpoints for mobile app support
- **Real-time Features**: WebSocket connections for live updates

### Organizational Scaling
- **Multi-tenant**: Company-scoped data isolation
- **Role Management**: Flexible permission system for growing organizations
- **Department Structure**: Hierarchical organization support

## Development Workflow

### Local Development
- **Setup**: Single command setup with environment configuration
- **Testing**: Comprehensive test suite with multiple frameworks
- **Linting**: Automated code quality checks
- **Type Checking**: Strict TypeScript configuration

### Collaboration
- **Git Workflow**: Feature branches with pull request reviews
- **Code Standards**: ESLint and Prettier for consistency
- **Documentation**: Auto-generated documentation from code
- **Testing**: Required test coverage for new features

### CI/CD Pipeline
- **Automated Testing**: Unit and integration tests
- **Build Verification**: Type checking and linting
- **Security Scanning**: Dependency and code security checks
- **Deployment**: Automated deployment to staging and production