<!--
generated_by: tessera
source_sha: 8e11b5d7fe7d65cb4672bc4879a4a7d4c01dc9e0
generated_at: 2026-04-07T22:34:23.180Z
action: create
-->

# Beudox HR - Routing Structure

## Overview

Beudox HR uses React Router DOM v6 for client-side routing with a comprehensive route structure that supports role-based access control and protected routes.

## Route Architecture

### Router Setup
- **Base Router**: `BrowserRouter` in `src/App.tsx`
- **Route Protection**: `ProtectedRoute` component wraps authenticated routes
- **Authentication Handling**: `AuthProvider` manages auth state
- **Role-Based Access**: `canAccess` utility for permission checks

### Route Categories

#### Public Routes (No Authentication Required)
```typescript
/
/login
/forgot-password
```

#### Protected Routes (Authentication Required)
All routes under authentication require valid session and appropriate role permissions.

### Core Application Routes

#### Dashboard
- **Path**: `/dashboard`
- **Access**: All authenticated users
- **Purpose**: Main application dashboard with overview widgets

#### Employee Management
- **List**: `/employees`
- **Create**: `/employees/new`
- **Profile**: `/employees/:id`
- **Edit**: `/employees/:id/edit`
- **Access**: HR Manager, CEO (full access); Team Lead, Employee (limited)

#### Project Management
- **List**: `/projects`
- **Create**: `/projects/new`
- **Detail**: `/projects/:id`
- **Edit**: `/projects/:id/edit`
- **Access**: All authenticated users with project-specific permissions

#### Client Management
- **List**: `/clients`
- **Detail**: `/clients/:id`
- **Access**: HR Manager, CEO

#### Invoice Management
- **List**: `/invoices`
- **Create**: `/invoices/new`
- **Detail**: `/invoices/:id`
- **Edit**: `/invoices/:id/edit`
- **Access**: HR Manager, CEO

#### HR Policies
- **List**: `/hr-policies`
- **Create**: `/hr-policies/new`
- **Detail**: `/hr-policies/:id`
- **Edit**: `/hr-policies/:id/edit`
- **Access**: HR Manager, CEO

#### Evaluations
- **Quarterly List**: `/evaluations`
- **Quarterly Create**: `/evaluations/new`
- **Quarterly Detail**: `/evaluations/:id`
- **Quarterly Edit**: `/evaluations/:id/edit`
- **Daily List**: `/evaluations/daily`
- **Daily Create**: `/evaluations/daily/new`
- **Daily Detail**: `/evaluations/daily/:id`
- **Access**: Role-based visibility (managers see more than employees)

#### Loans
- **List**: `/loans`
- **Access**: HR Manager, CEO

#### Payroll
- **Management**: `/payroll`
- **My Payslip**: `/my-payslip`
- **Access**: HR Manager, CEO (management); All users (own payslip)

#### Finance
- **Dashboard**: `/finance`
- **Access**: HR Manager, CEO

#### Settings
- **Main**: `/settings`
- **Access**: HR Manager, CEO

#### Holidays
- **Management**: `/holidays`
- **Access**: HR Manager, CEO

## Route Protection Logic

### ProtectedRoute Component
```typescript
const ProtectedRoute = ({ children }) => {
  const { session, loading, passwordMode, employee } = useAuth();
  
  // 1. Show loading spinner during auth check
  if (loading || (session && !employee)) {
    return <LoadingSpinner />;
  }
  
  // 2. Handle password setup for new invites
  if (session && passwordMode) {
    return <SetPassword />;
  }
  
  // 3. Redirect to login if not authenticated
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  // 4. Check role-based access
  if (!canAccess(employee?.role_name, location.pathname)) {
    return <Navigate to="/dashboard" />;
  }
  
  // 5. Render protected content
  return <AppLayout>{children}</AppLayout>;
};
```

### Role-Based Access Control

#### Permission Levels
- **CEO**: Full system access
- **HR Manager**: HR operations, employee management, settings
- **Team Lead**: Team management, evaluations for team members
- **Employee**: Personal data, limited evaluations, own payslip

