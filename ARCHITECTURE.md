<!--
generated_by: tessera
source_sha: a90685c00aea6cff27dce068c05702801a768e5c
generated_at: 2026-04-19T20:46:03.184Z
action: create
-->

# Beudox HR - Architecture Documentation

## System Overview

Beudox HR is a comprehensive Human Resources Management System designed as a single-page application (SPA) with a serverless backend architecture.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │────│   Supabase       │────│   PostgreSQL     │
│   (Frontend)    │    │   (Backend)      │    │   (Database)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Edge Functions │    │   File Storage   │
│   (Client)      │    │   (Serverless)   │    │   (Assets)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App (Root)
├── AuthProvider (Context)
├── QueryClient (State)
├── Router (Navigation)
└── AppLayout (UI Shell)
    ├── AppSidebar (Navigation)
    ├── TopBar (Actions)
    └── Page Content (Routes)
        ├── Dashboard
        ├── Employees
        ├── Projects
        ├── Finance
        └── Settings
```

### State Management Strategy

#### Server State (TanStack Query)
- **Purpose**: API data, caching, synchronization
- **Scope**: Global application state
- **Features**: Background updates, optimistic updates, error handling

#### Local State (React Hooks)
- **Purpose**: UI state, form data, component interactions
- **Scope**: Component-level state
- **Patterns**: useState, useReducer, custom hooks

#### Global State (Context API)
- **Purpose**: Authentication, user preferences
- **Scope**: Application-wide shared state
- **Implementation**: AuthProvider, ThemeProvider

## Backend Architecture

### Supabase Services

#### Authentication
- **Provider**: Supabase Auth
- **Features**: Email/password, password reset, invite system
- **Integration**: JWT tokens, session management

#### Database
- **Engine**: PostgreSQL
- **Schema**: Multi-tenant with Row Level Security (RLS)
- **Migrations**: Version-controlled schema changes

#### Storage
- **Purpose**: File uploads (avatars, documents)
- **Integration**: Direct upload from frontend

#### Edge Functions
- **Runtime**: Deno/TypeScript
- **Use Cases**: PDF generation, email sending, complex calculations
- **Deployment**: Automatic with Supabase CLI

## Data Flow Patterns

### Authentication Flow
```
1. User Login → Supabase Auth
2. JWT Token → Browser Storage
3. AuthProvider → Context Update
4. Protected Routes → Access Control
5. API Calls → Authorization Headers
```

### Data Fetching Flow
```
1. Component Mount → Query Hook
2. TanStack Query → Cache Check
3. Cache Miss → Supabase API
4. Response → Cache Update
5. Component → Re-render
```

### Form Submission Flow
```
1. User Input → Form Validation (Zod)
2. Form Submit → React Hook Form
3. API Call → Optimistic Update
4. Success → Cache Invalidation
5. Error → Rollback + Error Display
```

## Security Architecture

### Authentication Layers

#### 1. Network Security
- HTTPS encryption
- JWT token validation
- Request signing

#### 2. Application Security
- Input validation (Zod schemas)
- SQL injection prevention (Supabase)
- XSS protection (React)

#### 3. Access Control
- Role-based permissions
- Route protection
- Data filtering

### Authorization Matrix

| Role          | Employees | Evaluations | Finance | Settings |
|---------------|-----------|-------------|---------|----------|
| CEO          | Full      | Full        | Full    | Full     |
| HR Manager   | Full      | Full        | Read    | Full     |
| Team Lead    | Team      | Team        | None    | None     |
| Employee     | Self      | Self        | None    | None     |

## Database Design

### Multi-Tenant Architecture

#### Company Isolation
- All tables include `company_id` foreign key
- Row Level Security policies enforce data isolation
- Company-scoped queries throughout application

#### Key Relationships
```
Company (1) ──── (M) Employees
Company (1) ──── (M) Departments
Company (1) ──── (M) Projects
Company (1) ──── (M) Evaluations
Company (1) ──── (M) Leave Requests
```

### Schema Evolution
- **Migrations**: Ordered SQL files in `supabase/migrations/`
- **Versioning**: Timestamp-based migration naming
- **Rollback**: Down migrations for schema changes

## Component Architecture

### Design System

#### UI Primitives (shadcn/ui)
- **Base Components**: Button, Input, Card, etc.
- **Composition**: Higher-order components
- **Styling**: Tailwind CSS with CSS variables

#### Feature Components
- **Atomic Design**: Atoms → Molecules → Organisms
- **Composition**: Props drilling avoided via composition
- **Reusability**: Generic components with customization

### Custom Hooks Pattern

```typescript
// Data fetching hook
function useEmployees(companyId: string) {
  return useQuery({
    queryKey: ['employees', companyId],
    queryFn: () => fetchEmployees(companyId),
  });
}

// Business logic hook
function useEmployeeActions() {
  const queryClient = useQueryClient();
  
  const createEmployee = useMutation({
    mutationFn: createEmployeeApi,
    onSuccess: () => queryClient.invalidateQueries(['employees']),
  });
  
  return { createEmployee };
}
```

## Performance Architecture

### Frontend Optimizations

#### Bundle Splitting
- **Route-based**: Automatic code splitting by page
- **Component-based**: Lazy loading for heavy components
- **Vendor chunks**: Separate chunks for libraries

#### Caching Strategy
- **API Responses**: TanStack Query with stale-while-revalidate
- **Static Assets**: Browser caching with hash-based filenames
- **Computed Values**: React useMemo for expensive calculations

### Backend Optimizations

#### Database Performance
- **Indexing**: Strategic indexes on frequently queried columns
- **Query Optimization**: Efficient JOINs and WHERE clauses
- **Connection Pooling**: Supabase handles connection management

#### Edge Function Optimization
- **Cold Starts**: Minimal for frequently used functions
- **Memory Usage**: Efficient data processing
- **Response Caching**: Appropriate cache headers

## Deployment Architecture

### Build Pipeline
```
Source Code → TypeScript → Vite Build → Static Assets
                    ↓
              ESLint → Testing → Bundle Analysis
```

### Hosting Strategy
- **Frontend**: Static hosting (Vercel, Netlify, etc.)
- **Backend**: Supabase (managed PostgreSQL + serverless)
- **Assets**: Supabase Storage or CDN

### Environment Management
- **Development**: Local Supabase instance
- **Staging**: Separate Supabase project
- **Production**: Production Supabase project

## Monitoring & Observability

### Error Tracking
- **Frontend**: Console logging, error boundaries
- **Backend**: Supabase logs, edge function monitoring

### Performance Monitoring
- **Core Web Vitals**: Lighthouse, Web Vitals API
- **API Performance**: Query execution times
- **Bundle Size**: Build analysis and optimization

## Scalability Considerations

### Horizontal Scaling
- **Stateless Frontend**: Easy to scale with CDN
- **Serverless Backend**: Automatic scaling with Supabase
- **Database**: PostgreSQL read replicas if needed

### Data Growth
- **Partitioning**: Time-based partitioning for large tables
- **Archiving**: Old data archiving strategies
- **Caching**: Redis integration if needed

This architecture provides a solid foundation for a scalable, maintainable HR management system with clear separation of concerns and modern development practices.