<!--
generated_by: tessera
source_sha: ea60fa1f955ce83642e70153b29070707da198b7
generated_at: 2026-03-27T02:43:15.228Z
action: create
-->

# Architecture Documentation

## Application Structure

### Routing
The application uses React Router DOM with a simple routing structure:

- `/` - Home page (Index component)
- `*` - 404 Not Found page

### Core Components

#### Layout Components
- **App**: Main application wrapper with providers
  - QueryClientProvider (TanStack React Query)
  - TooltipProvider
  - Toaster components (Sonner + custom toast)
  - BrowserRouter for routing

#### UI Components
The application includes a comprehensive set of shadcn/ui components:

**Form Components**: Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider
**Layout Components**: Card, Dialog, Sheet, Sidebar, Tabs, Accordion
**Feedback Components**: Alert, Toast, Progress, Skeleton
**Navigation**: Navigation Menu, Breadcrumb, Pagination
**Data Display**: Table, Badge, Avatar, Calendar
**Overlays**: Popover, Hover Card, Context Menu, Dropdown Menu

#### Custom Components
- **NavLink**: Enhanced React Router NavLink with active state styling

## State Management

### Server State
- **TanStack React Query**: Handles all server state, caching, and synchronization
- Configured with default QueryClient in App.tsx

### Client State
- **React Hooks**: useState, useEffect for local component state
- **Custom Hooks**: useToast for notification management

### Form State
- **React Hook Form**: Complex form handling
- **Zod**: Schema validation for forms

## Data Architecture

### Database Integration
- **Supabase Client**: Centralized in `src/integrations/supabase/client.ts`
- **Type Safety**: Auto-generated TypeScript types from database schema
- **Authentication**: Supabase Auth with localStorage persistence

### Database Schema
The application connects to a PostgreSQL database with 35+ tables organized into:

- **Core Entities**: companies, employees, admin_users
- **HR Operations**: attendance, payroll, leave management
- **Business**: projects, clients, invoices
- **Administrative**: settings, roles, notifications

## Styling Architecture

### Design System
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Consistent component design system
- **CSS Variables**: Theme customization support

### Theming
- **next-themes**: Dark/light mode support (imported but not fully configured)
- **CSS Custom Properties**: Consistent color and spacing tokens

## Development Architecture

### Build System
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Type-safe development
- **ESLint**: Code quality and consistency

### Testing
- **Vitest**: Fast unit testing framework
- **Testing Library**: Component testing utilities
- **Playwright**: E2E testing (configured but not implemented)

## Performance Considerations

### Code Splitting
- **Vite**: Automatic code splitting for routes and components
- **Dynamic Imports**: Lazy loading capabilities built-in

### Caching
- **React Query**: Intelligent caching and background updates
- **Browser Caching**: Vite handles asset optimization

### Bundle Optimization
- **Tree Shaking**: Automatic unused code elimination
- **Minification**: Production build optimizations

## Security Architecture

### Authentication
- **Supabase Auth**: Secure authentication with JWT tokens
- **Session Management**: Automatic token refresh and persistence

### Authorization
- **Row Level Security**: Database-level access control
- **Type Safety**: TypeScript prevents common security issues

### Input Validation
- **Zod Schemas**: Runtime validation for all inputs
- **TypeScript Types**: Compile-time type checking

## Deployment Architecture

### Build Process
- **Vite Build**: Optimized production bundles
- **Asset Handling**: Images, fonts, and static files
- **Environment Variables**: Secure configuration management

### Hosting
- **Static Hosting**: Can be deployed to any static host (Vercel, Netlify, etc.)
- **SPA Routing**: Proper 404 handling for client-side routing