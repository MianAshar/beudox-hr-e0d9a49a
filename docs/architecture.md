<!--
generated_by: tessera
source_sha: 9a9598c271fbdd5799e93c44d78e3b84c67feb16
generated_at: 2026-03-29T23:38:44.978Z
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

### Future Routes (Based on Sidebar Navigation)
The sidebar includes navigation items for features not yet implemented:
- `/attendance` - Attendance tracking
- `/holidays` - Public holidays management
- `/leave` - Leave management
- `/payroll` - Payroll processing
- `/finance` - Financial reports
- `/loans` - Employee loans
- `/expenses` - Office expenses
- `/outsourcing` - Outsourcing management
- `/projects` - Project management
- `/evaluations` - Employee evaluations
- `/hr-policies` - HR policy documents
- `/notifications` - System notifications
- `/settings` - Application settings

## Core Components

### Layout Components
- **AppLayout**: Main application layout wrapper that includes sidebar and topbar
- **AppSidebar**: Collapsible navigation sidebar with role-based menu visibility
- **TopBar**: Header component displaying current page title

### UI Component Library
The application uses shadcn/ui components built on Radix UI primitives:
- Form components (Input, Select, Checkbox, etc.)
- Feedback components (Toast, Alert, Dialog)
- Layout components (Card, Tabs, Accordion)
- Navigation components (Navigation Menu, Breadcrumb)
- Data display (Table, Chart, Progress)

### Custom Components
- **BeudoxLogo**: Logo component with variant support (default/sidebar) and size options
- **NavLink**: Enhanced React Router NavLink with active state styling

## Authentication Flow

1. **Login Process**: Users authenticate via Supabase Auth
2. **Password Setup**: New users or password resets go through setup flow
3. **Role Assignment**: Employee data includes role information for access control
4. **Protected Routes**: All business routes check authentication and role permissions
5. **Auto Redirect**: Unauthorized access redirects to appropriate pages

## Data Flow

### State Management
- **Authentication State**: Managed via AuthProvider context
- **Server State**: Handled by React Query for caching and synchronization
- **UI State**: Local component state for forms and interactions

### API Integration
- **Supabase Client**: Centralized client for all Supabase operations
- **React Query**: Manages data fetching, caching, and mutations
- **Error Handling**: Proper error states and user feedback

## Role-Based Access Control

The application implements role-based permissions:
- Menu items in the sidebar are conditionally rendered based on user role
- Route access is protected at the component level
- Unauthorized users are redirected to the dashboard

## Responsive Design

- **Mobile-First**: Tailwind CSS responsive utilities
- **Collapsible Sidebar**: Adapts to different screen sizes
- **Flexible Layout**: Main content area adjusts based on sidebar state
- **Touch-Friendly**: Appropriate sizing for mobile interactions