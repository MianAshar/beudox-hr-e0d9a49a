<!--
generated_by: tessera
source_sha: 91a7ddffb5c8bb2e9463683161eacd0d041403f9
generated_at: 2026-04-12T19:31:32.730Z
action: create
-->

# Architecture Documentation

## Application Structure

### Routing Architecture

The application uses React Router with a hierarchical routing structure:

```
/
├── /login
├── /forgot-password
├── / (redirects to /dashboard or /login)
└── Protected Routes (require authentication)
    ├── /dashboard
    ├── /employees
    │   ├── /employees/new
    │   ├── /employees/:id
    │   └── /employees/:id/edit
    ├── /projects
    │   ├── /projects/new
    │   ├── /projects/:id
    │   └── /projects/:id/edit
    ├── /clients
    │   └── /clients/:id
    ├── /invoices
    │   ├── /invoices/new
    │   ├── /invoices/:id
    │   └── /invoices/:id/edit
    ├── /hr-policies
    │   ├── /hr-policies/new
    │   ├── /hr-policies/:id
    │   └── /hr-policies/:id/edit
    ├── /evaluations
    │   ├── /evaluations/new
    │   ├── /evaluations/:id
    │   └── /evaluations/:id/edit
    ├── /evaluations/daily
    │   ├── /evaluations/daily/new
    │   └── /evaluations/daily/:id
    ├── /leave
    ├── /payroll
    ├── /my-payslip
    ├── /finance
    ├── /loans
    ├── /holidays
    ├── /settings
    └── /notifications
```

### Route Protection

All business routes are wrapped with `ProtectedRoute` component that:
1. Ensures user authentication
2. Loads employee data and role information
3. Checks role-based access permissions
4. Redirects unauthorized users to dashboard

### Role-Based Access Control

Access is controlled by the `canAccess()` function in `src/lib/role-access.ts`:

- **CEO**: Access to all routes
- **HR Manager**: Employee management, evaluations, leave, policies, settings
- **Finance Manager**: Payroll, invoices, finance, expenses
- **Team Lead**: Project management, team evaluations
- **Employee**: Basic features (dashboard, evaluations, leave, payslip)

## Component Architecture

### Layout Components

- **AppLayout**: Main application wrapper with sidebar and top bar
- **AppSidebar**: Navigation menu with role-based menu items
- **TopBar**: User menu, notifications, and search
- **NotificationBell**: Real-time notification display

### Feature Components

Components are organized by feature domains:

- `src/components/evaluations/`: Evaluation-related components
- `src/components/leave/`: Leave management components
- `src/components/settings/`: Configuration components
- `src/components/hr-policies/`: Policy document components
- `src/components/ui/`: Reusable UI primitives

### Core Components

#### EvaluationTimeline
Displays evaluation history with:
- Quarterly evaluations (formal reviews)
- Daily evaluations (peer feedback)
- Role-based visibility filtering
- Timeline layout with avatars and scores

#### RichTextEditor
Full-featured rich text editor using Tiptap with:
- Formatting toolbar (bold, italic, headings, lists)
- Link insertion and editing
- HTML output for storage
- ProseMirror-based editing

#### SearchableEmployeeSelect
Advanced employee selection component with:
- Search and filter functionality
- Avatar display with initials fallback
- Multi-select support
- "All Employees" option for bulk operations

## Data Architecture

### State Management

#### Server State (TanStack Query)
- API data fetching and caching
- Optimistic updates for better UX
- Background refetching
- Error handling and retry logic

#### Client State (React Context)
- Authentication state
- Theme preferences
- Form state (React Hook Form)

### Database Schema

The application uses Supabase with PostgreSQL, featuring:

- **Employees**: User profiles with roles and departments
- **Evaluations**: Quarterly performance reviews
- **Daily Evaluations**: Peer feedback system
- **Leave Requests**: Leave management with balances
- **Projects**: Project tracking with assignments
- **Invoices**: Client billing and payments
- **Payroll**: Salary processing and attendance
- **HR Policies**: Document storage with rich text
- **Notifications**: System and user notifications

### API Integration

#### Supabase Client
- Centralized client configuration in `src/integrations/supabase/client.ts`
- Environment-based configuration
- Real-time subscriptions for live updates

#### Query Patterns
- Consistent error handling
- Loading states management
- Data transformation and normalization

## Security Architecture

### Authentication
- Supabase Auth with JWT tokens
- Session management with automatic refresh
- Password reset and invite flows

### Authorization
- Database-level RLS policies
- Application-level route protection
- Component-level permission checks

### Data Protection
- Encrypted data transmission
- Secure environment variable handling
- Role-based data filtering

## Performance Architecture

### Build Optimization
- Vite for fast development and optimized production builds
- Code splitting by routes
- Tree shaking for unused code elimination
- Asset optimization and compression

### Runtime Performance
- React Query for efficient data fetching
- Virtual scrolling for large lists
- Image lazy loading
- Memoization for expensive computations

### Caching Strategy
- Browser caching for static assets
- Application caching for API responses
- Service worker for offline capabilities (future)

## Development Architecture

### Code Organization
- Feature-based folder structure
- Shared utilities in `src/lib/`
- Type definitions with TypeScript
- Consistent naming conventions

### Testing Architecture
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright
- Test utilities and mocks

### Tooling
- ESLint for code quality
- Prettier for code formatting
- TypeScript for type checking
- Husky for git hooks (future)

This architecture provides a scalable, maintainable foundation for the HR management system with clear separation of concerns and modern development practices.