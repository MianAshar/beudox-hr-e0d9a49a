<!--
generated_by: tessera
source_sha: c146e39c807c2d7590e3e1eb1fcb10f3b06bbef7
generated_at: 2026-04-07T11:17:15.541Z
action: create
-->

# Beudox HR - Architecture Documentation

## Application Structure

Beudox HR follows a modern React application architecture with clear separation of concerns and modular component design.

### Routing Architecture

The application uses React Router DOM v6 with a hierarchical routing structure:

```
/
├── /login - Authentication page
├── /forgot-password - Password recovery
├── /dashboard - Main dashboard (protected)
├── /employees - Employee management (protected)
│   ├── /new - Create new employee
│   ├── /:id - Employee profile view
│   └── /:id/edit - Edit employee
├── /projects - Project management (protected)
│   ├── /new - Create new project
│   ├── /:id - Project details
│   └── /:id/edit - Edit project
├── /clients - Client management (protected)
│   └── /:id - Client details
├── /invoices - Invoice management (protected)
│   ├── /new - Create new invoice
│   ├── /:id - Invoice details
│   └── /:id/edit - Edit invoice
├── /hr-policies - Policy management (protected)
│   ├── /new - Create new policy
│   ├── /:id - Policy details
│   └── /:id/edit - Edit policy
├── /evaluations - Quarterly evaluations (protected)
│   ├── /new - Create new evaluation
│   ├── /:id - Evaluation details
│   └── /:id/edit - Edit evaluation
├── /evaluations/daily - Daily evaluations (protected)
│   ├── /new - Create new daily evaluation
│   └── /:id - Daily evaluation details
├── /holidays - Public holidays (protected)
├── /settings - Application settings (protected)
└── * - 404 Not Found page
```

### Component Hierarchy

#### Layout Components
- **AppLayout**: Main application wrapper providing sidebar and top navigation
- **AppSidebar**: Collapsible navigation sidebar with menu items
- **TopBar**: Top navigation bar with user menu and notifications

#### Page Components
Each route corresponds to a page component in `src/pages/` that handles the specific feature logic.

#### Feature Components
- **Evaluation Components**: Timeline display, evaluation forms, and detail views
- **HR Policy Components**: Rich text editor for policy documents
- **Settings Components**: Tabbed interface for different configuration areas
- **UI Components**: 40+ reusable components from shadcn/ui library

### State Management

#### Server State (TanStack React Query)
- API data fetching and caching
- Background refetching and synchronization
- Optimistic updates for better UX
- Error handling and retry logic

#### Client State (React Context)
- Authentication state (user session, employee data)
- Theme preferences
- Form state (handled by React Hook Form)

#### Local Component State
- UI interaction state (modals, dropdowns, form inputs)
- Loading states and error states

## Core Components

### AppLayout (`src/components/layout/AppLayout.tsx`)
Provides the main application structure:
- Sidebar navigation (collapsible)
- Main content area with responsive margins
- Top bar integration
- Maximum width container (1280px) for content

### EvaluationTimeline (`src/components/evaluations/EvaluationTimeline.tsx`)
Complex component handling evaluation display:
- Fetches quarterly and daily evaluations via React Query
- Implements role-based visibility filtering
- Combines multiple data sources into unified timeline
- Handles loading states with skeleton components
- Responsive design with proper mobile layout

### RichTextEditor (`src/components/hr-policies/RichTextEditor.tsx`)
TipTap-based rich text editing component:
- Full formatting toolbar (bold, italic, headings, lists, links)
- Content synchronization with parent component
- HTML output for storage and display
- Accessible keyboard navigation

### BeudoxLogo (`src/components/BeudoxLogo.tsx`)
Flexible logo component:
- Multiple variants (default, sidebar)
- Configurable size and wordmark display
- SVG assets for crisp rendering at all sizes

## Data Flow

### Authentication Flow
1. User submits login credentials
2. Supabase authenticates and returns session
3. AuthProvider stores session in context
4. Employee data fetched via React Query
5. Route protection checks user permissions
6. Authorized users access protected routes

### Evaluation Data Flow
1. EvaluationTimeline component mounts
2. React Query fetches quarterly evaluations
3. React Query fetches daily evaluations (received and given)
4. Data filtered based on user role and permissions
5. Timeline items sorted by date (newest first)
6. Component renders with proper loading/error states

### Form Submission Flow
1. User interacts with form (React Hook Form)
2. Zod validation runs on field changes
3. Form submission triggers API call via React Query
4. Optimistic updates for immediate UI feedback
5. Success/error handling with toast notifications
6. Form reset and navigation on success

## Security Architecture

### Authentication
- Supabase Auth handles secure authentication
- JWT tokens managed automatically
- Session persistence without localStorage (security)
- Automatic token refresh

### Authorization
- Role-based access control (RBAC)
- Route-level protection via ProtectedRoute
- Component-level permission checks
- Database-level RLS policies

### Data Protection
- Input sanitization via Zod schemas
- XSS prevention through React's built-in escaping
- CSRF protection via Supabase
- Secure file uploads with storage policies

## Performance Considerations

### Build Optimization
- Vite's fast development server
- SWC compiler for quick TypeScript builds
- Tree shaking for smaller bundles
- Code splitting by routes

### Runtime Performance
- React Query caching reduces API calls
- Lazy loading for components and routes
- Optimized re-renders with proper memoization
- Image optimization and responsive loading

### Database Performance
- Supabase query optimization
- Proper indexing on frequently queried fields
- Pagination for large datasets
- Real-time subscriptions for live updates

## Development Architecture

### Code Organization
- Feature-based folder structure
- Clear separation of concerns
- Reusable component library
- TypeScript for type safety

### Tooling
- ESLint for code quality
- Vitest for unit testing
- Playwright for E2E testing
- Vite for build optimization

### Environment Configuration
- Environment variables for Supabase
- Development vs production builds
- Hot reload for fast development
- Component tagging for debugging

This architecture provides a solid foundation for a scalable, maintainable HR management system with modern React patterns and best practices.