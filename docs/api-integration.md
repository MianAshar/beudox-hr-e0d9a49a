<!--
generated_by: tessera
source_sha: 5ad27002d46dd144b4404dd6446fd9fca6cca7e0
generated_at: 2026-04-07T20:51:03.221Z
action: create
-->

# Beudox HR - API Integration Documentation

## Backend Architecture

Beudox HR integrates with Supabase as the primary backend service, providing database, authentication, real-time features, and serverless functions.

## Supabase Services

### Database (PostgreSQL)

#### Schema Overview
Based on migration files, the database includes:

**Core Tables**:
- `companies` - Organization information
- `employees` - User profiles and employment data
- `departments` - Organizational structure
- `roles` - Permission definitions

**HR Operations**:
- `evaluations` - Quarterly performance reviews
- `daily_evaluations` - Daily feedback system
- `hr_policies` - Policy documents
- `evaluation_parameters` - Custom evaluation criteria

**Business Management**:
- `projects` - Project tracking
- `clients` - Client relationships
- `invoices` - Billing and invoicing
- `loans` - Employee loan management

**Financial**:
- `payroll` - Salary processing
- `payslips` - Employee payslips
- `expense_categories` - Expense classification

### Authentication

#### Auth Methods
- **Email/Password**: Standard authentication
- **Magic Link**: Passwordless login
- **Social Auth**: Third-party provider integration
- **Invite System**: Employee onboarding

#### User Management
- **Profile Management**: Extended user profiles
- **Role Assignment**: Permission-based access control
- **Password Reset**: Secure password recovery
- **Session Management**: JWT-based sessions

### Real-time Features

#### Live Subscriptions
- **Database Changes**: Real-time data synchronization
- **Presence**: User online status
- **Collaboration**: Multi-user editing
- **Notifications**: Instant system notifications

### Storage

#### File Management
- **Avatar Upload**: Profile picture storage
- **Document Storage**: HR policy attachments
- **Invoice PDFs**: Generated document storage
- **Backup Files**: System backup storage

### Edge Functions

#### Serverless Functions
Located in `supabase/functions/`:

- `invite-employee` - Employee invitation system
- `deactivate-employee` - Employee deactivation
- `delete-employee` - Employee removal
- `generate-payroll` - Payroll calculation
- `generate-invoice-pdf` - PDF generation
- `generate-payslip-pdf` - Payslip creation
- `send-invoice-email` - Email notifications

## API Integration Patterns

### Client Initialization

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Data Fetching

#### React Query Integration
```typescript
// Example: Fetching employee data
const { data: employees, isLoading } = useQuery({
  queryKey: ['employees', companyId],
  queryFn: async () => {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('company_id', companyId)
    return data
  },
  enabled: !!companyId
})
```

#### Real-time Subscriptions
```typescript
// Example: Live evaluation updates
useEffect(() => {
  const subscription = supabase
    .channel('evaluations')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'evaluations'
    }, (payload) => {
      queryClient.invalidateQueries(['evaluations'])
    })
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

### Authentication Flow

#### Login Process
```typescript
// src/hooks/useAuth.ts
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}
```

#### Session Management
```typescript
// Automatic session handling
const { data: { session } } = await supabase.auth.getSession()

// Session change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Handle sign in
  }
})
```

### File Upload

#### Avatar Upload
```typescript
const uploadAvatar = async (file: File, employeeId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${employeeId}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file)
    
  if (error) throw error
  return data
}
```

### Edge Functions

#### Function Calls
```typescript
// Example: Generate payroll
const { data, error } = await supabase.functions.invoke('generate-payroll', {
  body: { employeeId, period }
})
```

## Data Relationships

### Employee Hierarchy
- **Companies** → **Employees** (one-to-many)
- **Employees** → **Departments** (many-to-one)
- **Employees** → **Roles** (many-to-one)
- **Employees** → **Managers** (self-referencing)

### Evaluation System
- **Employees** → **Evaluations** (one-to-many)
- **Evaluations** → **Evaluation Parameters** (many-to-many)
- **Daily Evaluations** → **Employees** (reviewer-reviewee relationship)

### Business Operations
- **Projects** → **Employees** (many-to-many through assignments)
- **Clients** → **Projects** (one-to-many)
- **Projects** → **Invoices** (one-to-many)
- **Employees** → **Loans** (one-to-many)

## Error Handling

### API Error Types
- **Network Errors**: Connection issues, timeouts
- **Authentication Errors**: Invalid credentials, expired sessions
- **Authorization Errors**: Insufficient permissions
- **Validation Errors**: Invalid data, constraint violations
- **Rate Limiting**: Too many requests

### Error Handling Patterns
```typescript
try {
  const { data, error } = await supabase
    .from('employees')
    .insert(employeeData)
  
  if (error) {
    // Handle Supabase errors
    switch (error.code) {
      case '23505': // Unique constraint violation
        showToast('Employee already exists')
        break
      default:
        showToast('Failed to create employee')
    }
    return
  }
  
  // Success handling
} catch (error) {
  // Handle network errors
  showToast('Network error. Please try again.')
}
```

## Performance Optimization

### Query Optimization
- **Selective Fields**: Only fetch required columns
- **Pagination**: Limit result sets
- **Indexing**: Database indexes for common queries
- **Caching**: React Query caching layer

### Real-time Optimization
- **Selective Subscriptions**: Subscribe only to relevant changes
- **Debouncing**: Reduce update frequency
- **Connection Management**: Efficient connection pooling

## Security

### Row Level Security (RLS)
- **Database Policies**: Enforce data access rules
- **User Context**: Policies based on authenticated user
- **Role-based Access**: Permission-based data filtering

### API Security
- **JWT Validation**: Secure token verification
- **Request Signing**: Prevent request tampering
- **CORS Policies**: Cross-origin request control
- **Rate Limiting**: Prevent abuse

## Migration Strategy

### Database Migrations
Located in `supabase/migrations/` with timestamped files:
- **Schema Changes**: Table creation, column additions
- **Data Migrations**: Data transformation scripts
- **Index Creation**: Performance optimization
- **Constraint Updates**: Data integrity rules

### Migration Best Practices
- **Version Control**: All migrations tracked in Git
- **Rollback Scripts**: Reversible migrations
- **Testing**: Migration testing in staging
- **Documentation**: Migration purpose and impact

This API integration provides a robust, scalable backend foundation for the HR management system with comprehensive data management and real-time capabilities.