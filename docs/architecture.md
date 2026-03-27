<!--
generated_by: tessera
source_sha: ad247ba42a3f2e8b8b3fd155bdb9eb108cfdb6bc
generated_at: 2026-03-27T02:41:05.991Z
action: create
-->

# Architecture Documentation

## Application Structure

### Frontend Architecture

#### Routing Structure
- **/**: Main dashboard/index page (currently placeholder)
- **/404**: Not found page with error logging

#### Core Components
- **NavLink**: Enhanced navigation component with active state styling
- **UI Components**: 40+ shadcn/ui components for consistent interface
- **Toast System**: Notification system using Sonner and custom toasts
- **Form Components**: React Hook Form integration with validation

### Backend Architecture

#### Database Design
- **Multi-tenant**: All tables include `company_id` for data isolation
- **Audit Trail**: Created/updated timestamps on all entities
- **Relationships**: Well-structured foreign key constraints

#### Key Entities
- **Companies**: Root tenant entity
- **Employees**: Central user entity with auth integration
- **Attendance/Payroll**: Time and compensation tracking
- **Projects/Clients**: Business management
- **Leave/Expenses**: HR operations

### Data Flow

#### Client-Side State
- **Local State**: React component state for UI
- **Server State**: TanStack Query for API data
- **Form State**: React Hook Form for form management

#### Server-Side Integration
- **Supabase Client**: Type-safe database operations
- **Real-time**: Live data subscriptions
- **Auth**: Session management and user authentication

## Technology Integration

### Build System
- **Vite**: Fast development server and optimized builds
- **TypeScript**: Type safety and developer experience
- **ESLint**: Code quality and consistency

### UI Framework
- **shadcn/ui**: Pre-built, accessible components
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Low-level UI primitives

### Data Management
- **Supabase**: PostgreSQL database with auth
- **React Query**: Server state management
- **Zod**: Schema validation

## Security Architecture

### Authentication
- Supabase Auth for user management
- Session persistence in localStorage
- Auto token refresh

### Data Security
- Row Level Security (RLS) policies
- Company-scoped data access
- Type-safe query building

### API Security
- Environment variable configuration
- No direct database exposure
- Secure key management

## Performance Considerations

### Frontend Optimization
- Vite's fast HMR and builds
- Component lazy loading
- Bundle splitting
- Tailwind CSS optimization

### Data Optimization
- React Query caching
- Optimistic updates
- Background refetching
- Real-time subscriptions

### Database Optimization
- Indexed foreign keys
- Efficient query patterns
- Connection pooling via Supabase

## Scalability Features

### Multi-tenant Support
- Company-based data isolation
- Shared infrastructure
- Per-company feature flags

### Real-time Capabilities
- Live data updates
- Notification system
- Collaborative features

### Modular Design
- Component reusability
- Feature isolation
- Type-safe APIs