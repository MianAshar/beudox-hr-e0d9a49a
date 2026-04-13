<!--
generated_by: tessera
source_sha: 46dfb6ac3a974a552a857eb52d0e4225e2601dd1
generated_at: 2026-04-13T10:29:40.143Z
action: create
-->

# Architecture Documentation

## Application Structure

Beudox HR is built as a single-page application with a clear separation of concerns and modular architecture.

### Routing Structure

The application uses React Router DOM for client-side routing. Based on the component analysis, the routing structure includes:

#### Main Routes
- `/` - Dashboard/Home page
- `/employees` - Employee directory and management
- `/leave` - Leave management (requests, balances, approvals)
- `/evaluations` - Performance evaluations
  - `/evaluations/:id` - Individual quarterly evaluation details
  - `/evaluations/daily` - Daily evaluations list
  - `/evaluations/daily/:id` - Individual daily evaluation details
- `/settings` - System configuration
  - Departments, roles, leave types, expense categories, notifications
- `/hr-policies` - Company policy management

#### Layout Components
- **AppLayout**: Main application wrapper providing consistent layout
- **AppSidebar**: Navigation sidebar with role-based menu visibility
- **TopBar**: Header with logo, notifications, and user menu
- **NotificationBell**: Real-time notification indicator

### Core Components

#### Shared Components
- **BeudoxLogo**: Brand logo with multiple display variants (default, sidebar, with/without wordmark)
- **NavLink**: Enhanced navigation link with active state styling
- **SearchableEmployeeSelect**: Advanced employee selection with search, avatars, and filtering

#### Feature Components

##### Leave Management
- **ApplyLeaveModal**: Leave request form
- **LeaveBalancesTab**: Display of available leave balances
- **MyRequestsTab**: User's leave request history
- **AllRequestsTab**: HR view of all leave requests (approval interface)

##### Evaluations
- **EvaluationTimeline**: Unified timeline of quarterly and daily evaluations
  - Shows evaluation history with scores, comments, and participants
  - Role-based visibility (managers see recommendations, employees see limited data)
  - Links to detailed evaluation views

##### Settings
- **CompanyTab**: Company information configuration
- **DepartmentsTab**: Department management
- **RolesTab**: User role configuration
- **LeaveTypesTab**: Leave type definitions
- **EvaluationParametersTab**: Evaluation criteria setup
- **ExpenseCategoriesTab**: Expense category management
- **AttendanceTab**: Attendance tracking configuration
- **NotificationsTab**: Notification preferences
- **DangerZoneTab**: Critical system settings

##### HR Policies
- **RichTextEditor**: WYSIWYG editor for policy documents
  - Supports formatting (bold, italic, underline, headings, lists)
  - Link insertion and management
  - HTML output for storage and display

### Data Flow Patterns

#### State Management
- **Server State**: TanStack Query for API data fetching, caching, and synchronization
- **Local State**: React hooks for component-specific state
- **Global State**: Context providers for authentication and user preferences

#### Authentication Flow
- Supabase Auth handles login/logout
- `useAuth` hook provides user context throughout the app
- Role-based rendering and API calls

#### API Integration
- Supabase client for database operations
- Real-time subscriptions for live updates
- Edge Functions for complex business logic

### Component Communication

#### Props Interface
Components use well-defined TypeScript interfaces:
```typescript
interface SearchableEmployeeSelectProps {
  employees: EmployeeOption[];
  value: string;
  onValueChange: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowAll?: boolean;
  allLabel?: string;
}
```

#### Event Handling
- Callback props for parent-child communication
- Custom hooks for shared logic
- Context providers for cross-component state

### UI/UX Patterns

#### Design System
- **shadcn/ui**: Consistent component library
- **Tailwind CSS**: Utility-first styling
- **Custom Properties**: CSS variables for theming
- **Responsive Design**: Mobile-first approach

#### Interaction Patterns
- **Searchable Selects**: Consistent employee selection across features
- **Modal Dialogs**: Form submissions and confirmations
- **Toast Notifications**: User feedback for actions
- **Loading States**: Skeleton components during data fetching
- **Empty States**: Helpful messages when no data exists

### Performance Considerations

#### Code Splitting
- Route-based lazy loading
- Component imports optimized with Vite

#### Data Fetching
- Query caching with TanStack Query
- Optimistic updates for better UX
- Background refetching for data freshness

#### Rendering Optimization
- Memoization of expensive computations
- Virtual scrolling for large lists (potential future enhancement)
- Image optimization with proper sizing

### Security Architecture

#### Authentication
- Supabase Auth with JWT tokens
- Automatic token refresh
- Secure storage of session data

#### Authorization
- Role-based access control
- Database-level Row Level Security
- UI-level permission checks
- API-level validation

#### Data Protection
- Environment variables for sensitive configuration
- HTTPS-only communication
- Input validation and sanitization

### Testing Architecture

#### Unit Testing
- Vitest for component and utility testing
- Mock implementations for external dependencies

#### Integration Testing
- Component interaction testing
- API integration verification

#### End-to-End Testing
- Playwright for critical user flows
- Cross-browser compatibility testing

### Deployment Architecture

#### Build Process
- Vite production build optimization
- Asset bundling and minification
- Environment-specific configuration

#### Hosting
- Static site hosting (Vercel, Netlify, etc.)
- CDN for global distribution
- Supabase handles backend scaling

#### Monitoring
- Error tracking and reporting
- Performance monitoring
- User analytics integration