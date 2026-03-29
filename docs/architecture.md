<!--
generated_by: tessera
source_sha: 1912bab0ad21101787bdfbc9b42a058207c7862c
generated_at: 2026-03-29T23:20:01.841Z
action: create
-->

# Architecture Documentation

## Routing Structure

The application uses React Router DOM for client-side routing with the following structure:

### Public Routes
- `/` - Root redirect (to dashboard if authenticated, login if not)
- `/login` - User authentication
- `/forgot-password` - Password recovery

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard overview
- `/employees` - Employee list and management
  - `/employees/new` - Add new employee form
  - `/employees/:id` - View employee profile
  - `/employees/:id/edit` - Edit employee form

### Future Routes (Based on Navigation)
The sidebar navigation indicates planned routes for:
- `/attendance` - Attendance tracking
- `/holidays` - Public holidays management
- `/leave` - Leave management
- `/payroll` - Payroll processing
- `/finance` - Financial reporting
- `/loans` - Loan management
- `/expenses` - Office expenses
- `/outsourcing` - Outsourcing management
- `/projects` - Project management
- `/evaluations` - Employee evaluations
- `/hr-policies` - HR policies
- `/notifications` - Notification system
- `/settings` - System settings

## Core Components

### Layout Components

#### AppLayout
- Main application wrapper
- Provides consistent layout structure
- Includes sidebar and topbar
- Manages responsive behavior

#### AppSidebar
- Collapsible navigation sidebar
- Role-based menu filtering
- Organized into sections: MAIN, PEOPLE, FINANCE, WORK, SYSTEM
- Custom purple theme (#1A1240)
- Shows user information and sign-out option

#### TopBar
- Application header
- Displays current page title
- Dynamic title based on route
- Consistent styling with card background

### UI Components

#### BeudoxLogo
- Custom logo component
- Supports multiple variants: default, sidebar
- Configurable size and wordmark display
- Uses SVG assets from `/assets/`

#### NavLink
- Enhanced React Router NavLink
- Supports active and pending class names
- Consistent styling integration

### Component Library
The application uses shadcn/ui components including:
- Form controls (Button, Input, Select, etc.)
- Layout components (Card, Sheet, Dialog, etc.)
- Data display (Table, Chart, etc.)
- Feedback (Toast, Alert, etc.)
- Navigation (Tabs, Breadcrumb, etc.)

## State Management

### Authentication State
- Managed by `useAuth` hook
- Tracks session, loading state, and employee data
- Handles password recovery and invite flows

### Server State
- React Query for API data management
- Automatic caching and background updates
- Optimistic updates for better UX

### UI State
- Local component state for UI interactions
- Sidebar collapse state
- Form state management

## Data Flow

1. **User Authentication**
   - Login form → Supabase auth
   - Session created → Employee data fetched
   - Route protection applied

2. **Page Navigation**
   - Route change → Access check
   - Authorized → Render protected content
   - Unauthorized → Redirect to dashboard

3. **Data Operations**
   - Component → React Query → Supabase API
   - Response cached and UI updated
   - Error handling and loading states

## Security

### Route Protection
- `ProtectedRoute` component wraps sensitive routes
- Checks authentication and role permissions
- Automatic redirects for unauthorized access

### Role-Based Access
- `canAccess` utility function
- Permission checks based on user role
- Navigation items filtered by permissions

### Authentication
- Supabase handles secure authentication
- JWT tokens for API access
- Password recovery and invite flows

## Responsive Design

- **Mobile-First**: Tailwind CSS breakpoints
- **Sidebar**: Collapsible on smaller screens
- **Layout**: Flexible grid system
- **Components**: Responsive variants available

## Performance Considerations

- **Code Splitting**: Vite handles automatic splitting
- **Lazy Loading**: Route-based code splitting
- **Caching**: React Query for API response caching
- **Bundle Optimization**: Tree shaking and minification

## Extensibility

The architecture is designed for easy extension:
- **Modular Components**: Easy to add new UI components
- **Route Structure**: Simple to add new protected routes
- **Navigation**: Sidebar supports additional menu items
- **API Integration**: Supabase client handles new endpoints
- **Role System**: Permission-based access control ready for new roles