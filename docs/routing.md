<!--
generated_by: tessera
source_sha: 1cec2ce393d8f182112788746e7935917c082ccd
generated_at: 2026-04-07T21:17:04.205Z
action: create
-->

# Beudox HR - Routing & Navigation

## Route Structure

Beudox HR uses React Router v6 for client-side routing with role-based access control. The application has 30+ routes organized by feature areas.

### Public Routes

```typescript
/login                    // Authentication
/forgot-password          // Password reset
```

### Protected Routes (Role-Based Access)

#### Dashboard & Core
```typescript
/dashboard               // Main dashboard (all roles)
/settings                // System settings (HR, Finance, CEO)
```

#### Employee Management
```typescript
/employees               // Employee list (HR, Finance, CEO)
/employees/new           // Add employee (HR, CEO)
/employees/:id           // Employee profile (HR, Finance, CEO)
/employees/:id/edit      // Edit employee (HR, CEO)
```

#### Project Management
```typescript
/projects                // Project list (Employee, HR, Finance, Team Lead, CEO)
/projects/new            // Create project (HR, CEO)
/projects/:id            // Project details (Employee, HR, Finance, Team Lead, CEO)
/projects/:id/edit       // Edit project (HR, CEO)
```

#### Client Management
```typescript
/clients                 // Client list (HR, CEO)
/clients/:id             // Client details (HR, CEO)
```

#### Financial Management
```typescript
/invoices                // Invoice list (Finance, CEO)
/invoices/new            // Create invoice (Finance, CEO)
/invoices/:id            // Invoice details (Finance, CEO)
/invoices/:id/edit       // Edit invoice (Finance, CEO)
/payroll                 // Payroll management (Finance, CEO)
```

#### HR Operations
```typescript
/evaluations             // Quarterly evaluations (Employee, HR, Team Lead, CEO)
/evaluations/new         // Create evaluation (HR, CEO)
/evaluations/:id         // Evaluation details (Employee, HR, Team Lead, CEO)
/evaluations/:id/edit    // Edit evaluation (HR, CEO)
/evaluations/daily       // Daily evaluations (Employee, HR, Team Lead, CEO)
/evaluations/daily/new   // Create daily evaluation (Employee, HR, Team Lead, CEO)
/evaluations/daily/:id   // Daily evaluation details (Employee, HR, Team Lead, CEO)
```

#### HR Policies
```typescript
/hr-policies             // Policy list (all roles)
/hr-policies/new         // Create policy (HR, CEO)
/hr-policies/:id         // Policy details (all roles)
/hr-policies/:id/edit    // Edit policy (HR, CEO)
```

#### Other Features
```typescript
/holidays                // Public holidays (HR, CEO)
/loans                   // Loan management (Employee, HR, Finance, CEO)
/my-payslip              // Personal payslip (Employee, HR, Finance, Team Lead, CEO)
```

## Role-Based Access Control

### Access Matrix

| Route Pattern | Employee | Team Lead | HR Manager | Finance Manager | CEO |
|---------------|----------|-----------|------------|-----------------|-----|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/employees*` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `/projects*` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/clients*` | ❌ | ❌ | ✅ | ❌ | ✅ |
| `/invoices*` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `/payroll` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `/evaluations*` | ✅ | ✅ | ✅ | ❌ | ✅ |
| `/hr-policies*` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/settings` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `/loans` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/my-payslip` | ✅ | ✅ | ✅ | ✅ | ✅ |

### Access Control Logic

