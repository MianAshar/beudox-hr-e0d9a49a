<!--
generated_by: tessera
source_sha: 387391b56870e1f87a0608cfe39642ec2a98d0ba
generated_at: 2026-04-21T11:07:06.081Z
action: create
-->

# Beudox HR - Routing Structure

## Overview

Beudox HR uses React Router v6 for client-side routing with a comprehensive route structure supporting 30+ pages across multiple HR domains. The routing system implements role-based access control and protected routes.

## Route Hierarchy

### Public Routes
```typescript
/                     // Root redirect
/login                 // Authentication
/forgot-password       // Password recovery
/set-password          // Password setup (invite/recovery)
```

### Protected Routes (Require Authentication)

#### Dashboard & Overview
```typescript
/dashboard            // Main dashboard
/my-profile           // Personal profile (all authenticated users)
/my-tasks             // Personal task list
/my-payslip           // Personal payslip access
```

#### Employee Management
```typescript
/employees            // Employee listing
/employees/new        // Create new employee
/employees/:id        // Employee profile view
/employees/:id/edit   // Edit employee
```

#### Project Management
```typescript
/projects             // Project listing
/projects-v2          // Alternative project view
/projects/new         // Create project
/projects/:id         // Project detail
/projects/:id/edit    // Edit project
```

#### Client & Financial Management
```typescript
/clients              // Client listing
/clients/:id          // Client detail
/invoices             // Invoice listing
/invoices/new         // Create invoice
/invoices/:id         // Invoice detail
/invoices/:id/edit    // Edit invoice
/finance              // Finance dashboard
```

#### HR Administration
```typescript
/hr-policies          // Policy listing
/hr-policies/new      // Create policy
/hr-policies/:id      // Policy detail
/hr-policies/:id/edit // Edit policy
/job-descriptions     // Job description listing
/job-descriptions/new // Create job description
/job-descriptions/:id // Job description detail
/job-descriptions/:id/edit // Edit job description
```

#### Performance Management
```typescript
/evaluations          // Performance evaluation listing
/evaluations/new      // Create evaluation
/evaluations/:id      // Evaluation detail
/evaluations/:id/edit // Edit evaluation
/evaluations/daily    // Daily evaluations listing
/evaluations/daily/new // Create daily evaluation
/evaluations/daily/:id // Daily evaluation detail
```

#### Administrative Settings
```typescript
/settings             // Main settings page
/leave                // Leave management
/payroll              // Payroll processing
/holidays             // Public holidays
/loans                // Loan management
```

## Route Protection System

### Authentication Guards
All business routes are wrapped with `ProtectedRoute` component that implements:

1. **Loading States**: Shows spinner while checking auth
2. **Session Validation**: Redirects to login if not authenticated
3. **Employee Data Loading**: Ensures user profile is loaded
4. **Password Mode Handling**: Intercepts invite/recovery flows
5. **Permission Checks**: Validates role-based access

### Permission-Based Routing
Routes check permissions using `canAccess(employee?.roles, pathname)`:
- `/my-profile` is accessible to all authenticated users
- Other routes require specific role permissions
- Unauthorized access redirects to `/dashboard`

## Route Components

### Page Components
Each route maps to a component in `src/pages/`:

- **Dashboard.tsx**: Overview with metrics and recent activity
- **Employees.tsx**: Employee directory with search and filters
- **EmployeeProfile.tsx**: Tabbed interface (Attendance, Payroll, etc.)
- **Settings.tsx**: Administrative configuration tabs
- **Projects.tsx**: Project management interface

### Layout Integration
Most routes use `AppLayout` component providing:
- **AppSidebar**: Navigation menu
- **TopBar**: User menu and notifications
- **Main Content**: Page-specific content

## Navigation Components

### Sidebar Navigation
`AppSidebar.tsx` provides role-based menu items:

```typescript
// Example menu structure
const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/employees', label: 'Employees', roles: ['admin', 'hr'] },
  { path: '/projects', label: 'Projects', roles: ['admin', 'manager'] },
  // ... more items
];
```

### Breadcrumb Navigation
Context-aware breadcrumbs showing current location:
- Dashboard > Employees > John Doe
- Projects > Website Redesign > Tasks

### Quick Actions
Contextual action buttons based on current route:
- "Add Employee" on `/employees`
- "Create Project" on `/projects`

## URL Patterns & Parameters

### Dynamic Routes
Routes use URL parameters for entity identification:

```typescript
/employees/:id        // Employee ID
/projects/:id         // Project ID
/invoices/:id         // Invoice ID
/hr-policies/:id      // Policy ID
```

### Query Parameters
Additional filtering and state:

```typescript
/employees?page=1&search=john    // Pagination and search
/projects?status=active          // Status filtering
/attendance?month=2024-01        // Date filtering
```

## Route-Based Code Splitting

### Lazy Loading
Routes are designed for lazy loading:

```typescript
const Employees = lazy(() => import('./pages/Employees'));
const Projects = lazy(() => import('./pages/Projects'));

// In router
const routes = [
  { path: '/employees', element: <Employees /> },
  { path: '/projects', element: <Projects /> },
];
```

### Bundle Optimization
- **Route-based splitting**: Each page loads independently
- **Shared dependencies**: Common libraries in main bundle
- **Preloading**: Adjacent routes preload on hover

## Navigation Patterns

### Programmatic Navigation
```typescript
// After successful creation
const navigate = useNavigate();
navigate(`/employees/${newEmployeeId}`);

// With state
navigate('/projects/new', { state: { clientId } });
```

### Redirect Patterns
```typescript
// Authentication redirect
if (!session) return <Navigate to="/login" replace />;

// Permission redirect
if (!canAccess(roles, pathname)) return <Navigate to="/dashboard" replace />;
```

### Back Navigation
Context-aware back buttons using `useNavigate(-1)` or specific routes based on referrer.

## Route Metadata

### Page Titles
Dynamic document titles based on current route:

```typescript
useEffect(() => {
  document.title = `${pageTitle} | Beudox HR`;
}, [pageTitle]);
```

### Route Configuration
Centralized route configuration for:
- Page titles
- Required permissions
- Navigation labels
- Icons and descriptions

## Error Handling

### 404 Handling
Catch-all route for undefined paths:
```typescript
{ path: '*', element: <NotFound /> }
```

### Error Boundaries
Route-level error boundaries for graceful error handling.

## Performance Considerations

### Route Preloading
- **Link prefetching**: Hover states preload route bundles
- **Data prefetching**: Preload critical data for target routes
- **Image preloading**: Preload route-specific assets

### Memory Management
- **Component cleanup**: Proper cleanup on route changes
- **Subscription cleanup**: Cancel subscriptions on unmount
- **Cache management**: Clear stale cache on navigation

This routing architecture provides a scalable, secure, and performant navigation system supporting complex HR workflows with proper access control and user experience optimizations.