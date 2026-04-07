<!--
generated_by: tessera
source_sha: c146e39c807c2d7590e3e1eb1fcb10f3b06bbef7
generated_at: 2026-04-07T11:17:15.541Z
action: create
-->

# Beudox HR - Routing Structure

## Route Overview

Beudox HR implements a comprehensive routing system using React Router DOM v6 with protected routes and role-based access control.

## Route Configuration

### Public Routes
- `/` - Root redirect (authenticated → dashboard, unauthenticated → login)
- `/login` - User authentication page
- `/forgot-password` - Password recovery page

### Protected Routes (Require Authentication)

#### Dashboard
- `/dashboard` - Main application dashboard

#### Employee Management
- `/employees` - Employee listing and search
- `/employees/new` - Create new employee
- `/employees/:id` - Employee profile view
- `/employees/:id/edit` - Edit employee details

#### Project Management
- `/projects` - Project listing
- `/projects/new` - Create new project
- `/projects/:id` - Project details and management
- `/projects/:id/edit` - Edit project information

#### Client Management
- `/clients` - Client listing
- `/clients/:id` - Client details and project history

#### Invoice Management
- `/invoices` - Invoice listing and status tracking
- `/invoices/new` - Create new invoice
- `/invoices/:id` - Invoice details and PDF view
- `/invoices/:id/edit` - Edit invoice information

#### HR Policies
- `/hr-policies` - Policy document listing
- `/hr-policies/new` - Create new policy document
- `/hr-policies/:id` - Policy document view
- `/hr-policies/:id/edit` - Edit policy document

#### Evaluations
- `/evaluations` - Quarterly evaluation listing
- `/evaluations/new` - Create new quarterly evaluation
- `/evaluations/:id` - Evaluation details and feedback
- `/evaluations/:id/edit` - Edit evaluation
- `/evaluations/daily` - Daily evaluation listing
- `/evaluations/daily/new` - Create new daily evaluation
- `/evaluations/daily/:id` - Daily evaluation details

#### Organizational
- `/holidays` - Public holiday management
- `/settings` - Application settings and configuration

#### Error Handling
- `*` - 404 Not Found page

## Route Protection

### Authentication Guards
All routes except login and password recovery are wrapped with `ProtectedRoute` component that:
1. Checks for active authentication session
2. Redirects to login if not authenticated
3. Handles password reset flow for new users
4. Shows loading spinner during authentication checks

### Authorization Guards
Protected routes implement role-based access control:
- Routes check user permissions using `canAccess()` utility
- Unauthorized users are redirected to dashboard
- Role hierarchy: employee < team_lead < hr_manager < ceo

## Layout Integration

### AppLayout Wrapper
Authenticated routes are wrapped with `AppLayout` component providing:
- Collapsible sidebar navigation
- Top bar with user menu
- Responsive main content area
- Maximum width container (1280px)

### Navigation Structure
Sidebar navigation dynamically shows available routes based on user role:
- **All Users**: Dashboard, Profile
- **Team Leads+**: Team member evaluations
- **HR Managers+**: Full employee management, settings
- **CEOs**: Complete system access

## Route Parameters

### Dynamic Routes
- `:id` parameters for entity-specific pages (employees, projects, etc.)
- Automatic parameter validation and error handling
- Loading states for parameter-dependent data fetching

### Query Parameters
- Search and filtering parameters
- Pagination controls
- Modal state management

## Navigation Patterns

### Programmatic Navigation
- `useNavigate` hook for imperative navigation
- Automatic redirects after form submissions
- Back navigation with proper state preservation

### Link Components
- `NavLink` component with active state styling
- Proper accessibility attributes
- Keyboard navigation support

### Breadcrumb Navigation
- Hierarchical navigation indicators
- Context-aware breadcrumb generation
- Mobile-responsive breadcrumb display

## Performance Optimizations

### Code Splitting
- Route-based code splitting with React.lazy
- Component preloading for critical routes
- Bundle size optimization

### Data Prefetching
- React Query prefetching for linked routes
- Background data loading
- Cache management for route transitions

### Loading States
- Skeleton components for initial loads
- Progressive loading for complex pages
- Error boundaries for route failures

## Development Considerations

### Route Testing
- Playwright E2E tests for critical user journeys
- Route protection testing
- Navigation flow validation

### Route Debugging
- Development tools for route inspection
- Navigation logging in development mode
- Route change tracking

This routing structure provides a scalable, secure, and user-friendly navigation system that adapts to different user roles and permissions while maintaining good performance and developer experience.