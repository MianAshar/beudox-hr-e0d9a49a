<!--
generated_by: tessera
source_sha: 49efd5789a2fd043e8337de3e55431c26077ebfc
generated_at: 2026-04-01T00:00:22.117Z
action: create
-->

# Beudox HR Frontend Architecture

## Application Structure

Beudox HR follows a modern React application architecture with clear separation of concerns and modular component design.

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Application layout components
│   └── ui/             # shadcn/ui component library
├── pages/              # Route-based page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
├── test/               # Test files and utilities
└── main.tsx            # Application entry point
```

## Routing Architecture

### Route Configuration

The application uses React Router DOM with a hierarchical routing structure:

```typescript
// Main routes defined in src/App.tsx
- / (Root redirect)
- /login (Authentication)
- /forgot-password (Password recovery)
- /dashboard (Main dashboard)
├── /employees (Employee management)
│   ├── /new (Create employee)
│   ├── /:id (Employee profile)
│   └── /:id/edit (Edit employee)
├── /holidays (Public holidays)
├── /projects (Project management)
│   ├── /new (Create project)
│   ├── /:id (Project details)
│   └── /:id/edit (Edit project)
├── /clients (Client management)
│   └── /:id (Client details)
├── /settings (Application settings)
└── * (404 Not Found)
```

### Protected Routes

All business routes are wrapped in `ProtectedRoute` component that handles:
- Authentication checking
- Role-based access control
- Password reset interception
- Loading states

### Navigation System

The sidebar navigation is organized into logical sections:

- **MAIN**: Core application features
- **PEOPLE**: Employee and HR-related functions
- **FINANCE**: Financial management and reporting
- **WORK**: Project and client management
- **SYSTEM**: Administrative functions

## Component Architecture

### Layout Components

#### AppLayout
- Main application wrapper
- Manages sidebar and main content layout
- Responsive design with collapsible sidebar
- Consistent spacing and styling

#### AppSidebar
- Collapsible navigation sidebar
- Role-based menu item visibility
- Company logo integration
- User information display

#### TopBar
- Page title display
- Dynamic titles based on current route
- Consistent header styling

### UI Component Library

The application uses shadcn/ui, a comprehensive component library built on Radix UI primitives:

- **Form Components**: Input, Select, Checkbox, Radio, etc.
- **Layout Components**: Card, Sheet, Dialog, Drawer
- **Data Display**: Table, Chart, Badge, Avatar
- **Feedback**: Toast, Alert, Progress, Skeleton
- **Navigation**: Tabs, Breadcrumb, Pagination
- **Overlay**: Tooltip, Popover, Dropdown Menu

### Core Components

#### BeudoxLogo
- Flexible logo component with variants
- Supports different sizes and display modes
- Company logo integration

#### NavLink
- Enhanced React Router NavLink
- Active state styling
- Customizable class names

## State Management

### Global State
- **Authentication**: AuthProvider context for user session and profile
- **UI State**: Local component state for UI interactions
- **Server State**: TanStack React Query for API data caching

### Data Fetching
- React Query for declarative data fetching
- Automatic caching and background updates
- Error handling and loading states
- Optimistic updates for better UX

## Authentication & Authorization

### Authentication Flow
1. User authentication via Supabase Auth
2. Session management with automatic refresh
3. Password reset and invitation handling
4. Protected route access control

### Role-Based Access Control
- Permission checking via `canAccess` utility
- Route-level protection
- Menu item visibility based on roles
- Database-level security with RLS policies

## Styling System

### Design System
- **Tailwind CSS**: Utility-first styling
- **CSS Variables**: Theme customization
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Theme switching capability

### Theme Configuration
- Custom color palette
- Typography scale
- Spacing and sizing system
- Component-specific styling

## Development Architecture

### Build System
- **Vite**: Fast development server and optimized builds
- **TypeScript**: Type safety and better DX
- **ESLint**: Code quality enforcement
- **PostCSS**: CSS processing and optimization

### Testing Strategy
- **Unit Tests**: Vitest for component and utility testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Playwright for full user workflow testing
- **Test Utilities**: React Testing Library for component testing

### Code Organization
- **Feature-based**: Components grouped by functionality
- **Utility Functions**: Shared logic in lib directory
- **Type Definitions**: Centralized type definitions
- **Constants**: Configuration and constants

## Performance Optimizations

### Build Optimizations
- Code splitting with Vite
- Tree shaking for unused code
- Asset optimization and compression
- Service worker for caching (future)

### Runtime Performance
- React Query caching
- Lazy loading for routes
- Image optimization
- Bundle analysis and monitoring

## Integration Architecture

### Supabase Integration
- **Authentication**: User management and sessions
- **Database**: PostgreSQL with real-time capabilities
- **Edge Functions**: Serverless functions for complex operations
- **Storage**: File uploads and asset management

### External APIs
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form for form management
- **Validation**: Zod for schema validation
- **Icons**: Lucide React for consistent iconography

## Deployment Architecture

### Build Process
1. Type checking and linting
2. Test execution
3. Production build generation
4. Asset optimization
5. Deployment to hosting platform

### Environment Configuration
- Development, staging, and production environments
- Environment-specific Supabase configurations
- Build-time variable injection
- Secure credential management