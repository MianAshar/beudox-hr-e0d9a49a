<!--
generated_by: tessera
source_sha: a90685c00aea6cff27dce068c05702801a768e5c
generated_at: 2026-04-19T20:46:03.184Z
action: create
-->

# Beudox HR - Routing Architecture

## Route Structure Overview

Beudox HR uses React Router DOM for client-side routing with a comprehensive route structure supporting role-based access control and nested layouts.

## Main Route Configuration

### Public Routes
```typescript
/
├── /login
├── /forgot-password
└── /set-password
```

### Protected Routes (Require Authentication)
```typescript
/dashboard
/employees
├── /employees/new
├── /employees/:id
└── /employees/:id/edit

/projects
├── /projects/new
├── /projects/:id
└── /projects/:id/edit

/clients
└── /clients/:id

/invoices
├── /invoices/new
├── /invoices/:id
└── /invoices/:id/edit

/hr-policies
├── /hr-policies/new
├── /hr-policies/:id
└── /hr-policies/:id/edit

/evaluations
├── /evaluations/new
├── /evaluations/:id
└── /evaluations/:id/edit
├── /evaluations/daily
├── /evaluations/daily/new
├── /evaluations/daily/:id

/loans
/payroll
/my-payslip
/finance
/leave
/my-profile
/my-tasks
/settings
/holidays
```

## Route Protection Strategy

### Authentication Guard
```typescript
// All protected routes wrapped in ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { session, loading, employee } = useAuth();
  
  // Loading state
  if (loading || (session && !employee)) {
    return <LoadingSpinner />;
  }
  
  // Redirect to login if not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  // Role-based access control
  if (!canAccess(employee?.role_name, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <AppLayout>{children}</AppLayout>;
};
```

### Role-Based Access Matrix

| Route Pattern | CEO | HR Manager | Team Lead | Employee |
|---------------|-----|------------|-----------|----------|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/employees*` | ✅ | ✅ | ❌ | ❌ |
| `/projects*` | ✅ | ✅ | ✅ | ❌ |
| `/finance` | ✅ | ✅ | ❌ | ❌ |
| `/payroll` | ✅ | ✅ | ❌ | ❌ |
| `/settings` | ✅ | ✅ | ❌ | ❌ |
| `/evaluations*` | ✅ | ✅ | ✅ | ❌ |
| `/leave` | ✅ | ✅ | ✅ | ✅ |
| `/my-profile` | ✅ | ✅ | ✅ | ✅ |
| `/my-payslip` | ✅ | ✅ | ✅ | ✅ |

## Route Components

### Page Components
Each route corresponds to a page component in `src/pages/`:

- `Dashboard.tsx` - Main dashboard with overview widgets
- `Employees.tsx` - Employee list and management
- `EmployeeProfile.tsx` - Individual employee details
- `EmployeeForm.tsx` - Create/edit employee form
- `Projects.tsx` - Project management
- `ProjectDetail.tsx` - Project details and tasks
- `Settings.tsx` - System configuration

### Layout Components
- `AppLayout.tsx` - Main application shell
- `AppSidebar.tsx` - Navigation sidebar
- `TopBar.tsx` - Top navigation bar

## Navigation Patterns

### Sidebar Navigation
```typescript
// Dynamic navigation based on user role
const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/employees', label: 'Employees', roles: ['ceo', 'hr_manager'] },
  { path: '/projects', label: 'Projects', roles: ['ceo', 'hr_manager', 'team_lead'] },
  // ...
];
```

### Breadcrumb Navigation
```typescript
// Automatic breadcrumbs based on route
const breadcrumbs = [
  { label: 'Employees', path: '/employees' },
  { label: employeeName, path: `/employees/${id}` },
  { label: 'Edit', path: `/employees/${id}/edit` },
];
```

## Route Parameters

### Dynamic Routes
- **Employee ID**: `/employees/:id` - View employee profile
- **Project ID**: `/projects/:id` - View project details
- **Evaluation ID**: `/evaluations/:id` - View evaluation details
- **Client ID**: `/clients/:id` - View client details
- **Invoice ID**: `/invoices/:id` - View invoice details

### Query Parameters
- **Pagination**: `?page=1&limit=20`
- **Filtering**: `?status=active&department=engineering`
- **Sorting**: `?sort=name&order=asc`
- **Search**: `?search=john%20doe`

## Route Guards and Redirects

### Authentication Redirects
```typescript
// Root redirect based on auth state
const RootRedirect = () => {
  const { session, passwordMode } = useAuth();
  
  // Handle password reset/invite flows
  if (session && passwordMode) {
    return <SetPassword mode={passwordMode} />;
  }
  
  // Redirect to dashboard if authenticated, login if not
  return <Navigate to={session ? "/dashboard" : "/login"} replace />;
};
```

### Permission-Based Redirects
```typescript
// Redirect unauthorized users to dashboard
const location = useLocation();
if (location.pathname !== '/my-profile' && !canAccess(role, location.pathname)) {
  return <Navigate to="/dashboard" replace />;
}
```

## Code Splitting Strategy

### Route-Based Splitting
```typescript
// Automatic code splitting by route
const Employees = lazy(() => import('./pages/Employees'));
const Projects = lazy(() => import('./pages/Projects'));

