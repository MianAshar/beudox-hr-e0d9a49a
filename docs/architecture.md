<!--
generated_by: tessera
source_sha: 38926575f05423a02dbd6595514277fe24903388
generated_at: 2026-04-27T23:15:14.902Z
action: create
-->

# Architecture Documentation

## Application Structure

### Routing Structure

The application uses React Router for client-side routing. The main routes are organized around feature areas:

- `/` - Dashboard/Home page (`src/pages/Index.tsx`)
- `/dashboard` - Main dashboard (redirect after login)
- `/attendance` - Attendance management
- `/leave` - Leave requests and balances
- `/payroll` - Payroll processing and history
- `/employees` - Employee directory and profiles
- `/evaluations` - Performance reviews
- `/projects` - Project management
- `/settings` - Administrative settings
- `/job-descriptions` - Job description management

### Component Hierarchy

#### Layout Components
- `AppLayout`: Root layout wrapper
  - `AppSidebar`: Navigation sidebar
  - `TopBar`: Header with user actions
  - `UserMenu`: User dropdown menu
  - `NotificationBell`: Notification indicator

#### Feature Components

**Attendance**
- `AttendanceUploadFlow`: Multi-step file upload wizard
- `AttendanceTab`: Employee attendance history

**Leave Management**
- `ApplyLeaveModal`: Leave request form
- `LeaveBalancesTab`: Current leave balances
- `AllRequestsTab`: Approval queue for managers
- `MyRequestsTab`: Personal leave history

**Employee Profiles**
- `AttendanceTab`: Personal attendance records
- `LeaveTab`: Leave history and balances
- `PayrollTab`: Salary information
- `DocumentsTab`: Document management
- `SalaryHistoryTab`: Salary progression
- `SalaryReviewTab`: Performance reviews
- `PendingIncrementCard`: Increment proposals
- `ProposeIncrementModal`: Increment proposal form
- `ReviewScheduleSection`: Review scheduling

**Settings**
- `CompanyTab`: Company information
- `DepartmentsTab`: Department management
- `RolesTab`: Role configuration
- `LeaveTypesTab`: Leave policy setup
- `AttendanceTab`: Attendance rules
- `EvaluationParametersTab`: Review criteria
- `ExpenseCategoriesTab`: Expense tracking
- `ProjectCategoriesTab`: Project classification
- `LoginLogsTab`: Security audit logs
- `DangerZoneTab`: Critical operations

#### UI Components

The application uses a comprehensive UI component library with consistent patterns:

**Form Components**
- `Button`: Action buttons with variants
- `Input`: Text input fields
- `Select`: Dropdown selections
- `Textarea`: Multi-line text input
- `Checkbox`: Boolean selections
- `RadioGroup`: Single selections
- `Switch`: Toggle switches

**Layout Components**
- `Card`: Content containers
- `Dialog`: Modal dialogs
- `Sheet`: Slide-out panels
- `Tabs`: Tabbed interfaces
- `Accordion`: Collapsible sections
- `Table`: Data tables with sorting

**Feedback Components**
- `Alert`: Status messages
- `Toast`: Temporary notifications
- `Badge`: Status indicators
- `Progress`: Loading indicators
- `Skeleton`: Loading placeholders

**Navigation Components**
- `Breadcrumb`: Navigation hierarchy
- `Pagination`: Data pagination
- `Command`: Search interfaces

## Data Flow

### Authentication Flow
1. User authentication via Supabase Auth
2. Mandatory password change for new users (`MandatoryPasswordChange`)
3. User profile and permissions loaded
4. Application routes and UI components rendered based on roles

### CRUD Operations
1. Components use Supabase client for direct database access
2. Optimistic updates for better UX
3. Error handling with user feedback
4. Real-time subscriptions for live data

### File Processing
1. File upload (Excel/CSV) via `AttendanceUploadFlow`
2. Client-side conversion to CSV using SheetJS
3. Server-side AI parsing via Supabase Edge Function
4. Data validation and preview
5. Batch database operations

## State Management

### Local Component State
- Form inputs and validation
- UI interaction states (open/closed modals, active tabs)
- Loading and error states

### Global Application State
- User authentication and profile (via `useAuth` hook)
- Theme and branding settings
- Notification preferences

### Server State
- Database records via Supabase
- Real-time subscriptions for live updates
- Cached data for performance

## Security Architecture

### Authentication
- Supabase Auth for user management
- JWT tokens for API access
- Session management with automatic refresh

### Authorization
- Role-based access control (`canAccess`, `hasRole` functions)
- Database row-level security policies
- UI-level permission checks

### Data Protection
- Encrypted data transmission (HTTPS)
- Secure file upload handling
- Audit logging for sensitive operations

## Performance Optimizations

### Build Optimizations
- Vite for fast development and optimized production builds
- Code splitting by routes
- Tree shaking for unused code removal

### Runtime Optimizations
- Lazy loading for heavy components
- Virtual scrolling for large lists
- Image optimization and lazy loading
- Caching strategies for API calls

### Database Optimizations
- Indexed queries for fast data retrieval
- Efficient batch operations for bulk imports
- Real-time subscriptions for targeted updates

## Development Architecture

### Build Pipeline
- TypeScript compilation with strict type checking
- ESLint for code quality
- Tailwind CSS processing
- Asset optimization and bundling

### Testing Strategy
- Unit tests with Vitest
- Component testing for UI logic
- E2E testing with Playwright
- API testing for Edge Functions

### Deployment Architecture
- Static site generation for frontend
- CDN distribution for assets
- Server-side functions for dynamic operations
- Database migrations for schema updates