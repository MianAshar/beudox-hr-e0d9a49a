<!--
generated_by: tessera
source_sha: 387391b56870e1f87a0608cfe39642ec2a98d0ba
generated_at: 2026-04-21T11:07:06.081Z
action: create
-->

# Beudox HR - Architecture Documentation

## Application Architecture

Beudox HR is built as a modern single-page application (SPA) using React 18 and TypeScript, following component-based architecture principles with clear separation of concerns.

## Technology Stack

### Core Framework
- **React 18**: Latest React with concurrent features and hooks
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool with optimized development experience

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives (60+ components)
- **Lucide React**: Consistent icon library
- **Custom Design System**: CSS custom properties for theming

### Data & State Management
- **TanStack Query**: Server state management with caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Context API**: Global application state

### Backend & Infrastructure
- **Supabase**: Complete backend-as-a-service
  - PostgreSQL database
  - Authentication & authorization
  - Real-time subscriptions
  - File storage
  - Edge functions

## Application Structure

### Directory Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI primitives (shadcn/ui style)
│   ├── layout/         # Application shell components
│   ├── employee-profile/  # Employee-specific features
│   ├── finance/        # Financial components
│   ├── evaluations/    # Performance components
│   ├── projects/       # Project management
│   ├── leave/          # Leave management
│   ├── payroll/        # Payroll components
│   ├── settings/       # Administrative settings
│   └── hr-policies/    # Policy management
├── pages/              # Route-level components (30+ pages)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and business logic
├── integrations/       # External service integrations
└── types/              # TypeScript definitions
```

### Component Hierarchy

#### Page Level Components
Located in `src/pages/`, these are the main route handlers:
- `Dashboard.tsx` - Main dashboard with overview widgets
- `Employees.tsx` - Employee listing and management
- `EmployeeProfile.tsx` - Individual employee detail view
- `Payroll.tsx` - Payroll processing interface
- `Projects.tsx` - Project management
- `Settings.tsx` - Administrative configuration

#### Layout Components
- `AppLayout.tsx` - Main application shell with sidebar navigation
- `AppSidebar.tsx` - Collapsible navigation sidebar
- `TopBar.tsx` - Top navigation with user menu and notifications
- `NotificationBell.tsx` - Notification dropdown
- `UserMenu.tsx` - User account menu

#### Feature Components
Organized by domain, these handle specific functionality:
- **Employee Profile Tabs**: Attendance, Payroll, Documents, Leave, etc.
- **Form Components**: Create/edit forms for all entities
- **Data Display**: Tables, charts, and summary cards
- **Interactive Components**: Modals, dropdowns, and selectors

## Routing Architecture

### Route Structure
The application uses React Router v6 with a hierarchical route structure:

```typescript
// Main routes in App.tsx
/dashboard          // Main dashboard
/employees          // Employee listing
/employees/new      // Create employee
/employees/:id      // Employee profile
/employees/:id/edit // Edit employee
/payroll           // Payroll management
/projects          // Project listing
/settings          // Admin settings
/login             // Authentication
```

### Route Protection
All business routes are wrapped with `ProtectedRoute` component that:
1. Checks authentication status
2. Loads employee data and roles
3. Validates route-level permissions
4. Redirects unauthorized users

### Route-Based Code Splitting
Routes are designed for lazy loading to optimize bundle size.

## Data Architecture

### Data Fetching Strategy
- **TanStack Query** handles all server state
- Query keys follow hierarchical structure: `['entity', id, 'sub-entity']`
- Automatic caching, background refetching, and optimistic updates
- Error handling with user-friendly messages

### Database Schema
Based on 29 migration files, key entities include:

- **Core HR**: employees, attendance_records, leave_requests
- **Finance**: payroll_records, invoices, expenses
- **Projects**: projects, tasks, clients
- **Admin**: departments, roles, policies, settings

### Real-time Updates
Supabase real-time subscriptions for:
- Live notifications
- Collaborative features
- Real-time dashboards

## State Management

### Server State (TanStack Query)
- **Queries**: Read operations with caching
- **Mutations**: Write operations with optimistic updates
- **Invalidation**: Cache updates after mutations

### Client State (React Hooks)
- **useState**: Local component state
- **useContext**: Global application state
- **Custom Hooks**: Reusable stateful logic

### Form State (React Hook Form)
- **Validation**: Zod schemas for type-safe validation
- **Performance**: Optimized re-renders
- **Integration**: Easy API integration

## Authentication & Authorization

### Authentication Flow
1. **Login**: Email/password authentication via Supabase
2. **Session Management**: JWT tokens with automatic refresh
3. **Password Reset**: Email-based recovery flow
4. **Invite System**: New user onboarding

### Authorization System
- **Role-Based Access**: Hierarchical permission system
- **Route Guards**: Component-level access control
- **API Security**: Row Level Security (RLS) policies
- **Permission Checks**: Utility functions for granular control

## Component Patterns

### UI Component Library
60+ reusable components following shadcn/ui patterns:
- **Base Components**: Button, Input, Select, etc.
- **Layout Components**: Card, Sheet, Dialog, etc.
- **Data Display**: Table, Chart, Badge, etc.
- **Feedback**: Toast, Alert, Skeleton, etc.

### Custom Components
- **SearchableEmployeeSelect**: Employee picker with search
- **BeudoxLogo**: Brand logo with variants
- **NavLink**: Enhanced router link with active states
- **SummaryCard**: Metric display component

### Composition Patterns
- **Slots**: Radix UI slot-based composition
- **Render Props**: Flexible component APIs
- **Compound Components**: Related components grouped together

## Business Logic

### Core Business Rules
1. **Attendance Calculation**: Working hours, overtime, holidays
2. **Leave Management**: Balance tracking, approval workflows
3. **Payroll Processing**: Complex calculations with multiple factors
4. **Review Scheduling**: Automated evaluation cycles
5. **Role Permissions**: Granular access control matrix

### Utility Libraries
Located in `src/lib/`:
- **Date Utilities**: Formatting and manipulation
- **Role Access**: Permission checking
- **Formatters**: Data presentation helpers
- **Business Logic**: Domain-specific calculations

## Performance Optimizations

### Build Optimizations
- **Vite**: Fast HMR and optimized production builds
- **Code Splitting**: Route-based and component-based splitting
- **Tree Shaking**: Automatic dead code elimination
- **Asset Optimization**: Image compression and font loading

### Runtime Optimizations
- **Query Caching**: Prevents unnecessary API calls
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large data tables
- **Lazy Loading**: Images and components

### Database Optimizations
- **Indexing**: Optimized queries with proper indexes
- **Pagination**: Large dataset handling
- **Efficient Queries**: Selective field fetching

## Development Workflow

### Development Server
- **Vite Dev Server**: Port 8080 with hot reload
- **HMR**: Instant updates without full reload
- **Error Overlay**: Clear error messages

### Build Pipeline
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

### Code Organization
- **Path Aliases**: `@/` for clean imports
- **Barrel Exports**: Consolidated imports
- **Consistent Naming**: Kebab-case files, PascalCase components
- **Type Definitions**: Centralized in `src/types/`

## Deployment Architecture

### Build Output
- **Static Assets**: Optimized bundles for CDN
- **SPA Routing**: Client-side routing with history API
- **Environment Config**: Build-time environment variables

### Hosting Strategy
- **Static Hosting**: Vercel, Netlify, or similar
- **CDN**: Global asset distribution
- **API**: Supabase handles backend services

### Environment Management
- **Development**: Local Supabase instance
- **Staging**: Separate Supabase project
- **Production**: Production Supabase project

This architecture provides a scalable, maintainable foundation for a comprehensive HR management system with modern development practices and excellent user experience.