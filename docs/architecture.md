<!--
generated_by: tessera
source_sha: 57916dea765f7842719cc653be4eca1e09745835
generated_at: 2026-04-01T09:45:14.979Z
action: create
-->

# Beudox HR - Architecture Documentation

## Application Architecture

Beudox HR is built as a single-page application (SPA) using React with a component-based architecture. The application follows modern React patterns with hooks, context, and functional components.

## Technology Stack

### Frontend Framework
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool with HMR

### UI & Styling
- **shadcn/ui**: Component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Design System**: Beudox brand colors and typography

### State Management
- **TanStack Query**: Server state management
- **React Context**: Global auth state
- **React Hook Form**: Form state management

### Backend & Data
- **Supabase**: PostgreSQL database + Auth + Edge Functions
- **Zod**: Schema validation

## Component Architecture

### Layout System
```
AppLayout
├── AppSidebar (collapsible navigation)
├── TopBar (page headers)
└── Main Content Area
```

### Component Hierarchy
- **Pages**: Route-level components (Dashboard, Employees, etc.)
- **Layout Components**: App structure (AppLayout, AppSidebar, TopBar)
- **UI Components**: Reusable elements (Button, Input, Card, etc.)
- **Feature Components**: Domain-specific components

## Routing Architecture

### Route Structure
- **Public Routes**: `/login`, `/forgot-password`
- **Protected Routes**: All app routes wrapped in `ProtectedRoute`
- **Role-Based Access**: Routes filtered by user permissions

### Route Protection
```typescript
// ProtectedRoute component checks:
1. Authentication status
2. User role permissions
3. Loading states
4. Password reset flows
```

## Data Flow

### Authentication Flow
1. User submits credentials
2. Supabase validates and returns session
3. Auth context fetches employee data
4. User data cached in context
5. Routes and components access via hooks

### Data Fetching
- **TanStack Query**: Caching, background updates, optimistic updates
- **Supabase Client**: Direct database queries
- **Edge Functions**: Server-side business logic

## State Management

### Global State
- **Auth Context**: User session, employee data, permissions
- **Query Client**: Server state with caching

### Local State
- **Component State**: UI interactions, form data
- **URL State**: Route parameters and query strings

## Security Architecture

### Authentication
- **Supabase Auth**: JWT-based authentication
- **Session Management**: Automatic token refresh
- **Password Reset**: Secure reset flows

### Authorization
- **Role-Based Access**: Permission checks at route and component levels
- **Row Level Security**: Database-level access control
- **API Security**: Authenticated requests only

## Performance Considerations

### Build Optimization
- **Vite**: Fast development and optimized production builds
- **SWC**: Fast TypeScript compilation
- **Tree Shaking**: Unused code elimination

### Runtime Performance
- **React 18**: Concurrent rendering features
- **Query Caching**: Reduced API calls
- **Lazy Loading**: Code splitting opportunities

## Development Architecture

### Project Structure
```
src/
├── components/     # Reusable components
├── hooks/         # Custom hooks
├── lib/           # Utilities
├── pages/         # Route components
├── integrations/  # External services
└── test/          # Test files
```

### Code Organization
- **Feature-based**: Components grouped by domain
- **Shared Components**: Common UI elements
- **Utilities**: Pure functions and helpers
- **Integrations**: External service configurations

## Deployment Architecture

### Build Process
- **Static Generation**: Vite produces static assets
- **Environment Config**: Supabase keys via environment variables
- **CDN Ready**: Optimized bundles for global distribution

### Backend Dependencies
- **Supabase Project**: Required for database and auth
- **Edge Functions**: Deployed serverless functions
- **Database Migrations**: Version-controlled schema changes