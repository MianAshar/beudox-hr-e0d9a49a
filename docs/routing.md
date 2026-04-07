<!--
generated_by: tessera
source_sha: 5ad27002d46dd144b4404dd6446fd9fca6cca7e0
generated_at: 2026-04-07T20:51:03.221Z
action: create
-->

# Beudox HR - Routing Documentation

## Route Structure

The application uses a hierarchical routing system built with React Router DOM, implementing role-based access control and protected routes.

### Public Routes

#### Authentication Routes
- `/` - Root redirect (to login or dashboard based on auth status)
- `/login` - User login page
- `/forgot-password` - Password reset request

### Protected Routes

All business functionality routes are protected and require authentication. Access is further restricted by user roles.

#### Dashboard
- `/dashboard` - Main dashboard overview
  - **Access**: All authenticated users

#### Employee Management
- `/employees` - Employee list and search
  - **Access**: HR Manager, CEO
- `/employees/new` - Create new employee
  - **Access**: HR Manager, CEO
- `/employees/:id` - Employee profile view
  - **Access**: All users (with role-based data visibility)
- `/employees/:id/edit` - Edit employee details
  - **Access**: HR Manager, CEO

#### Project Management
- `/projects` - Project list and overview
  - **Access**: Team Lead, HR Manager, CEO
- `/projects/new` - Create new project
  - **Access**: Team Lead, HR Manager, CEO
- `/projects/:id` - Project details and management
  - **Access**: Team Lead, HR Manager, CEO
- `/projects/:id/edit` - Edit project information
  - **Access**: Team Lead, HR Manager, CEO

#### Client Management
- `/clients` - Client list and overview
  - **Access**: Team Lead, HR Manager, CEO
- `/clients/:id` - Client details and project history
  - **Access**: Team Lead, HR Manager, CEO

#### Invoice Management
- `/invoices` - Invoice list and status tracking
  - **Access**: Team Lead, HR Manager, CEO
- `/invoices/new` - Create new invoice
  - **Access**: Team Lead, HR Manager, CEO
- `/invoices/:id` - Invoice details and PDF generation
  - **Access**: Team Lead, HR Manager, CEO
- `/invoices/:id/edit` - Edit invoice information
  - **Access**: Team Lead, HR Manager, CEO

#### HR Policies
- `/hr-policies` - Policy document library
  - **Access**: All authenticated users
- `/hr-policies/new` - Create new policy document
  - **Access**: HR Manager, CEO
- `/hr-policies/:id` - Policy document viewer
  - **Access**: All authenticated users
- `/hr-policies/:id/edit` - Edit policy document
  - **Access**: HR Manager, CEO

#### Performance Evaluations
- `/evaluations` - Quarterly evaluation management
  - **Access**: HR Manager, CEO
- `/evaluations/new` - Create new evaluation
  - **Access**: HR Manager, CEO
- `/evaluations/:id` - Evaluation details and feedback
  - **Access**: HR Manager, CEO, Team Lead (limited), Employee (own evaluations)
- `/evaluations/:id/edit` - Edit evaluation
  - **Access**: HR Manager, CEO

#### Daily Evaluations
- `/evaluations/daily` - Daily feedback system
  - **Access**: All authenticated users
- `/evaluations/daily/new` - Submit daily evaluation
  - **Access**: All authenticated users
- `/evaluations/daily/:id` - Daily evaluation details
  - **Access**: Participants and managers

#### Financial Management
- `/loans` - Employee loan tracking
  - **Access**: HR Manager, CEO
- `/payroll` - Payroll processing and management
  - **Access**: HR Manager, CEO
- `/my-payslip` - Personal payslip access
  - **Access**: All employees

#### Administrative
- `/holidays` - Public holiday configuration
  - **Access**: HR Manager, CEO
- `/settings` - System settings and configuration
  - **Access**: CEO

## Route Protection Logic

### Authentication Guards

1. **Session Check**: Verify user is authenticated with Supabase
2. **Employee Data**: Ensure employee profile is loaded
3. **Password Mode**: Handle invite acceptance and password setting
4. **Role Authorization**: Check permissions using `canAccess()` function

### Authorization Rules

The `canAccess()` function in `src/lib/role-access.ts` implements role-based permissions:

#### CEO Permissions
- Full access to all routes and features
- Can modify system settings
- Can manage all employees and data

#### HR Manager Permissions
- Employee management (CRUD operations)
- Evaluation management
- Policy document management
- Payroll and financial operations
- Project and client management

#### Team Lead Permissions
- Project management within their scope
- Client relationship management
- Limited evaluation access (team members)
- Invoice management for their projects

#### Employee Permissions
- Personal profile access
- Own evaluation viewing
- Personal payslip access
- Limited project visibility
- HR policy reading

### Route Components

#### ProtectedRoute Wrapper
```typescript
<ProtectedRoute>
  <TargetComponent />
</ProtectedRoute>
```

Features:
- Authentication verification
- Role-based access control
- Automatic redirects for unauthorized access
- Loading states during auth checks

#### Root Redirect Logic
- Unauthenticated users → `/login`
- Authenticated users → `/dashboard`
- Password reset mode → `/set-password`

## Navigation Patterns

### Sidebar Navigation
- Role-based menu item visibility
- Active route highlighting
- Collapsible navigation
- Icon-based navigation

### Breadcrumb Navigation
- Contextual location display
- Clickable navigation path
- Consistent across detail pages

### Programmatic Navigation
- Form submission redirects
- Success/error state handling
- Authentication flow redirects

## URL Parameter Handling

### Dynamic Routes
- `:id` parameters for resource identification
- Type-safe parameter parsing
- Error handling for invalid IDs

### Query Parameters
- Search and filtering
- Pagination state
- Modal and dialog state

## Performance Considerations

### Code Splitting
- Route-based code splitting
- Lazy loading of page components
- Reduced initial bundle size

### Caching Strategy
- React Query for data caching
- Route-based cache invalidation
- Optimistic updates for better UX

### Loading States
- Skeleton components for data loading
- Spinner indicators for navigation
- Error boundaries for failed routes

This routing architecture ensures secure, role-appropriate access to HR management features while maintaining a smooth user experience.