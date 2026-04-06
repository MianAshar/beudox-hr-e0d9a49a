<!--
generated_by: tessera
source_sha: 3ec6744ead84afc356ca43d3b9becba3c32d942f
generated_at: 2026-04-06T21:16:19.832Z
action: create
-->

# Beudox HR - Frontend Architecture

## Application Structure

Beudox HR is built as a single-page application (SPA) using React 18 and TypeScript, following modern frontend architecture patterns.

## Core Architecture Patterns

### 1. Component Hierarchy
```
App (Root)
├── AuthProvider (Context)
├── QueryClientProvider (Data)
├── BrowserRouter (Routing)
└── AppLayout (UI Shell)
    ├── AppSidebar (Navigation)
    ├── TopBar (Secondary Nav)
    └── Main Content (Pages)
```

### 2. Route Protection
- **Authentication Guard**: Checks session validity
- **Authorization Guard**: Validates role-based access
- **Loading States**: Prevents content flashing during auth checks
- **Redirect Logic**: Automatic navigation based on auth state

### 3. Data Management
- **Server State**: TanStack Query for API data with caching
- **Local State**: React hooks for UI state
- **Authentication State**: Custom auth context
- **Form State**: React Hook Form with external validation

## Navigation Architecture

### Sidebar Organization
The application uses a hierarchical navigation structure:

- **MAIN**: Core dashboard functionality
- **PEOPLE**: Employee and attendance management
- **FINANCE**: Financial operations and reporting
- **WORK**: Project and client management
- **SYSTEM**: Administrative and configuration features

### Route Configuration
Routes are defined with nested protection:
- Public routes: `/login`, `/forgot-password`
- Protected routes: All business functionality
- Parameterized routes: Dynamic pages for entities
- Fallback routes: 404 handling

## Component Design System

### UI Components (shadcn/ui)
- **Primitive Components**: Buttons, inputs, dialogs, etc.
- **Layout Components**: Cards, grids, flex containers
- **Feedback Components**: Toasts, alerts, loading states
- **Data Display**: Tables, charts, lists

### Business Components
- **Form Components**: Reusable forms with validation
- **List Components**: Data tables with sorting/filtering
- **Detail Components**: Entity-specific views
- **Editor Components**: Rich text and form editors

## State Management Strategy

### Authentication State
```typescript
interface AuthState {
  session: Session | null;
  employee: Employee | null;
  loading: boolean;
  passwordMode: 'invite' | 'recovery' | null;
}
```

### Server State (TanStack Query)
- **Queries**: Cached data fetching with background updates
- **Mutations**: Optimistic updates with rollback
- **Invalidation**: Automatic cache updates on mutations
- **Error Handling**: Global error boundaries

### Form State
- **Validation**: Zod schemas for type-safe validation
- **Submission**: Async handling with loading states
- **Error Display**: Field-level and form-level errors

## Data Flow Patterns

### 1. Authentication Flow
1. User submits credentials
2. Supabase validates and returns session
3. Auth context updates with session data
4. Employee data is fetched and cached
5. UI updates based on role permissions

### 2. Data Fetching Flow
1. Component mounts and triggers query
2. TanStack Query checks cache
3. If stale, fetches from Supabase
4. Data is cached and component updates
5. Background refetching keeps data fresh

### 3. Form Submission Flow
1. User interacts with form
2. Validation runs on change/blur
3. On submit, data is validated
4. Mutation executes with optimistic update
5. Success/error states update UI

## Performance Optimizations

### Build Optimizations
- **Code Splitting**: Route-based splitting with React.lazy
- **Tree Shaking**: Vite removes unused code
- **Asset Optimization**: Image optimization and font loading

### Runtime Optimizations
- **Query Caching**: Prevents unnecessary API calls
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists (future enhancement)
- **Image Lazy Loading**: For profile pictures and documents

## Security Architecture

### Authentication Security
- **JWT Tokens**: Secure token storage and refresh
- **Session Validation**: Server-side session verification
- **Route Protection**: Client-side authorization checks

### Data Security
- **Row Level Security**: Database-level access control
- **API Validation**: Server-side input validation
- **XSS Protection**: Sanitized content rendering

### Access Control
- **Role-Based UI**: Components render based on permissions
- **API Authorization**: Backend validates user permissions
- **Audit Logging**: Track sensitive operations

## Development Architecture

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route-level components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
├── integrations/  # External service integrations
└── types/         # TypeScript definitions
```

### Development Tools
- **TypeScript**: Strict type checking
- **ESLint**: Code quality and consistency
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing
- **Vite**: Fast development server

## Deployment Architecture

### Build Process
1. TypeScript compilation
2. Code splitting and bundling
3. Asset optimization
4. Static file generation

### Hosting Strategy
- **Static Hosting**: Vercel/Netlify for frontend
- **Backend**: Supabase for database and functions
- **CDN**: Global asset delivery
- **Environment Config**: Environment-specific settings

## Future Architecture Considerations

### Scalability
- **Micro-frontends**: Potential modularization
- **Service Workers**: Offline functionality
- **Progressive Web App**: Mobile optimization

### Monitoring
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Core Web Vitals tracking
- **Analytics**: User behavior insights

### Testing Strategy
- **Unit Tests**: Component and hook testing
- **Integration Tests**: API and component interaction
- **E2E Tests**: Critical user journeys
- **Visual Regression**: UI consistency testing