<!--
generated_by: tessera
source_sha: 939657ec2ede9cca1a4aad08f88592834464cc25
generated_at: 2026-04-16T12:21:14.215Z
action: create
-->

# Beudox HR - Routing Documentation

## Overview

Beudox HR uses React Router 6 for client-side routing with a comprehensive route structure supporting role-based access control, nested routes, and protected navigation.

## Router Configuration

### Main Router Setup
**File**: `src/App.tsx`

```typescript
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Route definitions */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

### Route Structure

#### Public Routes
```typescript
<Route path="/" element={<RootRedirect />} />
<Route path="/login" element={<Login />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/set-password" element={<SetPassword />} />
```

#### Protected Routes
```typescript
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
<Route path="/employees/new" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
<Route path="/employees/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
<Route path="/employees/:id/edit" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
```

## Route Protection

### ProtectedRoute Component

**Logic Flow**:
1. **Loading State**: Show spinner while auth loads
2. **Password Mode**: Intercept invite/recovery flows
3. **Authentication**: Redirect to login if not authenticated
4. **Authorization**: Redirect to dashboard if insufficient permissions
5. **Render**: Show protected content with layout

**Implementation**:
```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, passwordMode, clearPasswordMode, employee } = useAuth();
  const location = useLocation();

  // 1. Loading auth or employee data
  if (loading || (session && !employee)) {
    return <LoadingSpinner />;
  }

  // 2. Intercept password setup
  if (session && passwordMode) {
    return <SetPassword mode={passwordMode} onComplete={clearPasswordMode} />;
  }

  // 3. Not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 4. Insufficient permissions
  if (!canAccess(employee?.role_name, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 5. Authorized - render with layout
  return <AppLayout>{children}</AppLayout>;
};
```

## Route Permissions

### Role-Based Access Control
**File**: `src/lib/role-access.ts`

```typescript
export const canAccess = (role: string | undefined, path: string): boolean => {
  if (!role) return false;

  const permissions: Record<string, string[]> = {
    ceo: ['*'], // Full access
    hr_manager: [
      '/dashboard',
      '/employees',
      '/leave',
      '/evaluations',
      '/payroll',
      '/settings',
      // ... more paths
    ],
    team_lead: [
      '/dashboard',
      '/employees', // Limited employee access
      '/evaluations',
      '/projects',
      // ... restricted paths
    ],
    employee: [
      '/dashboard',
      '/my-payslip',
      '/leave',
      // ... personal paths only
    ],
  };

  const allowedPaths = permissions[role] || [];
  return allowedPaths.includes('*') || allowedPaths.some(allowedPath => 
    path.startsWith(allowedPath)
  );
};
```

### Route Groups by Role

#### CEO Routes
- **Full Access**: All application routes
- **Administrative**: Company settings, user management
- **Financial**: Payroll, invoices, finance dashboard

#### HR Manager Routes
- **Employee Management**: Full CRUD operations
- **HR Operations**: Leave, evaluations, policies
- **Reporting**: Analytics and dashboards

#### Team Lead Routes
- **Team Management**: Team member profiles
- **Performance**: Evaluations for team members
- **Projects**: Project management and assignments

#### Employee Routes
- **Personal**: Profile, payslips, leave requests
- **Read-only**: Limited access to team information
- **Self-service**: Personal data management

## Route Parameters

### Dynamic Routes

#### Employee Routes
```typescript
// Employee profile
<Route path="/employees/:id" element={<EmployeeProfile />} />

// Employee editing
<Route path="/employees/:id/edit" element={<EmployeeForm />} />

// Component usage
const { id } = useParams<{ id: string }>(); // TypeScript support
```

#### Evaluation Routes
```typescript
// Quarterly evaluation detail
<Route path="/evaluations/:id" element={<EvaluationDetail />} />

// Daily evaluation detail
<Route path="/evaluations/daily/:id" element={<DailyEvaluationDetail />} />
```

#### Project Routes
```typescript
// Project detail
<Route path="/projects/:id" element={<ProjectDetail />} />

// Project editing
<Route path="/projects/:id/edit" element={<ProjectForm />} />
```

### Query Parameters

#### Filtering and Search
```typescript
// Employees with search
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const search = searchParams.get('search');
const department = searchParams.get('department');

// URL: /employees?search=john&department=engineering
```

#### Pagination
```typescript
// Paginated lists
const page = searchParams.get('page') || '1';
const limit = searchParams.get('limit') || '20';

// URL: /employees?page=2&limit=50
```

## Navigation Components

### NavLink Component
**File**: `src/components/NavLink.tsx`

Enhanced NavLink with active state styling:

```typescript
<NavLink
  to="/dashboard"
  className="nav-link"
  activeClassName="nav-link-active"
>
  Dashboard
</NavLink>
```

### Programmatic Navigation

#### useNavigate Hook
```typescript
// Navigation after actions
const navigate = useNavigate();

// After creating employee
navigate(`/employees/${newEmployee.id}`);

// With state
navigate('/login', { state: { from: location } });
```

#### Link Component
```typescript
// Declarative navigation
import { Link } from 'react-router-dom';

<Link to={`/employees/${employee.id}`}>View Profile</Link>
```

## Route Data Loading

### React Query Integration

#### Route-specific Queries
```typescript
// Employee profile query
const { data: employee, isLoading } = useQuery({
  queryKey: ['employee', id],
  queryFn: () => fetchEmployee(id),
  enabled: !!id, // Only run when ID is available
});
```

#### Dependent Queries
```typescript
// Evaluations depend on employee data
const { data: evaluations } = useQuery({
  queryKey: ['evaluations', employee?.id],
  queryFn: () => fetchEvaluations(employee.id),
  enabled: !!employee?.id, // Wait for employee data
});
```

### Loading States

#### Route-level Loading
```typescript
if (isLoading) {
  return <LoadingSpinner />;
}
```

#### Skeleton Components
```typescript
// Content placeholders
<div className="space-y-4">
  <Skeleton className="h-8 w-48" />
  <Skeleton className="h-32 w-full" />
</div>
```

## Error Handling

### Route Errors
```typescript
// 404 handling
<Route path="*" element={<NotFound />} />

// Error boundaries
<ErrorBoundary>
  <Routes>
    {/* Routes */}
  </Routes>
</ErrorBoundary>
```

### Navigation Guards

#### Confirmation Dialogs
```typescript
// Prevent navigation with unsaved changes
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasUnsavedChanges]);
```

## Performance Optimization

### Route-based Code Splitting
```typescript
// Lazy load route components
const Employees = lazy(() => import('./pages/Employees'));
const EmployeeProfile = lazy(() => import('./pages/EmployeeProfile'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/employees" element={<Employees />} />
    <Route path="/employees/:id" element={<EmployeeProfile />} />
  </Routes>
</Suspense>
```

### Prefetching
```typescript
// Prefetch on hover
<Link
  to={`/employees/${id}`}
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: ['employee', id],
      queryFn: () => fetchEmployee(id),
    });
  }}
>
  View Employee
</Link>
```

## Testing Routes

### Route Testing
```typescript
// Test route rendering
test('renders employees page', () => {
  render(
    <MemoryRouter initialEntries={['/employees']}>
      <Routes>
        <Route path="/employees" element={<Employees />} />
      </Routes>
    </MemoryRouter>
  );
  
  expect(screen.getByText('Employees')).toBeInTheDocument();
});
```

### Navigation Testing
```typescript
// Test programmatic navigation
test('navigates after form submission', async () => {
  const mockNavigate = jest.fn();
  // Mock useNavigate
  
  render(<EmployeeForm />);
  
  // Submit form
  await userEvent.click(screen.getByText('Save'));
  
  expect(mockNavigate).toHaveBeenCalledWith('/employees');
});
```

This routing documentation provides a comprehensive guide to the Beudox HR application's navigation system, security model, and routing patterns.