#### canAccess Function
```typescript
// src/lib/role-access.ts
export const canAccess = (role: string, path: string): boolean => {
  const roleHierarchy = {
    'ceo': 4,
    'hr_manager': 3,
    'team_lead': 2,
    'employee': 1,
  };
  
  const userLevel = roleHierarchy[role] || 0;
  const requiredLevel = getRequiredLevel(path);
  
  return userLevel >= requiredLevel;
};
```

## Navigation Structure

### Sidebar Navigation
The sidebar dynamically shows menu items based on user role:

```typescript
// CEO & HR Manager see all items
const fullMenu = [
  'Dashboard',
  'Employees',
  'Projects',
  'Clients',
  'Invoices',
  'HR Policies',
  'Evaluations',
  'Loans',
  'Payroll',
  'Finance',
  'Settings',
  'Holidays',
];

// Team Lead sees limited items
const teamLeadMenu = [
  'Dashboard',
  'Employees',
  'Evaluations',
  'My Payslip',
];

// Employee sees minimal items
const employeeMenu = [
  'Dashboard',
  'My Profile',
  'Evaluations',
  'My Payslip',
];
```

### Breadcrumb Navigation
- Automatic breadcrumb generation based on route
- Context-aware navigation links
- Mobile-responsive breadcrumb display

## Route Components

### Page Organization
Each route corresponds to a page component in `src/pages/`:

```
src/pages/
├── Login.tsx
├── Dashboard.tsx
├── Employees.tsx
├── EmployeeProfile.tsx
├── EmployeeForm.tsx
├── Projects.tsx
├── ProjectForm.tsx
├── ProjectDetail.tsx
├── Clients.tsx
├── ClientDetail.tsx
├── Invoices.tsx
├── InvoiceForm.tsx
├── InvoiceDetail.tsx
├── HrPolicies.tsx
├── HrPolicyForm.tsx
├── HrPolicyDetail.tsx
├── Evaluations.tsx
├── EvaluationForm.tsx
├── EvaluationDetail.tsx
├── DailyEvaluations.tsx
├── DailyEvaluationForm.tsx
├── DailyEvaluationDetail.tsx
├── Loans.tsx
├── Payroll.tsx
├── MyPayslip.tsx
├── FinanceSheet.tsx
├── Settings.tsx
├── PublicHolidays.tsx
└── NotFound.tsx
```

### Component Patterns

#### List Pages
- Data fetching with React Query
- Search and filtering capabilities
- Pagination for large datasets
- Create new item actions

#### Form Pages
- React Hook Form with Zod validation
- Create vs Edit modes
- Success/error handling
- Navigation after submission

#### Detail Pages
- Data fetching for specific item
- Edit/delete actions (role-based)
- Related data display
- Breadcrumb navigation

## URL Patterns

### RESTful URL Structure
- **List**: `/resource` (e.g., `/employees`)
- **Create**: `/resource/new` (e.g., `/employees/new`)
- **Detail**: `/resource/:id` (e.g., `/employees/123`)
- **Edit**: `/resource/:id/edit` (e.g., `/employees/123/edit`)

### Special Routes
- **Daily Evaluations**: `/evaluations/daily` (nested under evaluations)
- **My Payslip**: `/my-payslip` (personal route)
- **Settings**: `/settings` (single page with tabs)

## Route Guards and Redirects

### Authentication Redirects
- Unauthenticated users → `/login`
- Authenticated users on `/` → `/dashboard`
- Insufficient permissions → `/dashboard`

### Password Setup Flow
- New user invites trigger password setup
- Intercepts navigation until password is set
- Redirects to intended destination after completion

## Performance Considerations

### Code Splitting
- Route-based lazy loading for page components
- Reduces initial bundle size
- Faster application startup

### Preloading
- Critical route preloading
- Data prefetching for likely navigation paths

## Testing Route Behavior

### Route Testing
- Authentication state testing
- Role-based access testing
- Navigation flow testing
- Error state handling

### Integration Testing
- End-to-end user journey testing
- Form submission and navigation
- Permission boundary testing

This routing structure provides a secure, scalable foundation for the HR management system with clear separation of concerns and comprehensive access control.