<!--
generated_by: tessera
source_sha: c654fd2968a904bbbba2819fed2fab547b920d59
generated_at: 2026-04-28T22:13:43.871Z
action: create
-->

# Architecture Documentation: Beudox HR Portal

## Application Structure

The Beudox HR Portal is built as a single-page React application with a modular component architecture. The application follows modern React patterns with TypeScript for type safety and Vite for fast development and building.

## Routing Structure

The application uses React Router for client-side routing. Based on the codebase analysis:

### Main Routes
- `/` (Index): Main dashboard/home page (`src/pages/Index.tsx`)
- `/job-description-detail`: Job description detail view
- `/job-descriptions`: Job descriptions list
- Additional routes likely defined in the main App component

### Route Organization
- Page components are located in `src/pages/`
- Each page serves as a top-level route component
- Navigation is handled through the AppLayout component

## Core Components

### Layout Components

#### AppLayout (`src/components/layout/AppLayout.tsx`)
Main application wrapper providing consistent layout structure across all pages.

#### AppSidebar (`src/components/layout/AppSidebar.tsx`)
Navigation sidebar containing main menu items and user-specific navigation options.

#### TopBar (`src/components/layout/TopBar.tsx`)
Top navigation bar with user menu, notifications, and global actions.

#### NotificationBell (`src/components/layout/NotificationBell.tsx`)
Notification dropdown and management component.

#### UserMenu (`src/components/layout/UserMenu.tsx`)
User profile dropdown with account settings and logout functionality.

### Feature Components

#### Employee Profile System
A comprehensive tab-based system for managing employee information:

- **AttendanceTab**: Employee attendance history and records
- **DocumentsTab**: Document management and storage
- **LeaveTab**: Leave history and balance tracking
- **PayrollTab**: Payroll information and history
- **PendingIncrementCard**: Salary increment proposals
- **ProposeIncrementModal**: Modal for proposing salary changes
- **ReviewScheduleSection**: Salary review scheduling
- **SalaryHistoryTab**: Historical salary information
- **SalaryReviewTab**: Salary review management

#### Attendance Management
- **AttendanceUploadFlow**: Complex multi-step process for uploading and parsing attendance files from biometric systems

#### Leave Management
- **AllRequestsTab**: View all leave requests (admin/HR view)
- **ApplyLeaveModal**: Modal for submitting leave applications
- **LeaveBalancesTab**: Personal leave balance tracking
- **MyRequestsTab**: Personal leave request history

#### Payroll System
- **PayrollSummary**: Payroll data overview and summaries

#### Project Management
- **ManageTeamModal**: Team assignment and management
- **ProjectActivityLog**: Activity tracking and logging
- **ProjectTasksSection**: Task management within projects

#### Finance & HR
- **FinanceSummary**: Financial data overview
- **RichTextEditor**: Policy document creation and editing

#### Settings & Administration
Comprehensive settings panels for system configuration:
- **AttendanceTab**: Attendance system settings
- **CompanyTab**: Company information management
- **DangerZoneTab**: Critical system operations
- **DepartmentsTab**: Department management
- **EvaluationParametersTab**: Performance evaluation settings
- **ExpenseCategoriesTab**: Expense categorization
- **LeaveTypesTab**: Leave type configuration
- **LoginLogsTab**: User login tracking
- **ProjectCategoriesTab**: Project categorization
- **RolesTab**: User role management

### UI Components

The application uses a complete shadcn/ui component library with custom extensions:

#### Base UI Components
- Form controls: Button, Input, Select, Textarea, Checkbox, Radio Group
- Layout: Card, Dialog, Sheet, Tabs, Accordion
- Data display: Table, Badge, Avatar, Progress
- Navigation: Breadcrumb, Pagination, Navigation Menu
- Feedback: Alert, Toast, Skeleton, Spinner
- Advanced: Calendar, Chart, Carousel, Command (searchable command palette)

#### Custom Components
- **BeudoxLogo**: Multi-variant logo component with default and sidebar variants
- **NavLink**: Enhanced React Router NavLink with active state styling
- **SearchableEmployeeSelect**: Advanced employee selection with search and filtering
- **MandatoryPasswordChange**: Secure password reset modal with validation

## Data Flow Architecture

### State Management
- **Local State**: React hooks (useState, useReducer) for component-level state
- **Context**: React Context for shared state (authentication, user preferences)
- **Server State**: Direct Supabase integration for persistent data

### Authentication Flow
- Supabase Auth integration
- Custom authentication hooks (`useAuth`)
- Mandatory password change for new users
- Role-based access control

### Data Fetching
- Direct Supabase client queries
- Real-time subscriptions for live updates
- Edge functions for complex business logic
- Optimistic updates for better UX

## Business Logic Modules

### Utility Libraries (`src/lib/`)
- **attendance-format.ts**: Time formatting and display utilities
- **client-activity.ts**: Activity logging and categorization
- **format-date.ts**: Date formatting functions
- **format-role.ts**: Role display formatting
- **leave-utils.ts**: Leave balance calculations
- **login-tracking.ts**: User login monitoring
- **notifications.ts**: Notification system utilities
- **review-alerts.ts**: Salary review notifications
- **review-schedule.ts**: Review scheduling logic
- **role-access.ts**: Permission and access control
- **utils.ts**: General utility functions (class name merging)

### Custom Hooks (`src/hooks/`)
- **useAuth.ts**: Authentication state management
- **useSort.ts**: Table sorting functionality
- **useToast.ts**: Toast notification system

## Configuration and Build

### Build Configuration
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Strict type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization

### Testing Configuration
- **Vitest**: Fast unit testing framework
- **Playwright**: End-to-end testing for critical user flows

### Environment Configuration
- Supabase project settings
- API keys and service URLs
- Build-time environment variables

## Performance Considerations

- **Component Optimization**: React.memo for expensive re-renders
- **Bundle Splitting**: Code splitting for route-based loading
- **Image Optimization**: Proper asset handling and optimization
- **Database Queries**: Efficient Supabase queries with proper indexing
- **Real-time Updates**: Selective subscriptions to prevent unnecessary re-renders

## Security Architecture

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Role-based access control system
- **Data Validation**: TypeScript types and runtime validation
- **Secure Communications**: HTTPS-only with Supabase
- **Password Policies**: Mandatory strong passwords with validation

This architecture provides a scalable, maintainable foundation for a comprehensive HR management system with modern React patterns and robust business logic implementation.