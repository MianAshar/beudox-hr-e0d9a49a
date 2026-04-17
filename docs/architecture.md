<!--
generated_by: tessera
source_sha: 93ba9a42b1f47246ac1f0acfa152b243f990fa9d
generated_at: 2026-04-17T21:53:46.119Z
action: create
-->

# Beudox HR - Architecture Documentation

## System Overview

Beudox HR is a comprehensive Human Resources management platform built as a modern web application. The system provides end-to-end HR functionality including employee management, performance evaluations, payroll processing, and organizational workflows.

## Architecture Principles

### 1. Component-Driven Development
- **Atomic Design**: UI components organized from atoms to organisms
- **Reusability**: Components designed for reuse across features
- **Composition**: Complex UIs built from simple, composable parts

### 2. Type Safety First
- **TypeScript**: Strict typing throughout the application
- **Schema Validation**: Zod schemas for runtime type checking
- **API Contracts**: Type-safe database and API interactions

### 3. Separation of Concerns
- **Business Logic**: Isolated in custom hooks and utilities
- **UI Logic**: Pure presentational components
- **Data Layer**: Centralized API and database interactions

### 4. Performance Optimization
- **Code Splitting**: Route-based and feature-based splitting
- **Caching**: Intelligent query caching and state management
- **Lazy Loading**: Components and data loaded on demand

## Frontend Architecture

### Core Technologies
- **React 18**: Component-based UI framework
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing and navigation

### State Management

#### Server State (TanStack Query)
- **Query Management**: API calls with automatic caching
- **Mutation Handling**: Data updates with optimistic updates
- **Background Updates**: Automatic refetching and synchronization
- **Error Handling**: Retry logic and error boundaries

#### Local State (React)
- **UI State**: Component-level state for interactions
- **Form State**: React Hook Form for complex forms
- **Context State**: Global state for authentication and themes

### Component Architecture

#### UI Component Library (shadcn/ui)
```
src/components/ui/
├── button.tsx      # Base button component
├── input.tsx       # Form input field
├── dialog.tsx      # Modal dialog
├── table.tsx       # Data table
└── ...             # 40+ reusable components
```

#### Feature Components
```
src/components/
├── layout/         # App layout and navigation
├── employees/      # Employee-specific components
├── evaluations/    # Performance evaluation UI
├── leave/          # Leave management components
└── settings/       # Configuration components
```

#### Page Components
```
src/pages/
├── Dashboard.tsx       # Main dashboard
├── Employees.tsx       # Employee listing
├── EmployeeProfile.tsx # Individual employee view
├── Evaluations.tsx     # Evaluation management
└── ...                 # 30+ route components
```

## Backend Architecture

### Supabase Integration

#### Database Layer
- **PostgreSQL**: Primary data store
- **Row Level Security**: Database-level access control
- **Migrations**: Version-controlled schema changes
- **Real-time**: Live data synchronization

#### Authentication
- **Supabase Auth**: JWT-based authentication
- **Role Management**: User roles and permissions
- **Session Handling**: Automatic token refresh
- **Password Reset**: Secure password recovery

#### File Storage
- **Document Storage**: PDFs, images, and attachments
- **Access Control**: Bucket policies and permissions
- **CDN Delivery**: Fast content delivery

### API Design

