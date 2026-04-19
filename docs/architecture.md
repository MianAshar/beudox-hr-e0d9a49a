<!--
generated_by: tessera
source_sha: 20ef1eb521eec693f7ae1732004ba33e7dca4c1d
generated_at: 2026-04-19T13:01:00.948Z
action: create
-->

# Beudox HR - Architecture Documentation

## System Architecture

Beudox HR follows a modern client-server architecture with a React-based frontend and Supabase backend.

### Frontend Architecture

#### Component Hierarchy
```
App (Routing & Auth)
├── AuthProvider (Authentication Context)
├── QueryClientProvider (Data Fetching)
├── BrowserRouter
│   ├── Protected Routes
│   │   ├── AppLayout
│   │   │   ├── AppSidebar (Navigation)
│   │   │   ├── TopBar (User Menu & Notifications)
│   │   │   └── Main Content
│   │   │       └── Page Components
│   └── Public Routes (Login, Password Reset)
```

#### Key Architectural Patterns

**Component Composition**
- Higher-order components for layout and protection
- Compound components for complex UI elements
- Render props for flexible data display

**Data Flow**
- Unidirectional data flow with React hooks
- Server state managed by TanStack Query
- Local state for UI interactions

**Routing Structure**
- Role-based route protection
- Nested routes for CRUD operations
- Programmatic navigation with redirects

### Backend Architecture

#### Supabase Services
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: JWT-based auth with role management
- **Storage**: File uploads and CDN
- **Edge Functions**: Server-side business logic

#### Database Design
- Multi-tenant with company-based isolation
- Normalized schema with foreign key relationships
- Audit trails and activity logging
- Real-time subscriptions for live updates

## Core Components

### Layout System
- **AppLayout**: Main application wrapper with sidebar and topbar
- **AppSidebar**: Collapsible navigation with role-based menu items
- **TopBar**: User menu, notifications, and global actions

### Authentication System
- **AuthProvider**: Context provider managing auth state
- **ProtectedRoute**: HOC for route protection
- **Role Access**: Permission checking utilities

### Data Management
- **Supabase Client**: Centralized API client
- **Query Hooks**: TanStack Query wrappers for data fetching
- **Type Safety**: Generated TypeScript types from schema

## Data Flow Patterns

### Authentication Flow
1. Login → Supabase auth → JWT token
2. Token validation → Employee data fetch
3. Role determination → Route access control
4. Automatic redirects based on permissions

### CRUD Operations
1. User action → Form submission
2. Validation → API call
3. Optimistic update → Cache invalidation
4. Error handling → User feedback

### Real-time Updates
1. Database change → Supabase real-time
2. Subscription trigger → Cache update
3. UI re-render → User notification

## Security Architecture

### Authentication
- JWT tokens with expiration
- Refresh token handling
- Secure password reset flows

### Authorization
- Role-based access control (RBAC)
- Row Level Security policies
- API endpoint protection

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection in rich text

## Performance Considerations

### Frontend Optimization
- Code splitting with dynamic imports
- Image lazy loading and optimization
- Bundle analysis and tree shaking
- Efficient re-rendering with memoization

### Backend Optimization
- Database indexing strategies
- Query optimization and caching
- Edge function performance
- CDN for static assets

### Caching Strategy
- TanStack Query for API response caching
- Browser caching for static assets
- Service worker for offline capability

## Scalability Patterns

### Horizontal Scaling
- Stateless frontend components
- Database connection pooling
- CDN distribution

### Feature Scaling
- Modular component architecture
- Feature-based code organization
- Micro-frontend potential

### Data Scaling
- Efficient query patterns
- Pagination for large datasets
- Real-time subscription management

## Development Workflow

### Build Pipeline
- Vite for fast development
- TypeScript compilation
- CSS processing and optimization
- Asset bundling and minification

### Testing Strategy
- Unit tests with Vitest
- Component tests with RTL
- E2E tests with Playwright
- Integration tests for API

### Deployment
- Environment-based configuration
- CI/CD pipeline
- Rollback strategies
- Monitoring and logging