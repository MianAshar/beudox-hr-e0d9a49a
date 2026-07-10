<!--
generated_by: tessera
source_sha: 7cd56bd223f184273f03b6c7372dbc65d79d4bbd
generated_at: 2026-04-19T21:20:04.480Z
action: create
-->

# API Reference

## Overview

Beudox HR uses Supabase as its backend, providing a PostgreSQL database with RESTful APIs, real-time subscriptions, and serverless functions. This document outlines the key API endpoints and data structures used throughout the application.

## Authentication APIs

### User Authentication

#### Sign In
```typescript
supabase.auth.signInWithPassword({
  email: string,
  password: string
})
```

#### Sign Out
```typescript
supabase.auth.signOut()
```

#### Password Reset
```typescript
supabase.auth.resetPasswordForEmail(email: string, {
  redirectTo: '/set-password'
})
```

#### Update Password
```typescript
supabase.auth.updateUser({
  password: string
})
```

## Core Data APIs

### Employees

#### Get Employee Profile
```typescript
supabase
  .from('employees')
  .select('*')
  .eq('id', employeeId)
  .single()
```

#### Update Employee
```typescript
supabase
  .from('employees')
  .update(employeeData)
  .eq('id', employeeId)
```

#### Get Employees by Role
```typescript
supabase
  .from('employees')
  .select('*, roles(*)')
  .eq('company_id', companyId)
  .eq('roles.name', roleName)
```

### Evaluations

#### Quarterly Evaluations
```typescript
// Get evaluations
supabase
  .from('evaluations')
  .select(`
    id, period, overall_score, comments, recommendation,
    created_at, evaluator:employees!evaluations_evaluated_by_fkey(id, full_name, avatar_url)
  `)
  .eq('company_id', companyId)
  .eq('employee_id', employeeId)
  .order('created_at', { ascending: false })

// Create evaluation
supabase
  .from('evaluations')
  .insert({
    employee_id: employeeId,
    company_id: companyId,
    evaluated_by: evaluatorId,
    period: 'Q1-2024',
    overall_score: 4.5,
    comments: 'Excellent performance...',
    recommendation: 'Promotion recommended'
  })
```

#### Daily Evaluations
```typescript
// Get daily evaluations
supabase
  .from('daily_evaluations')
  .select(`
    id, direction, date, overall_score, remarks,
    reviewer:employees!daily_evaluations_reviewer_id_fkey(id, full_name, avatar_url),
    reviewee:employees!daily_evaluations_reviewee_id_fkey(id, full_name, avatar_url)
  `)
  .eq('company_id', companyId)
  .or(`reviewee_id.eq.${employeeId},reviewer_id.eq.${employeeId}`)
  .order('date', { ascending: false })

// Create daily evaluation
supabase
  .from('daily_evaluations')
  .insert({
    reviewer_id: reviewerId,
    reviewee_id: revieweeId,
    company_id: companyId,
    direction: 'positive',
    overall_score: 4.0,
    remarks: 'Great work on the project...'
  })
```

### Leave Management

#### Leave Requests
```typescript
// Get leave requests
supabase
  .from('leave_requests')
  .select(`
    *, employee:employees(id, full_name, avatar_url),
    leave_type:leave_types(name, color)
  `)
  .eq('company_id', companyId)
  .order('created_at', { ascending: false })

// Create leave request
supabase
  .from('leave_requests')
  .insert({
    employee_id: employeeId,
    company_id: companyId,
    leave_type_id: typeId,
    start_date: '2024-01-15',
    end_date: '2024-01-20',
    reason: 'Family vacation',
    status: 'pending'
  })

// Update request status
supabase
  .from('leave_requests')
  .update({ status: 'approved', approved_by: managerId })
  .eq('id', requestId)
```

#### Leave Balances
```typescript
// Get leave balances
supabase
  .from('leave_balances')
  .select('*, leave_type:leave_types(*)')
  .eq('employee_id', employeeId)
  .eq('year', currentYear)
```

### Payroll

#### Payroll Records
```typescript
// Get payroll records
supabase
  .from('payroll_records')
  .select('*')
  .eq('company_id', companyId)
  .eq('month_year', '2024-01')
  .eq('superseded', false)

// Generate payroll (via Edge Function)
supabase.functions.invoke('generate-payroll', {
  body: {
    company_id: companyId,
    month_year: '2024-01',
    employee_ids: [...]
  }
})
```

### Projects & Tasks