#### Client Configuration
```typescript
// src/integrations/supabase/client.ts
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

#### Query Patterns
- **Type-safe Queries**: Generated types from database schema
- **Error Handling**: Consistent error response handling
- **Loading States**: Query status management
- **Caching**: Intelligent cache invalidation

## Security Architecture

### Authentication Flow
1. **Login**: User credentials verification
2. **Token Issuance**: JWT token generation
3. **Session Management**: Automatic token refresh
4. **Route Protection**: Role-based access control

### Authorization Model

#### Role Hierarchy
- **CEO**: Full system access
- **HR Manager**: Employee and payroll management
- **Team Lead**: Team member oversight
- **Employee**: Personal data access

#### Permission Checking
```typescript
// src/lib/role-access.ts
export function canAccess(role: string, path: string): boolean {
  // Role-based route access logic
}
```

### Data Security
- **Row Level Security**: Database-level data isolation
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Request token validation

## Data Flow Architecture

### Request Flow
1. **User Interaction**: Button click or form submission
2. **Validation**: Input validation and sanitization
3. **API Call**: Supabase client query/mutation
4. **State Update**: Query cache invalidation
5. **UI Update**: Component re-rendering

### Real-time Updates
1. **Subscription**: Component subscribes to database changes
2. **Change Detection**: Database triggers notification
3. **Cache Update**: Query cache automatic refresh
4. **UI Sync**: Components update with new data

## Business Logic Architecture

### Domain Services

#### Employee Management
- **Profile Management**: CRUD operations for employee data
- **Role Assignment**: Permission and access control
- **Organizational Structure**: Department and hierarchy management

#### Performance Management
- **Evaluation Creation**: Structured feedback forms
- **Visibility Rules**: Role-based data access
- **Timeline Generation**: Chronological evaluation history

#### Financial Processing
- **Payroll Calculation**: Automated salary processing
- **Invoice Generation**: PDF creation and distribution
- **Expense Tracking**: Business expense management

### Utility Libraries

#### Business Rules
```typescript
// src/lib/leave-utils.ts
export function countWorkingDays(start: Date, end: Date): number {
  // Business day calculation logic
}

export function ensureLeaveBalance(employeeId: string, leaveType: string): Promise<void> {
  // Leave balance validation
}
```

#### Data Formatting
```typescript
// src/lib/format-role.ts
export const ROLE_LABELS = {
  ceo: 'CEO',
  hr_manager: 'HR Manager',
  team_lead: 'Team Lead',
  employee: 'Employee'
};
```

## Deployment Architecture

### Development Environment
- **Local Development**: Vite dev server on port 8080
- **Hot Reload**: Fast development iteration
- **Type Checking**: Real-time TypeScript validation
- **Linting**: Code quality enforcement

### Production Build
- **Optimization**: Code splitting and minification
- **Asset Optimization**: Image compression and bundling
- **CDN Integration**: Static asset delivery
- **Performance Monitoring**: Bundle size and load time tracking

### CI/CD Pipeline
- **Automated Testing**: Unit and integration tests
- **Build Verification**: Type checking and linting
- **Deployment**: Automated production deployment
- **Rollback**: Version rollback capabilities

## Monitoring and Observability

### Error Tracking
- **Client-side Errors**: Error boundaries and reporting
- **API Errors**: Response logging and alerting
- **Performance Issues**: Load time monitoring

### Logging Strategy
- **User Actions**: Important user interactions
- **System Events**: Authentication and authorization events
- **Error Events**: Application errors and exceptions
- **Performance Metrics**: Page load and API response times

## Scalability Considerations

### Performance Optimization
- **Bundle Splitting**: Feature-based code splitting
- **Image Optimization**: Lazy loading and responsive images
- **Query Optimization**: Selective data fetching
- **Caching Strategy**: Multi-layer caching approach

### Architecture Scalability
- **Micro-frontend Ready**: Feature isolation for future splitting
- **API Versioning**: Backward-compatible API evolution
- **Database Sharding**: Multi-tenant data isolation
- **Service Decomposition**: Business logic modularization

## Technology Decisions

### Why React + TypeScript?
- **Developer Experience**: Strong typing and excellent DX
- **Ecosystem**: Rich component libraries and tooling
- **Performance**: Virtual DOM and efficient rendering
- **Maintainability**: Component composition and reusability

### Why Supabase?
- **Integrated Solution**: Database, auth, and real-time in one platform
- **Developer Productivity**: Auto-generated types and client libraries
- **Scalability**: PostgreSQL with proven performance
- **Security**: Built-in RLS and authentication

### Why Vite?
- **Development Speed**: Fast cold start and HMR
- **Build Performance**: Optimized production bundles
- **Plugin Ecosystem**: Rich plugin ecosystem
- **Modern Standards**: ES modules and native browser support

## Future Architecture Evolution

### Planned Improvements
- **Micro-frontend Architecture**: Feature-based application splitting
- **GraphQL API**: More flexible data fetching
- **Advanced Caching**: Service worker and offline support
- **Real-time Collaboration**: Operational transforms for concurrent editing

### Technology Migration Path
- **React Server Components**: Improved performance and SEO
- **Next.js Migration**: Full-stack React framework
- **Edge Computing**: Global performance optimization
- **AI Integration**: Intelligent HR insights and automation