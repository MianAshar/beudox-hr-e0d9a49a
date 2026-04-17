<!--
generated_by: tessera
source_sha: a3fee058d2cecde50bd4cbc8525ed9b5120feb14
generated_at: 2026-04-17T23:08:55.981Z
action: create
-->

# Architecture Documentation

## Application Structure

### Routing Architecture

The application uses React Router v6 with a hierarchical routing structure:

```
/
├── /login
├── /forgot-password
├── /set-password
└── Protected Routes (require authentication)
    ├── /dashboard
    ├── /employees/*
    ├── /leave
    ├── /evaluations/*
    ├── /payroll
    ├── /projects/*
    ├── /clients/*
    ├── /invoices/*
    ├── /hr-policies/*
    ├── /loans
    ├── /finance
    ├── /settings
    └── /my-profile
```

### Component Hierarchy

```
App
├── AuthProvider
├── QueryClientProvider
├── TooltipProvider
├── Toaster Components
└── BrowserRouter
    ├── Root Redirect (/)
    ├── Public Routes (Login, Password Reset)
    └── Protected Routes
        └── AppLayout
            ├── AppSidebar
            ├── TopBar
            └── Page Content
```

## Data Flow Patterns

### Authentication Flow
1. User visits protected route
2. AuthProvider checks session state
3. If no session → redirect to /login
4. If session exists → fetch employee data
5. Role-based access check via canAccess() function
6. Render protected content or redirect to /dashboard

### Data Fetching Pattern
```typescript
// Using TanStack Query for server state
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', params],
  queryFn: async () => {
    const { data } = await supabase
      .from('table')
      .select('*')
      .eq('company_id', companyId);
    return data;
  },
  enabled: !!companyId,
});
```

## Key Components

### Layout Components
- **AppLayout**: Main application shell with sidebar and topbar
- **AppSidebar**: Collapsible navigation with role-based menu items
- **TopBar**: Page title and breadcrumb navigation
- **NotificationBell**: Real-time notification display
- **UserMenu**: User profile and logout functionality

### Feature Components
- **EvaluationTimeline**: Displays evaluation history with filtering
- **SearchableEmployeeSelect**: Employee selection with search and avatars
- **RichTextEditor**: TipTap-based rich text editing for policies
- **Leave Management Tabs**: Request, balance, and approval interfaces

### UI Component Library
The app uses shadcn/ui built on Radix UI primitives:
- Form components (Input, Select, Textarea)
- Data display (Table, Card, Badge)
- Navigation (Tabs, Breadcrumb, Pagination)
- Feedback (Toast, Alert, Skeleton)
- Overlay (Dialog, Sheet, Popover)

## State Management

### Global State
- **Auth Context**: User session, employee data, company info
- **Query Client**: Server state caching and synchronization

### Local State
- Form state managed by React Hook Form
- UI state (modals, dropdowns) using React state
- Component-specific state for interactions

## Database Integration

### Supabase Client Configuration
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

### Query Patterns
- Type-safe database operations
- Row Level Security (RLS) for data isolation
- Real-time subscriptions for live updates
- Optimistic updates for better UX

## Security Architecture

### Authentication
- Supabase Auth handles user sessions
- JWT tokens for API authentication
- Secure password reset flows

### Authorization
- Role-based access control (RBAC)
- Route-level protection
- UI-level permission checks
- Database RLS policies

### Data Protection
- Company-based data isolation
- Encrypted data transmission
- Secure file storage via Supabase Storage

## Performance Optimizations

### Build Optimizations
- Vite with SWC for fast compilation
- Code splitting by routes
- Asset optimization and minification

### Runtime Optimizations
- TanStack Query caching
- Lazy loading of components
- Image optimization
- Efficient re-renders with React.memo

### Database Optimizations
- Indexed queries
- Pagination for large datasets
- Efficient JOIN operations
- Connection pooling via Supabase

## Development Workflow

### Code Organization
- Feature-based file structure
- Shared utilities in lib/
- Type definitions in types/
- Component composition over inheritance

### Quality Assurance
- TypeScript for type safety
- ESLint for code consistency
- Unit tests with Vitest
- E2E tests with Playwright

### Deployment
- Static SPA build
- Environment-based configuration
- CDN deployment ready
- Supabase backend scaling