```typescript
// src/lib/role-access.ts
export type AppRole = 'employee' | 'hr_manager' | 'finance_manager' | 'team_lead' | 'ceo';

const roleRoutes: Record<Exclude<AppRole, 'ceo'>, string[]> = {
  employee: [
    '/dashboard', '/attendance', '/projects', '/evaluations',
    '/evaluations/daily', '/hr-policies', '/loans', '/my-payslip', '/notifications'
  ],
  hr_manager: [
    '/dashboard', '/employees', '/attendance', '/holidays', '/leave',
    '/projects', '/clients', '/evaluations', '/evaluations/daily',
    '/hr-policies', '/loans', '/my-payslip', '/notifications', '/settings'
  ],
  finance_manager: [
    '/dashboard', '/employees', '/attendance', '/payroll', '/invoices',
    '/finance', '/loans', '/expenses', '/outsourcing', '/hr-policies',
    '/my-payslip', '/notifications', '/settings'
  ],
  team_lead: [
    '/dashboard', '/attendance', '/projects', '/evaluations',
    '/evaluations/daily', '/hr-policies', '/loans', '/my-payslip', '/notifications'
  ]
};

export function canAccess(role: string | null | undefined, path: string): boolean {
  if (!role) return false;
  if (role === 'ceo') return true;

  const allowed = roleRoutes[role as Exclude<AppRole, 'ceo'>];
  if (!allowed) return false;

  return allowed.some(r => path === r || path.startsWith(r + '/'));
}
```

## Navigation Components

### AppSidebar Navigation

The sidebar navigation adapts based on user role, showing only accessible routes:

```typescript
// src/components/layout/AppSidebar.tsx
const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  // Conditionally show based on role
  ...(canAccess(role, '/employees') ? [{ path: '/employees', label: 'Employees' }] : []),
  ...(canAccess(role, '/projects') ? [{ path: '/projects', label: 'Projects' }] : []),
  // ... more items
];
```

### Breadcrumb Navigation

Dynamic breadcrumbs show the current page hierarchy:

```typescript
// Example breadcrumb generation
const breadcrumbs = [
  { label: 'Employees', path: '/employees' },
  { label: employee.name, path: `/employees/${id}` },
  { label: 'Edit', path: `/employees/${id}/edit` }
];
```

## Route Protection

### ProtectedRoute Component

```typescript
// src/App.tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, passwordMode, clearPasswordMode, employee } = useAuth();
  const location = useLocation();

  // 1. Loading state - show spinner
  if (loading || (session && !employee)) {
    return <LoadingSpinner />;
  }

  // 2. Handle password setup for new users
  if (session && passwordMode) {
    return <SetPassword mode={passwordMode} onComplete={clearPasswordMode} />;
  }

  // 3. Redirect to login if not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 4. Check role-based access
  if (!canAccess(employee?.role_name, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 5. Render protected content
  return <AppLayout>{children}</AppLayout>;
};
```

## Route Organization

### Feature-Based Grouping

Routes are organized by business domain:

- **Authentication**: Login, password reset
- **Core HR**: Employees, evaluations, policies
- **Project Management**: Projects, clients
- **Finance**: Invoices, payroll
- **Self-Service**: Personal dashboard, payslips

### URL Patterns

Consistent URL patterns across features:

- List: `/{resource}` (e.g., `/employees`)
- Create: `/{resource}/new` (e.g., `/employees/new`)
- Detail: `/{resource}/{id}` (e.g., `/employees/123`)
- Edit: `/{resource}/{id}/edit` (e.g., `/employees/123/edit`)

### Nested Routes

Some features use nested routing for related functionality:

- Evaluations: `/evaluations` (quarterly) vs `/evaluations/daily`
- Projects: `/projects/{id}` with potential sub-routes for tasks, time tracking

## Navigation UX Patterns

### Active State Indication

```typescript
// src/components/NavLink.tsx
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  }
);
```

### Loading States

Routes show loading indicators during navigation:

```typescript
// Page-level loading
if (isLoading) {
  return <Skeleton className="h-8 w-48" />;
}
```

### Error Boundaries

Route-level error boundaries catch and handle navigation errors:

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends Component {
  // Handle route errors gracefully
}
```

## Performance Considerations

### Code Splitting

Routes are lazy-loaded for better performance:

```typescript
// src/App.tsx
const Employees = lazy(() => import('./pages/Employees'));
const Projects = lazy(() => import('./pages/Projects'));
// ... other pages
```

### Route Preloading

Critical routes can be preloaded:

```typescript
// Preload dashboard data
<Router>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Router>
```

This routing architecture provides a secure, scalable, and user-friendly navigation experience with proper access control and performance optimizations.