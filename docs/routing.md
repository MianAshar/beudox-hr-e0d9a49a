<!--
generated_by: tessera
source_sha: 91a7ddffb5c8bb2e9463683161eacd0d041403f9
generated_at: 2026-04-12T19:31:32.730Z
action: create
-->

# Routing Documentation

## Route Structure

The application uses React Router v6 with a hierarchical routing structure. All business routes are protected and require authentication.

### Public Routes

- `/` - Root redirect (to `/dashboard` if authenticated, `/login` otherwise)
- `/login` - User authentication
- `/forgot-password` - Password reset request

### Protected Routes

All routes under authentication require valid session and appropriate role permissions.

#### Dashboard & Overview
- `/dashboard` - Main dashboard with key metrics and recent activity

#### Employee Management
- `/employees` - Employee directory and management
- `/employees/new` - Create new employee
- `/employees/:id` - Employee profile view
- `/employees/:id/edit` - Edit employee information

#### Project Management
- `/projects` - Project listing and overview
- `/projects/new` - Create new project
- `/projects/:id` - Project details and management
- `/projects/:id/edit` - Edit project information

#### Client Management
- `/clients` - Client directory
- `/clients/:id` - Client details and project history

#### Financial Management
- `/invoices` - Invoice listing and management
- `/invoices/new` - Create new invoice
- `/invoices/:id` - Invoice details
- `/invoices/:id/edit` - Edit invoice
- `/payroll` - Payroll processing and history
- `/my-payslip` - Individual payslip view
- `/finance` - Financial reporting and analytics
- `/loans` - Loan management

#### HR Operations
- `/leave` - Leave requests and management
- `/evaluations` - Quarterly performance evaluations
- `/evaluations/new` - Create new evaluation
- `/evaluations/:id` - Evaluation details
- `/evaluations/:id/edit` - Edit evaluation
- `/evaluations/daily` - Daily peer evaluations
- `/evaluations/daily/new` - Create daily evaluation
- `/evaluations/daily/:id` - Daily evaluation details
- `/hr-policies` - HR policy documents
- `/hr-policies/new` - Create new policy
- `/hr-policies/:id` - Policy details
- `/hr-policies/:id/edit` - Edit policy

#### Administrative
- `/holidays` - Public holiday management
- `/settings` - System configuration
- `/notifications` - Notification center

## Route Protection

### Authentication Guards

The `ProtectedRoute` component wraps all business routes and implements:

1. **Loading States**: Shows spinner while checking authentication
2. **Session Validation**: Redirects to login if not authenticated
3. **Password Setup**: Intercepts users needing password setup
4. **Role Authorization**: Checks if user role can access the route
5. **Fallback Redirect**: Unauthorized users redirected to dashboard

### Role-Based Access

Access control is implemented in `src/lib/role-access.ts` with these permissions:

#### CEO (Full Access)
All routes accessible

#### HR Manager
- Dashboard, Employees, Holidays, Leave
- Projects, Clients, Evaluations (quarterly & daily)
- HR Policies, Loans, My Payslip, Notifications, Settings

#### Finance Manager
- Dashboard, Employees, Attendance, Payroll
- Invoices, Finance, Loans, Leave, Expenses
- Outsourcing, HR Policies, My Payslip, Notifications, Settings

#### Team Lead
- Dashboard, Attendance, Projects
- Evaluations (quarterly & daily), HR Policies
- Loans, Leave, My Payslip, Notifications

#### Employee
- Dashboard, Attendance, Projects
- Evaluations (quarterly & daily), HR Policies
- Loans, Leave, My Payslip, Notifications

## Route Implementation

### Route Configuration

Routes are defined in `src/App.tsx` using React Router's `Routes` and `Route` components:

```typescript
<Routes>
  <Route path="/" element={<RootRedirect />} />
  <Route path="/login" element={<Login />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  {/* Additional protected routes */}
</Routes>
```

### Dynamic Routing

Parameterized routes use URL parameters:
- `:id` - Resource identifier (employee, project, invoice, etc.)
- Automatic parameter extraction in components
- Type-safe parameter handling with TypeScript

### Nested Routes

Some features use nested routing for related functionality:
- `/evaluations/daily/*` - Daily evaluation sub-routes
- `/employees/:id/*` - Employee-specific sub-routes

## Navigation Patterns

### Programmatic Navigation

Components use `useNavigate` hook for programmatic routing:
- Form submissions redirect to list views
- Cancel actions return to previous pages
- Success messages with navigation

### Link Components

Custom `NavLink` component provides:
- Active state styling
- Pending state handling
- Accessibility features
- Type-safe navigation

### Breadcrumb Navigation

Consistent breadcrumb patterns for:
- Resource hierarchies (Employee > Profile > Edit)
- Multi-step processes (New Project > Details > Team)

## Route Data Loading

### Route-Level Data Fetching

Components handle their own data loading:
- TanStack Query for server state
- Loading states and error handling
- Optimistic updates for mutations

### Route Parameters

URL parameters are extracted using `useParams`:
```typescript
const { id } = useParams<{ id: string }>();
```

### Search Parameters

Query parameters handled with `useSearchParams`:
- Filtering and sorting
- Pagination state
- Modal state persistence

## Error Handling

### Route Errors

- 404 handling with `NotFound` component
- Authentication errors redirect to login
- Authorization errors redirect to dashboard
- Network errors show user-friendly messages

### Loading States

- Skeleton components for initial loads
- Spinner overlays for mutations
- Progressive loading for large datasets

## Performance Optimization

### Code Splitting

Routes are lazy-loaded to reduce initial bundle size:
```typescript
const Employees = lazy(() => import('./pages/Employees'));
```

### Route Preloading

Critical routes preload on user interaction:
- Hover states on navigation links
- Form submission anticipation

### Caching Strategy

- Route-level caching with TanStack Query
- Prefetching for likely next routes
- Background refetching for stale data

This routing architecture provides a scalable, secure foundation for the HR management application with clear navigation patterns and proper access control.