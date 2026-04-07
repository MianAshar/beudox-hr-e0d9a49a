<!--
generated_by: tessera
source_sha: d4441c5f44692ecc6e3310ebe3bcbd68681eafc3
generated_at: 2026-04-07T11:08:53.254Z
action: create
-->

# Beudox HR - Architecture Documentation

## Application Structure

### Routing Architecture

The application uses React Router v6 with a hierarchical routing structure:

```
/
├── /login
├── /forgot-password
├── /dashboard (protected)
├── /employees (protected)
│   ├── /employees/new
│   ├── /employees/:id
│   └── /employees/:id/edit
├── /holidays (protected)
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
└── /settings (protected)
```

**Route Protection**
- All business routes are wrapped with `ProtectedRoute` component
- Authentication check redirects to `/login`
- Role-based authorization redirects unauthorized users to `/dashboard`
- Special handling for password reset/invite flows

### Component Hierarchy

```
App
├── AuthProvider
│   └── BrowserRouter
│       └── Routes
│           ├── Public Routes (Login, ForgotPassword)
│           └── Protected Routes
│               └── AppLayout
│                   ├── AppSidebar
│                   ├── TopBar
│                   └── main content (Page components)
```

### Core Components

#### Layout Components
- **AppLayout**: Main application wrapper providing consistent layout structure
- **AppSidebar**: Collapsible navigation sidebar with role-based menu sections
- **TopBar**: Top navigation bar (implementation details in TopBar.tsx)

#### UI Component Library
The application uses shadcn/ui, a comprehensive component library built on Radix UI:

**Form Components**
- Input, Textarea, Select, Checkbox, Radio Group
- Form validation with React Hook Form + Zod

**Layout Components**
- Card, Dialog, Sheet, Tabs, Accordion
- Table, Pagination, Scroll Area

**Feedback Components**
- Toast, Alert, Progress, Skeleton
- Loading states and error boundaries

**Navigation**
- Dropdown Menu, Context Menu, Navigation Menu
- Breadcrumb, Pagination

#### Business Components
- **RichTextEditor**: Tiptap-based rich text editor for HR policies
- **BeudoxLogo**: Brand logo with variant support (default/sidebar)
- **NavLink**: React Router NavLink wrapper with active state styling

### State Management

#### Authentication State
- Managed via `AuthProvider` context
- Tracks session, employee data, loading states, and password modes
- Automatic redirects based on auth state

#### Server State
- React Query manages all API interactions
- Automatic caching, background refetching, and optimistic updates
- Query keys follow consistent patterns: `['resource', id]`

#### Local Component State
- React hooks for form state, UI interactions
- useState for collapsible sidebar, modal visibility
- useEffect for side effects and data synchronization

### Data Flow Patterns

#### Authentication Flow
1. User accesses protected route
2. `useAuth` hook checks authentication state
3. Loading spinner during auth verification
4. Redirect to login if unauthenticated
5. Role check for authorization
6. Authorized users proceed to requested route

#### Data Fetching
1. Components use React Query hooks
2. Data cached automatically
3. Mutations trigger cache invalidation
4. Optimistic updates for immediate UI feedback
5. Error states handled gracefully

#### Form Submission
1. React Hook Form manages form state
2. Zod schemas validate input
3. Submission triggers React Query mutation
4. Success updates cache and shows feedback
5. Errors displayed with validation messages

### Role-Based Access Control

#### Implementation
- `canAccess(role, path)` function checks permissions
- Navigation items filtered by role
- Route-level protection
- Component-level feature gating

#### Role Hierarchy
- **Admin**: Full system access
- **Manager**: Team and reporting access
- **Employee**: Limited personal access

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives
│   ├── layout/         # Layout components
│   ├── settings/       # Settings pages
│   └── hr-policies/    # Feature-specific components
├── pages/              # Route-level components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and business logic
├── integrations/       # External service integrations
└── test/               # Testing utilities
```

### Build & Development

#### Development Server
- Vite provides fast HMR and development server
- TypeScript compilation with SWC
- ESLint for code quality

#### Production Build
- Optimized bundling with code splitting
- Asset optimization and minification
- Static asset handling

#### Testing Infrastructure
- Vitest for unit testing
- React Testing Library for component testing
- Playwright for E2E testing
- JSDOM for browser environment simulation

### External Integrations

#### Supabase Integration
- Authentication and user management
- PostgreSQL database with real-time capabilities
- Edge functions for serverless operations
- File storage for documents and images

#### Third-Party Libraries
- **Tiptap**: Rich text editing
- **Recharts**: Data visualization
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Date-fns**: Date manipulation
- **Lucide React**: Icon library

### Performance Considerations

#### Optimization Strategies
- React Query caching reduces API calls
- Code splitting with dynamic imports
- Image optimization and lazy loading
- Bundle analysis and tree shaking

#### Monitoring Points
- React Query DevTools for debugging
- Build size monitoring
- Runtime performance profiling
- Error tracking and reporting