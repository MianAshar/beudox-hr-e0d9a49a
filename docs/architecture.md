<!--
generated_by: tessera
source_sha: 9c80afc1b52db9f415efa1903cba4e5182b1af01
generated_at: 2026-04-27T12:31:25.792Z
action: create
-->

# Architecture Documentation

## System Architecture

Beudox HR is built as a modern web application following a client-server architecture with Supabase as the backend-as-a-service platform.

### Frontend Architecture

#### Technology Stack
- **React 18** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives

#### Application Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI primitives
│   ├── layout/         # Layout components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route-level components
├── lib/                # Utilities and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

#### Key Architectural Patterns

1. **Component Composition**
   - Higher-order components for shared logic
   - Render props for flexible APIs
   - Compound components for related functionality

2. **Custom Hooks**
   - Business logic extraction
   - State management abstraction
   - Side effect handling

3. **Layout System**
   - Consistent page structures
   - Responsive design patterns
   - Role-based navigation

### Backend Architecture

#### Supabase Integration
- **PostgreSQL Database** - Primary data storage
- **Authentication** - User management and JWT tokens
- **Edge Functions** - Serverless compute
- **Storage** - File and document management
- **Real-time** - Live data subscriptions

#### Database Schema

Key entities and relationships:

- **Companies** → **Employees** → **Attendance Records**
- **Companies** → **Departments** → **Employees**
- **Employees** → **Leave Requests** → **Approvals**
- **Employees** → **Payroll Records**
- **Companies** → **Settings** → **Policies**

### Data Flow

1. **User Interaction** → Component event handlers
2. **API Calls** → React Query mutations/queries
3. **Supabase** → Database operations
4. **Real-time Updates** → UI state synchronization
5. **Edge Functions** → Complex business logic

## Component Architecture

### Layout Components

#### AppLayout
- Root layout container
- Sidebar and main content areas
- Responsive behavior
- Authentication guards

#### AppSidebar
- Navigation menu
- Role-based menu items
- Collapsible design
- Active route highlighting

#### TopBar
- Global actions
- Notifications
- User menu
- Search functionality

### Feature Components

#### AttendanceUploadFlow
- Multi-step wizard pattern
- File upload and validation
- AI-powered data parsing
- Progress tracking
- Error handling

#### EmployeeProfile
- Tabbed interface
- Data fetching and caching
- Form management
- Document handling

#### DataTable
- Sortable columns
- Pagination
- Filtering
- Export functionality

## State Management

### Client State
- **Local Component State**: useState for UI interactions
- **Form State**: React Hook Form for complex forms
- **Global State**: Context API for theme and auth

### Server State
- **React Query**: API data caching and synchronization
- **Optimistic Updates**: Immediate UI feedback
- **Background Refetching**: Data freshness
- **Error Handling**: Retry logic and fallbacks

### State Flow
```
User Action → Component → React Query → Supabase → Database
                                      ↓
                                   UI Update
```

## Authentication & Authorization

### Authentication Flow
1. Login form submission
2. Supabase Auth validation
3. JWT token storage
4. User profile fetching
5. Permission loading
6. Route protection

### Authorization Levels
- **Admin**: Full system access
- **HR Manager**: Employee data management
- **Manager**: Team approvals
- **Employee**: Personal data access

### Security Measures
- Row Level Security (RLS) in database
- JWT token validation
- Route guards
- Component-level permission checks

## Performance Optimization

### Frontend
- Code splitting by routes
- Lazy loading of components
- Image optimization
- Bundle analysis and tree shaking

### Database
- Indexed queries
- Query optimization
- Connection pooling
- Caching strategies

### Monitoring
- Error tracking
- Performance metrics
- User analytics
- System health checks

## Development Workflow

### Code Organization
- Feature-based folder structure
- Shared utilities in lib/
- Type definitions with components
- Consistent naming conventions

### Quality Assurance
- TypeScript strict mode
- ESLint configuration
- Pre-commit hooks
- Automated testing

### Deployment
- CI/CD pipeline
- Environment management
- Feature flags
- Rollback strategies