// Suspense boundaries for loading states
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/employees" element={<Employees />} />
    <Route path="/projects" element={<Projects />} />
  </Routes>
</Suspense>
```

### Component-Level Splitting
```typescript
// Lazy load heavy components
const EvaluationTimeline = lazy(() => import('./components/EvaluationTimeline'));
const FinanceSummary = lazy(() => import('./components/FinanceSummary'));
```

## Navigation Hooks

### Custom Navigation Hook
```typescript
// Programmatic navigation with type safety
function useAppNavigation() {
  const navigate = useNavigate();
  
  return {
    goToEmployee: (id: string) => navigate(`/employees/${id}`),
    goToProject: (id: string) => navigate(`/projects/${id}`),
    goToDashboard: () => navigate('/dashboard'),
  };
}
```

### Route State Management
```typescript
// Pass state between routes
navigate('/employees/new', { 
  state: { departmentId, managerId } 
});

const location = useLocation();
const { departmentId, managerId } = location.state || {};
```

## SEO and Accessibility

### Page Titles
```typescript
// Dynamic page titles based on route
useEffect(() => {
  document.title = `${pageTitle} | Beudox HR`;
}, [pageTitle]);
```

### Focus Management
```typescript
// Manage focus for screen readers
useEffect(() => {
  if (mainContentRef.current) {
    mainContentRef.current.focus();
  }
}, [location.pathname]);
```

## Error Boundaries

### Route-Level Error Handling
```typescript
// Catch routing errors
const NotFound = () => (
  <div className="text-center">
    <h1>404 - Page Not Found</h1>
    <Link to="/dashboard">Go to Dashboard</Link>
  </div>
);
```

### Global Error Boundary
```typescript
// Catch component errors
class ErrorBoundary extends Component {
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Performance Optimizations

### Route Preloading
```typescript
// Preload routes on hover
<Link 
  to="/employees" 
  onMouseEnter={() => import('./pages/Employees')}
>
  Employees
</Link>
```

### Route Memoization
```typescript
// Memoize route components
const Dashboard = memo(lazy(() => import('./pages/Dashboard')));
```

## Testing Route Configuration

### Route Testing
```typescript
// Test route protection
describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
```

### Navigation Testing
```typescript
// Test programmatic navigation
describe('useAppNavigation', () => {
  it('navigates to employee profile', () => {
    const { goToEmployee } = useAppNavigation();
    goToEmployee('123');
    expect(mockNavigate).toHaveBeenCalledWith('/employees/123');
  });
});
```

This routing architecture provides a scalable, secure, and performant navigation system that supports complex role-based access patterns and modern React development practices.