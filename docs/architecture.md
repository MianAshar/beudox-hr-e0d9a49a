<!--
generated_by: tessera
source_sha: 7cd56bd223f184273f03b6c7372dbc65d79d4bbd
generated_at: 2026-04-19T21:20:04.480Z
action: create
-->

# Architecture Documentation

## System Overview

Beudox HR is a modern, full-stack HR management system built with React and Supabase. The architecture follows a component-driven design with clear separation of concerns between UI, business logic, and data layers.

## Frontend Architecture

### Technology Stack
- **React 18** with TypeScript for type-safe component development
- **Vite** for fast development and optimized production builds
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling
- **React Query** for server state management
- **React Router** for client-side routing

### Component Hierarchy

```
App (Providers + Routing)
├── AuthProvider (Global auth state)
├── QueryClientProvider (Server state)
├── ThemeProvider (UI theming)
└── Router
    ├── Public Routes (Login, Password Reset)
    └── Protected Routes (AppLayout wrapper)
        ├── AppSidebar (Navigation)
        ├── TopBar (Page header)
        └── Page Content (Feature components)
```

### State Management

#### Global State
- **Auth Context**: User session, employee data, role information
- **Theme Context**: Dark/light mode preferences

#### Server State
- **React Query**: API data caching, optimistic updates, background refetching
- **Supabase Subscriptions**: Real-time data updates where needed

#### Local State
- **Component State**: UI interactions, form data, loading states
- **URL State**: Route parameters, query strings

## Backend Architecture

### Supabase Services

#### Database (PostgreSQL)
- **Tables**: 20+ tables for HR data (employees, evaluations, payroll, etc.)
- **Row Level Security**: Granular access control policies
- **Functions**: Business logic in SQL and PL/pgSQL
- **Triggers**: Automated data processing

#### Authentication
- **Supabase Auth**: User management, password reset, session handling
- **Custom Claims**: Role-based permissions

#### Edge Functions
- **Payroll Generation**: Complex salary calculations
- **Invoice PDF Creation**: Document generation
- **Email Notifications**: Automated communication

### API Design

#### RESTful Endpoints
- Standard CRUD operations for all entities
- Consistent response formats
- Error handling with appropriate HTTP status codes

#### Real-time Subscriptions
- Live updates for collaborative features
- Notification system for HR events

## Security Architecture

### Authentication Flow
```
1. User Login → Supabase Auth
2. Token Validation → JWT claims
3. Employee Lookup → Database query
4. Role Assignment → Permission mapping
5. Route Access → RBAC checks
```

### Authorization Model

#### Role Hierarchy
- **CEO**: Full system access
- **HR Manager**: Employee management, HR operations
- **Team Lead**: Team oversight, evaluations
- **Employee**: Personal data access

#### Permission Checks
- Route-level protection
- Component-level visibility
- API-level RLS policies

## Data Flow Patterns

### Evaluation System
```
Quarterly Evaluations:
Employee → Evaluator → Review → Recommendation → Storage

Daily Evaluations:
Reviewer → Reviewee → Feedback → Direction → Timeline
```

### Payroll Processing
```
Employee Data → Attendance → Overtime Calc → Deductions → Payslip
```

### Leave Management
```
Request → Balance Check → Approval → Calendar Update → Balance Adjustment
```

## Performance Optimizations

### Frontend
- **Code Splitting**: Route-based chunking
- **Lazy Loading**: Component and image loading
- **Memoization**: Expensive calculations cached
- **Virtual Scrolling**: Large lists optimized

### Backend
- **Database Indexing**: Optimized queries
- **Caching**: React Query intelligent caching
- **Edge Functions**: Compute moved to edge
- **CDN**: Static assets distributed

## Development Workflow

### Build Pipeline
```
Source Code → TypeScript → Vite → Optimized Bundle
                    ↓
ESLint → Testing → Deployment
```

### Quality Assurance
- **TypeScript**: Compile-time type checking
- **ESLint**: Code quality and consistency
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

## Deployment Architecture

### Production Setup
- **Static Hosting**: Frontend served from CDN
- **Supabase**: Managed backend services
- **Edge Functions**: Globally distributed compute
- **Database**: Managed PostgreSQL with backups

### Environment Management
- **Development**: Local Supabase instance
- **Staging**: Mirror production environment
- **Production**: Live user environment

## Monitoring & Observability

### Error Tracking
- Client-side error boundaries
- Server-side error logging
- User feedback collection

### Performance Monitoring
- Bundle size analysis
- Core Web Vitals tracking
- API response time monitoring

## Scalability Considerations

### Horizontal Scaling
- Stateless frontend components
- Database connection pooling
- CDN for static assets

### Vertical Scaling
- Database query optimization
- Edge function distribution
- Caching strategies

## Future Architecture Evolution

### Planned Enhancements
- **Microservices**: Break down monolithic functions
- **GraphQL**: More efficient data fetching
- **Real-time**: Enhanced collaborative features
- **Mobile App**: React Native companion
- **AI Integration**: Automated insights and recommendations

This architecture provides a solid foundation for a scalable, maintainable HR management system while allowing for future growth and feature additions.