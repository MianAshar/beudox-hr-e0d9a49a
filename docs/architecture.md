<!--
generated_by: tessera
source_sha: 8e11b5d7fe7d65cb4672bc4879a4a7d4c01dc9e0
generated_at: 2026-04-07T22:34:23.180Z
action: create
-->

# Beudox HR - Architecture Documentation

## Application Architecture

Beudox HR is built as a modern single-page application (SPA) using React 18 with TypeScript, following a component-based architecture with clear separation of concerns.

### Core Architecture Patterns

#### 1. Layout Architecture
The application uses a consistent layout structure:

```
App
├── AppLayout (provides sidebar + main content area)
│   ├── AppSidebar (navigation)
│   ├── TopBar (user menu, notifications)
│   └── Main Content Area
│       └── Page Components
```

**Key Features:**
- Collapsible sidebar with responsive design
- Fixed top bar with user actions
- Centered content area with max-width constraint
- Mobile-responsive layout adjustments

#### 2. Routing Architecture
- **Router**: React Router DOM v6
- **Route Protection**: `ProtectedRoute` component handles authentication and authorization
- **Role-Based Access**: `canAccess` utility function for permission checks

**Route Structure:**
```typescript
// Public routes
/login
/forgot-password

// Protected routes with role-based access
/dashboard
/employees/*
/projects/*
/evaluations/*
/settings
```

#### 3. Data Architecture
- **Server State**: TanStack Query (React Query) for API state management
- **Local State**: React hooks for UI state
- **Forms**: React Hook Form with Zod validation
- **Database**: Supabase with TypeScript-generated types

### Component Organization

#### UI Component Layers

**1. Base UI Components** (`src/components/ui/`)
- Shadcn/ui components built on Radix UI primitives
- Fully accessible and customizable
- Consistent design system implementation

**2. Layout Components** (`src/components/layout/`)
- `AppLayout`: Main application wrapper
- `AppSidebar`: Navigation sidebar
- `TopBar`: Top navigation bar

**3. Feature Components**
- **Evaluations**: `EvaluationTimeline`, evaluation forms
- **HR Policies**: `RichTextEditor`, policy management
- **Settings**: Configuration tabs and forms
- **Shared**: `SearchableEmployeeSelect`, common UI patterns

### State Management

#### Server State (TanStack Query)
```typescript
// Pattern for data fetching
const { data, isLoading, error } = useQuery({
  queryKey: ['employees', companyId],
  queryFn: async () => {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('company_id', companyId);
    return data;
  },
  enabled: !!companyId,
});
```

**Benefits:**
- Automatic caching and background refetching
- Optimistic updates
- Error handling and retry logic
- Loading state management

#### Authentication State
- Custom `useAuth` hook manages authentication state
- Session persistence with localStorage
- Automatic token refresh
- Password reset and invitation flows

### Database Integration

#### Supabase Architecture
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: JWT-based auth with role management
- **Storage**: File uploads for avatars and documents
- **Edge Functions**: Server-side business logic

#### Type Safety
- Auto-generated TypeScript types from database schema
- Type-safe database queries
- Compile-time error prevention

### Security Architecture

#### Authentication Flow
1. **Login**: JWT token generation
2. **Session Management**: Automatic refresh and persistence
3. **Route Protection**: Authentication and role checks
4. **Password Reset**: Secure reset flow with email verification

#### Authorization
- **Role Hierarchy**: CEO → HR Manager → Team Lead → Employee
- **Route-Level Protection**: Component-based access control
- **Database Security**: Row Level Security policies
- **API Security**: Authenticated requests with JWT tokens

### Performance Architecture

#### Build Optimization
- **Vite**: Fast development and optimized production builds
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization

#### Runtime Performance
- **React Query Caching**: Intelligent data caching
- **Component Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists (potential future enhancement)
- **Image Lazy Loading**: Progressive image loading

### Development Architecture

#### Tooling
- **TypeScript**: Strict type checking
- **ESLint**: Code quality and consistency
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

#### Development Workflow
1. **Local Development**: Vite dev server with hot reload
2. **Type Checking**: Real-time TypeScript compilation
3. **Linting**: Automated code quality checks
4. **Testing**: Unit and integration test execution
5. **Build**: Optimized production bundle generation

### Deployment Architecture

#### Build Process
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

#### Environment Configuration
- **Environment Variables**: Supabase credentials
- **Build-time Configuration**: Vite environment handling
- **Static Asset Serving**: Optimized static file delivery

### Scalability Considerations

#### Current Architecture Benefits
- **Component Modularity**: Easy feature addition and maintenance
- **Type Safety**: Reduced runtime errors and improved developer experience
- **Caching Strategy**: Efficient data fetching and state management
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data

#### Future Scaling Strategies
- **Micro-frontend Architecture**: Potential split into smaller applications
- **API Layer**: Dedicated API service layer for complex business logic
- **Real-time Features**: Supabase real-time for live updates
- **Progressive Web App**: Offline capability and mobile optimization

### Error Handling Architecture

#### Error Boundaries
- React Error Boundaries for component-level error catching
- Graceful error displays with user-friendly messages
- Error logging and monitoring (potential future enhancement)

#### API Error Handling
- React Query error states
- Toast notifications for user feedback
- Retry logic for transient failures
- Loading states for better UX

### Testing Architecture

#### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom utilities
- Utility function testing
- Mocked external dependencies

#### Integration Testing
- API integration testing
- Form submission workflows
- Navigation and routing
- Authentication flows

#### End-to-End Testing
- Playwright for critical user journeys
- Cross-browser compatibility
- Mobile responsiveness testing

This architecture provides a solid foundation for a scalable, maintainable HR management system with modern development practices and robust user experience.