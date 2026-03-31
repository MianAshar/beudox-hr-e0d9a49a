<!--
generated_by: tessera
source_sha: b539e0ef426dc79227432acc6263ba638f91abbe
generated_at: 2026-03-31T22:18:34.119Z
action: create
-->

# Architecture Documentation

## Application Structure

### Routing Architecture

The application uses React Router for client-side routing with the following structure:

#### Public Routes
- `/` - Root redirect (authenticated → dashboard, unauthenticated → login)
- `/login` - Authentication page
- `/forgot-password` - Password recovery

#### Protected Routes (Role-Based Access)
All protected routes require authentication and are filtered by user role permissions:

- `/dashboard` - Main dashboard (all roles)
- `/employees` - Employee list (HR Manager, Finance Manager, CEO)
- `/employees/new` - Add employee (HR Manager, CEO)
- `/employees/:id` - Employee profile (HR Manager, Finance Manager, CEO)
- `/employees/:id/edit` - Edit employee (HR Manager, CEO)
- `/attendance` - Attendance tracking (HR Manager, Finance Manager, Team Lead, Employee, CEO)
- `/holidays` - Public holidays (HR Manager, CEO)
- `/leave` - Leave management (HR Manager, CEO)
- `/payroll` - Payroll processing (Finance Manager, CEO)
- `/finance` - Financial reports (Finance Manager, CEO)
- `/loans` - Loan management (Finance Manager, CEO)
- `/expenses` - Office expenses (Finance Manager, CEO)
- `/outsourcing` - Outsourcing records (Finance Manager, CEO)
- `/projects` - Project management (HR Manager, Team Lead, Employee, CEO)
- `/evaluations` - Performance evaluations (HR Manager, Team Lead, CEO)
- `/hr-policies` - HR documents (HR Manager, CEO)
- `/notifications` - Notifications (all roles)
- `/settings` - Settings (HR Manager, CEO)

### Component Architecture

#### Layout Components
- **AppLayout**: Main application wrapper providing consistent layout structure
- **AppSidebar**: Collapsible navigation sidebar with role-filtered menu sections
- **TopBar**: Header component displaying current page title

#### Core Components
- **BeudoxLogo**: Brand logo component with variant support (default/sidebar)
- **NavLink**: Custom navigation link with active state styling

#### UI Component Library
The application uses shadcn/ui, a comprehensive component library built on Radix UI primitives, including:
- Form controls (Button, Input, Select, etc.)
- Layout components (Card, Sheet, Dialog, etc.)
- Data display (Table, Chart, etc.)
- Feedback components (Toast, Alert, etc.)
- Navigation (Tabs, Accordion, etc.)

### State Management

#### Authentication State
- Managed via React Context (`useAuth` hook)
- Persisted session with Supabase Auth
- Automatic token refresh
- Role-based permissions

#### Server State
- React Query for API data fetching and caching
- Optimistic updates for better UX
- Background refetching for data freshness
- Error handling and retry logic

#### Form State
- React Hook Form for complex form management
- Zod schemas for validation
- Integration with shadcn/ui form components

### Database Architecture

#### Multi-Tenant Design
- All business data scoped to `company_id`
- Company-specific settings and configurations
- Feature flags per company

#### Core Entities
- **companies**: Tenant management
- **employees**: User profiles and employment data
- **attendance_records**: Time tracking
- **payroll_records**: Salary calculations
- **projects**: Project management
- **leave_requests**: Leave workflow
- **evaluations**: Performance management

#### Key Relationships
- Employees central to most operations
- Projects link clients, employees, and financials
- Audit trails with user tracking
- Approval workflows for sensitive operations

### Security Architecture

#### Authentication
- Supabase Auth with JWT tokens
- Email/password and magic link authentication
- Session persistence and automatic refresh

#### Authorization
- Role-based access control (RBAC)
- Centralized permission checking (`canAccess` function)
- Route-level protection
- Database row-level security (RLS)

#### Data Protection
- Input validation with Zod schemas
- XSS prevention via React
- CSRF protection via Supabase
- Secure environment variable handling

### Performance Considerations

#### Build Optimization
- Vite with SWC for fast builds
- Code splitting by routes
- Tree shaking and minification
- Asset optimization

#### Runtime Performance
- React Query caching strategies
- Lazy loading for components
- Optimized re-renders
- Bundle size monitoring

#### Database Performance
- Proper indexing on foreign keys
- Efficient queries with Supabase
- Pagination for large datasets
- Background processing for heavy operations