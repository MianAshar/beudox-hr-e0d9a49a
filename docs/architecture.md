<!--
generated_by: tessera
source_sha: 31af184409d257b5e5f8f357cba10d70c2c9aea4
generated_at: 2026-03-31T22:53:44.573Z
action: create
-->

# Architecture Documentation

## Routing Structure

The application uses React Router DOM for client-side routing with the following structure:

### Public Routes
- `/` - Root redirect (authenticated → dashboard, unauthenticated → login)
- `/login` - User authentication
- `/forgot-password` - Password recovery

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard view
- `/employees` - Employee list view
- `/employees/new` - Add new employee form
- `/employees/:id` - Employee profile view
- `/employees/:id/edit` - Edit employee form
- `/holidays` - Public holidays management
- `/settings` - Application settings

All protected routes are wrapped in `AppLayout` component and include role-based access control.

## Core Components

### Layout Components

#### AppLayout
- Main application wrapper
- Provides consistent layout structure
- Includes sidebar and main content area
- Responsive design with mobile considerations

#### AppSidebar
- Collapsible navigation sidebar
- Role-based menu visibility
- Organized into sections: MAIN, PEOPLE, FINANCE, WORK, SYSTEM
- Company logo display with fallback to Beudox branding
- User information and sign-out functionality

#### TopBar
- Application header
- Dynamic page titles based on current route
- Consistent styling with design system

### UI Components

The application uses shadcn/ui component library built on Radix UI primitives:

- Form components (Input, Select, Checkbox, etc.)
- Layout components (Card, Sheet, Dialog, etc.)
- Navigation components (Tabs, Accordion, etc.)
- Feedback components (Toast, Alert, Progress, etc.)
- Data display (Table, Chart, etc.)

### Custom Components

#### BeudoxLogo
- Displays company or Beudox branding
- Supports different variants (default, sidebar)
- Configurable size and wordmark visibility

#### NavLink
- Enhanced React Router NavLink
- Active state styling
- Supports custom class names for different states

## State Management

### Authentication State
- Managed through `useAuth` custom hook
- Integrates with Supabase authentication
- Handles loading states and password reset flows
- Provides employee data and role information

### Server State
- TanStack Query for data fetching and caching
- Optimistic updates for better UX
- Background refetching and cache invalidation
- Error handling and retry logic

## Role-Based Access Control

Access to features is controlled by user roles:
- Routes are protected at the component level
- Sidebar menu items are conditionally rendered
- `canAccess()` utility function checks permissions
- Unauthorized access redirects to dashboard

## Data Flow

1. **Authentication**: Supabase handles user login/logout
2. **Data Fetching**: Components use TanStack Query hooks
3. **Mutations**: Update operations via Supabase client
4. **Real-time Updates**: Supabase subscriptions for live data
5. **Caching**: Query results cached for performance
6. **Error Handling**: User-friendly error messages and fallbacks

## Configuration

### Environment Variables
- `VITE_SUPABASE_PROJECT_ID`: Supabase project identifier
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Public API key
- `VITE_SUPABASE_URL`: Supabase project URL

### Build Configuration
- Vite for fast development and optimized builds
- TypeScript for type checking
- ESLint for code quality
- Tailwind CSS for styling
- PostCSS for CSS processing