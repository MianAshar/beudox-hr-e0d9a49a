<!--
generated_by: tessera
source_sha: 5ad27002d46dd144b4404dd6446fd9fca6cca7e0
generated_at: 2026-04-07T20:51:03.221Z
action: create
-->

# Beudox HR - Architecture Documentation

## Application Structure

### Routing Architecture

The application uses React Router DOM with a hierarchical routing structure:

```
/
├── /login
├── /forgot-password
├── /dashboard (protected)
├── /employees (protected)
│   ├── /employees/new
│   ├── /employees/:id
│   └── /employees/:id/edit
├── /projects (protected)
│   ├── /projects/new
│   ├── /projects/:id
│   └── /projects/:id/edit
├── /clients (protected)
│   └── /clients/:id
├── /invoices (protected)
│   ├── /invoices/new
│   ├── /invoices/:id
│   └── /invoices/:id/edit
├── /hr-policies (protected)
│   ├── /hr-policies/new
│   ├── /hr-policies/:id
│   └── /hr-policies/:id/edit
├── /evaluations (protected)
│   ├── /evaluations/new
│   ├── /evaluations/:id
│   └── /evaluations/:id/edit
├── /evaluations/daily (protected)
│   ├── /evaluations/daily/new
│   └── /evaluations/daily/:id
├── /loans (protected)
├── /payroll (protected)
├── /my-payslip (protected)
├── /holidays (protected)
└── /settings (protected)
```

### Route Protection

All business routes are protected with role-based access control:

- **Authentication Check**: Redirects unauthenticated users to `/login`
- **Role Authorization**: Uses `canAccess()` function to check permissions
- **Password Reset Flow**: Handles invite acceptance and password setting
- **Loading States**: Shows spinner during authentication checks

### Component Architecture

#### Layout Components
- **AppLayout**: Main application wrapper with sidebar and topbar
- **AppSidebar**: Navigation sidebar with role-based menu items
- **TopBar**: Application header with user menu and notifications

#### UI Component Library
The application uses a comprehensive UI component library built on Radix UI:

- Form controls (Button, Input, Select, Checkbox, etc.)
- Layout components (Card, Tabs, Accordion, etc.)
- Feedback components (Toast, Alert, Dialog, etc.)
- Data display (Table, Chart, Avatar, etc.)

#### Feature Components
- **EvaluationTimeline**: Displays chronological evaluation history with filtering
- **SearchableEmployeeSelect**: Employee selection with search and avatar display
- **RichTextEditor**: Full-featured editor for HR policy documents
- **BeudoxLogo**: Configurable logo component with theme variants

### State Management

#### Server State (TanStack React Query)
- Caching and synchronization of API data
- Optimistic updates for better UX
- Background refetching for data freshness
- Error handling and retry logic

#### Client State (Custom Hooks)
- **useAuth**: Authentication state and user profile management
- Toast notifications for user feedback
- Form state management with React Hook Form

### Data Flow

#### Authentication Flow
1. User submits login credentials
2. Supabase authenticates and returns session
3. Application fetches employee profile data
4. Route protection checks permissions
5. User is redirected to appropriate dashboard

#### CRUD Operations
1. User interacts with form or action
2. React Hook Form validates data
3. Supabase mutation executes database operation
4. React Query invalidates related caches
5. UI updates with new data

#### Real-time Updates
1. Supabase real-time subscription active
2. Database change triggers event
3. React Query cache updated
4. Components re-render with new data

### Database Integration

#### Supabase Services Used
- **Authentication**: User login, registration, password reset
- **Database**: PostgreSQL with Row Level Security
- **Real-time**: Live subscriptions for collaborative features
- **Storage**: File uploads for avatars and documents
- **Edge Functions**: Serverless backend logic

#### Data Relationships
- Companies → Employees (hierarchical)
- Employees → Evaluations (performance tracking)
- Projects → Employees (resource allocation)
- Invoices → Clients/Projects (financial tracking)
- HR Policies → Company-wide documents

### Security Model

#### Role-Based Access Control
- **CEO**: Full system access
- **HR Manager**: Employee management, evaluations, policies
- **Team Lead**: Team evaluations, project management
- **Employee**: Personal data, limited views

#### Data Visibility Rules
- Evaluation data filtered based on user role and relationships
- Personal information protected by ownership checks
- Financial data restricted to authorized roles

### Performance Optimizations

- **Code Splitting**: Vite handles automatic code splitting
- **Image Optimization**: Lazy loading and responsive images
- **Caching**: React Query reduces API calls
- **Bundle Optimization**: Tree shaking and minification
- **Build Performance**: SWC compiler for fast TypeScript compilation

### Development Workflow

#### Build System
- **Vite**: Fast development server and optimized builds
- **TypeScript**: Strict type checking and IntelliSense
- **ESLint**: Code quality and consistency
- **Hot Reload**: Instant updates during development

#### Testing Strategy
- **Unit Tests**: Vitest for component and utility testing
- **E2E Tests**: Playwright for user journey testing
- **Component Testing**: React Testing Library for interaction testing

### Deployment Architecture

- **Static Site**: Built as static files for CDN deployment
- **Environment Configuration**: Separate configs for dev/staging/prod
- **API Integration**: Supabase handles backend scaling
- **Monitoring**: Error tracking and performance monitoring ready

This architecture provides a solid foundation for a scalable, maintainable HR management system with modern web development best practices.