<!--
generated_by: tessera
source_sha: 581f5529382d629912d51d9dc86613125abd7306
generated_at: 2026-03-27T01:50:35.311Z
action: create
-->

# Architecture Documentation

## Application Structure

### Routing

The application uses React Router DOM with a simple routing structure:

- `/` (Index): Main dashboard page
- `*` (NotFound): Catch-all route for 404 errors

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Component Hierarchy

```
App
├── TooltipProvider
├── Toaster (notifications)
├── Sonner (toast notifications)
└── BrowserRouter
    └── Routes
        ├── Index (dashboard)
        └── NotFound
```

## Core Components

### UI Component Library

The application uses shadcn/ui, a comprehensive component library built on Radix UI primitives. Key components include:

#### Form Components
- `Input`, `Textarea`: Text input fields
- `Select`: Dropdown selection
- `Checkbox`, `RadioGroup`: Selection controls
- `Switch`, `Slider`: Interactive controls

#### Layout Components
- `Card`: Content containers
- `Sheet`, `Dialog`, `Drawer`: Modal and overlay components
- `Tabs`: Tabbed interfaces
- `Accordion`: Collapsible content

#### Navigation
- `NavigationMenu`: Main navigation
- `Breadcrumb`: Page hierarchy
- `Pagination`: Data pagination

#### Feedback
- `Alert`: Status messages
- `Toast`, `Toaster`: Notifications
- `Progress`: Progress indicators
- `Skeleton`: Loading states

#### Data Display
- `Table`: Data tables
- `Badge`: Status indicators
- `Avatar`: User images
- `Chart`: Data visualization

### Custom Components

- `NavLink`: Enhanced navigation link with active state management

## State Management

### Server State (TanStack Query)
- Handles all API data fetching and caching
- Automatic background refetching
- Optimistic updates
- Error handling and retry logic

### Local State (React Hooks)
- Component-level state management
- Form state through React Hook Form

### Form State
- React Hook Form for form management
- Zod schemas for validation
- Integration with shadcn/ui form components

## Data Layer

### Supabase Integration

The application uses Supabase for:

- **Database**: PostgreSQL with type-safe queries
- **Authentication**: User login/logout
- **Storage**: File uploads
- **Real-time**: Live data updates

### Database Schema

The database includes 30+ tables organized by domain:

#### Core Tables
- `companies`: Multi-tenant company data
- `employees`: Employee profiles
- `admin_users`: Administrative accounts

#### HR Operations
- `attendance_records`: Daily attendance
- `payroll_records`: Salary processing
- `leave_requests`: Leave management
- `evaluations`: Performance reviews

#### Business Operations
- `projects`: Project management
- `clients`: Client relationships
- `invoices`: Billing system

#### Financial
- `office_expenses`: Expense tracking
- `loans`: Employee loans
- `salary_history`: Compensation changes

## Development Patterns

### Component Development
```tsx
// Example pattern for shadcn/ui components
const Component = forwardRef<Element, Props>(
  ({ className, ...props }, ref) => (
    <Primitive
      ref={ref}
      className={cn(baseClasses, className)}
      {...props}
    />
  )
);
Component.displayName = "ComponentName";
```

### Data Fetching
```tsx
// Using TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['entity', id],
  queryFn: () => fetchEntity(id),
});
```

### Form Handling
```tsx
// React Hook Form with Zod
const form = useForm<Schema>({
  resolver: zodResolver(schema),
  defaultValues: {...}
});
```

## Build and Deployment

### Development
- Vite for fast HMR and building
- TypeScript for type checking
- ESLint for code quality

### Production
- Optimized bundle through Vite
- Static asset optimization
- Deployable to any static hosting service

## Security Considerations

- TypeScript prevents type-related vulnerabilities
- Supabase RLS for data access control
- Input validation through Zod schemas
- XSS protection via React sanitization
- Secure authentication through Supabase Auth