#### Projects
```typescript
// Get projects
supabase
  .from('projects')
  .select(`
    *, client:clients(name),
    project_manager:employees(id, full_name),
    team_members:project_team(employee:employees(id, full_name, avatar_url))
  `)
  .eq('company_id', companyId)

// Create project
supabase
  .from('projects')
  .insert({
    name: 'New Project',
    company_id: companyId,
    client_id: clientId,
    project_manager_id: managerId,
    start_date: '2024-01-01',
    end_date: '2024-06-01',
    budget: 50000
  })
```

#### Project Tasks
```typescript
// Get project tasks
supabase
  .from('project_tasks')
  .select(`
    *, assigned_to:employees(id, full_name, avatar_url),
    created_by:employees(id, full_name)
  `)
  .eq('project_id', projectId)
  .order('created_at', { ascending: false })
```

### Financial Data

#### Monthly Expenses
```typescript
// Get expenses
supabase
  .from('monthly_expenses')
  .select('*')
  .eq('company_id', companyId)
  .in('month_year', monthKeys)

// Add expense
supabase
  .from('monthly_expenses')
  .insert({
    company_id: companyId,
    month_year: '2024-01',
    amount: 2500.00,
    description: 'Office supplies',
    category: 'operations'
  })
```

#### Invoices
```typescript
// Get invoices
supabase
  .from('invoices')
  .select(`
    *, client:clients(*),
    project:projects(name),
    created_by:employees(id, full_name)
  `)
  .eq('company_id', companyId)
  .order('created_at', { ascending: false })

// Generate invoice PDF (via Edge Function)
supabase.functions.invoke('generate-invoice-pdf', {
  body: { invoice_id: invoiceId }
})
```

## Edge Functions

### Payroll Generation
```typescript
supabase.functions.invoke('generate-payroll', {
  body: {
    company_id: string,
    month_year: string,
    employee_ids: string[]
  }
})
```

### Invoice PDF Generation
```typescript
supabase.functions.invoke('generate-invoice-pdf', {
  body: { invoice_id: string }
})
```

### Employee Management
```typescript
// Invite employee
supabase.functions.invoke('invite-employee', {
  body: {
    email: string,
    full_name: string,
    role: string
  }
})

// Deactivate employee
supabase.functions.invoke('deactivate-employee', {
  body: { employee_id: string }
})

// Delete employee
supabase.functions.invoke('delete-employee', {
  body: { employee_id: string }
})
```

### Notifications
```typescript
supabase.functions.invoke('send-notification', {
  body: {
    type: 'leave_request' | 'evaluation' | 'payroll_generated',
    recipient_ids: string[],
    data: object
  }
})

supabase.functions.invoke('send-invoice-email', {
  body: {
    invoice_id: string,
    recipient_email: string
  }
})
```

## Real-time Subscriptions

### Live Updates
```typescript
// Leave request updates
supabase
  .channel('leave_requests')
  .on('postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'leave_requests',
      filter: `company_id=eq.${companyId}`
    },
    (payload) => {
      // Handle real-time updates
    }
  )
  .subscribe()
```

## Data Types

### Core Types
```typescript
interface Employee {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role_name: string;
  department?: string;
  designation?: string;
  company_id: string;
}

interface Evaluation {
  id: string;
  employee_id: string;
  evaluated_by: string;
  period: string;
  overall_score: number;
  comments: string;
  recommendation?: string;
  created_at: string;
}

interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
}
```

## Error Handling

### API Error Response
```typescript
interface ApiError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}
```

### Common Error Codes
- `PGRST116` - Row not found
- `PGRST301` - Insufficient privileges
- `23505` - Unique constraint violation
- `23503` - Foreign key constraint violation

## Rate Limiting

Supabase applies rate limits based on your project plan:
- **Anonymous requests**: 100 requests per hour
- **Authenticated requests**: 1000 requests per hour
- **Edge Functions**: Varies by compute time

## Best Practices

### Query Optimization
- Use `select` to fetch only needed columns
- Implement proper indexing on frequently queried columns
- Use pagination for large datasets
- Leverage Supabase's query planner

### Real-time Usage
- Subscribe only to necessary changes
- Implement proper cleanup on component unmount
- Handle connection drops gracefully

### Security
- Always validate user permissions on the client
- Use RLS policies for data access control
- Sanitize user inputs
- Implement proper error handling without exposing sensitive information

This API reference covers the core functionality of Beudox HR. For detailed type definitions, refer to the generated Supabase types in `src/integrations/supabase/types.ts`.