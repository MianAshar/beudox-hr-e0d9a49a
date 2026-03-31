<!--
generated_by: tessera
source_sha: 40b00ee682691bbcef30c51375cf535d551e0a81
generated_at: 2026-03-31T22:19:40.175Z
action: create
-->

# Architecture Documentation

## Application Structure

Beudox HR is a React-based single-page application with the following high-level architecture:

### Frontend Layers
- **Presentation Layer**: React components with shadcn/ui
- **Routing Layer**: React Router DOM with protected routes
- **State Management**: TanStack Query + React Context
- **Data Layer**: Supabase client with TypeScript types
- **Styling Layer**: Tailwind CSS with custom theme

## Routing Architecture

### Route Structure
```
/
├── / (RootRedirect)
├── /login
├── /forgot-password
├── /dashboard (Protected)
├── /employees (Protected)
│   ├── /employees/new (Protected)
│   ├── /employees/:id (Protected)
│   └── /employees/:id/edit (Protected)
└── /* (NotFound)
```

### Route Protection
- All business routes are wrapped in `ProtectedRoute` component
- Authentication check redirects to `/login`
- Role-based access control redirects unauthorized users to `/dashboard`
- Password reset flow intercepts authenticated users

## Component Architecture

### Layout Components
- **AppLayout**: Main application wrapper with sidebar and content area
- **AppSidebar**: Collapsible navigation with role-filtered menu items
- **TopBar**: Page title display and potential future actions

### Page Components
- **Login**: Authentication form
- **Dashboard**: Main overview page
- **Employees**: Employee list with search/filter
- **EmployeeProfile**: Individual employee details
- **EmployeeForm**: Add/edit employee form

### UI Components
- 40+ reusable components from shadcn/ui library
- Custom components like `BeudoxLogo` and `NavLink`
- Consistent theming and accessibility features

## State Management

### Authentication State
- Managed via `useAuth` hook and `AuthProvider` context
- Includes session, user profile, and role information
- Handles loading states and password reset flows

### Server State
- TanStack Query for API data fetching and caching
- Optimistic updates for better UX
- Error handling and retry logic

### UI State
- Local component state for forms and interactions
- Toast notifications for user feedback

## Data Architecture

### Supabase Integration
- Client configured in `src/integrations/supabase/client.ts`
- Type-safe database operations
- Real-time subscriptions where needed
- Edge functions for complex business logic

### API Patterns
- RESTful endpoints via Supabase
- GraphQL-like queries with RLS policies
- File uploads for profile images

## Security Architecture

### Authentication
- JWT-based auth via Supabase
- Secure token storage and refresh
- Password reset and invite flows

### Authorization
- Role-based access control at route level
- Database-level row security policies
- API endpoint protection

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Supabase
- XSS protection with React's built-in sanitization

## Performance Considerations

### Build Optimization
- Vite for fast development and tree-shaking
- Code splitting at route level
- Optimized bundle sizes

### Runtime Performance
- React.memo for expensive components
- TanStack Query caching
- Lazy loading for heavy components

### Database Performance
- Indexed queries via Supabase
- Pagination for large datasets
- Efficient data fetching patterns

## Development Architecture

### Code Organization
- Feature-based folder structure
- Shared utilities in `lib/` directory
- Type definitions alongside components

### Testing Strategy
- Unit tests with Vitest
- Integration tests for components
- E2E tests with Playwright

### Tooling
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Husky for git hooks