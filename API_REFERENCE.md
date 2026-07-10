<!--
generated_by: tessera
source_sha: a90685c00aea6cff27dce068c05702801a768e5c
generated_at: 2026-04-19T20:46:03.184Z
action: create
-->

# Beudox HR - API Reference

This document outlines the key API endpoints and data structures used in the Beudox HR application. The application uses Supabase as its backend, providing RESTful APIs with real-time capabilities.

## Authentication Endpoints

### Authentication Flow
- **Login**: `POST /auth/v1/token` (handled by Supabase client)
- **Logout**: `POST /auth/v1/logout`
- **Password Reset**: `POST /auth/v1/recover`
- **Invite User**: Custom edge function

### Session Management
```typescript
interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
    };
  };
}
```

## Core Data Models

### Employee
```typescript
interface Employee {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  designation?: string;
  department_id?: string;
  role_name: 'ceo' | 'hr_manager' | 'team_lead' | 'employee';
  hire_date: string;
  salary?: number;
  status: 'active' | 'inactive' | 'terminated';
  created_at: string;
  updated_at: string;
}
```

### Company
```typescript
interface Company {
  id: string;
  name: string;
  domain?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
}
```

### Department
```typescript
interface Department {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  manager_id?: string;
  created_at: string;
}
```

## HR Management APIs

### Employees

#### List Employees
```typescript
GET /rest/v1/employees?company_id=eq.{companyId}&select=*

Response: Employee[]
```

#### Get Employee
```typescript
GET /rest/v1/employees?id=eq.{employeeId}&select=*

Response: Employee
```

#### Create Employee
```typescript
POST /rest/v1/employees

Body: {
  company_id: string;
  full_name: string;
  email: string;
  designation?: string;
  department_id?: string;
  role_name: string;
  hire_date: string;
  salary?: number;
}

Response: Employee
```

#### Update Employee
```typescript
PATCH /rest/v1/employees?id=eq.{employeeId}

Body: Partial<Employee>

Response: Employee
```

### Evaluations

#### Quarterly Evaluations
```typescript
interface Evaluation {
  id: string;
  company_id: string;
  employee_id: string;
  evaluator_id: string;
  period: string; // 'Q1-2024', 'Q2-2024', etc.
  overall_score: number; // 1-5
  comments: string;
  recommendation?: string;
  created_at: string;
}
```

#### Daily Evaluations
```typescript
interface DailyEvaluation {
  id: string;
  company_id: string;
  reviewer_id: string;
  reviewee_id: string;
  date: string;
  direction: 'up' | 'down' | 'lateral';
  overall_score: number; // 1-5
  remarks: string;
  created_at: string;
}
```

#### List Evaluations
```typescript
GET /rest/v1/evaluations?company_id=eq.{companyId}&employee_id=eq.{employeeId}&order=created_at.desc

Response: Evaluation[]
```

### Leave Management

#### Leave Types
```typescript
interface LeaveType {
  id: string;
  company_id: string;
  name: string; // 'Annual Leave', 'Sick Leave', etc.
  days_allowed: number;
  carry_forward: boolean;
  created_at: string;
}
```

#### Leave Requests
```typescript
interface LeaveRequest {
  id: string;
  company_id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}
```

#### Leave Balances
```typescript
interface LeaveBalance {
  id: string;
  company_id: string;
  employee_id: string;
  leave_type_id: string;
  year: number;
  balance: number;
  used: number;
  carried_forward: number;
}
```

## Financial APIs

### Payroll
```typescript
interface PayrollRecord {
  id: string;
  company_id: string;
  employee_id: string;
  month_year: string; // '2024-01'
  basic_salary: number;
  regular_ot_amount: number;
  holiday_ot_amount: number;
  bonus: number;
  loan_deduction: number;
  final_payment: number;
  superseded: boolean;
  created_at: string;
}
```

### Expenses
```typescript
interface MonthlyExpense {
  id: string;
  company_id: string;
  month_year: string;
  amount: number;
  description: string;
  category: string;
  created_at: string;
}
```

### Loans
```typescript
interface Loan {
  id: string;
  company_id: string;
  employee_id: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  monthly_payment: number;
  remaining_balance: number;
  status: 'active' | 'paid' | 'defaulted';
  created_at: string;
}
```

## Project Management APIs

### Projects
```typescript
interface Project {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  client_id?: string;
  manager_id: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at: string;
}
```

### Project Tasks
```typescript
interface ProjectTask {
  id: string;
  project_id: string;
  assigned_to: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
}
```

### Clients
```typescript
interface Client {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  created_at: string;
}
```

### Invoices
```typescript
interface Invoice {
  id: string;
  company_id: string;
  client_id: string;
  project_id?: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  created_at: string;
}
```

## Edge Functions

### PDF Generation
- **generate-invoice-pdf**: Creates PDF invoices
- **generate-payroll-slip**: Creates payroll PDFs

### Email Services
- **send-invoice-email**: Sends invoices via email
- **send-notification**: Internal notification system

### Business Logic
- **generate-payroll**: Complex payroll calculations
- **invite-employee**: User invitation workflow
- **deactivate-employee**: Employee deactivation

## Real-time Subscriptions

### Live Updates
```typescript
// Subscribe to employee changes
const subscription = supabase
  .channel('employees')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'employees',
    filter: `company_id=eq.${companyId}`,
  }, callback)
  .subscribe()
```

### Available Channels
- **employees**: Employee data changes
- **evaluations**: New evaluations
- **leave_requests**: Leave request updates
- **projects**: Project status changes
- **notifications**: Real-time notifications

## File Storage

### Upload Endpoints
- **Avatars**: `/storage/v1/object/avatars/{fileName}`
- **Documents**: `/storage/v1/object/documents/{fileName}`
- **Company Assets**: `/storage/v1/object/company/{fileName}`

### Storage Buckets
- **avatars**: Employee profile pictures
- **documents**: HR documents and policies
- **company**: Company logos and assets
- **invoices**: Generated invoice PDFs

## Error Handling

### Standard Error Response
```typescript
interface ApiError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Rate Limiting

- **Anonymous**: 10 requests per minute
- **Authenticated**: 100 requests per minute
- **File Uploads**: 10 MB per file, 50 files per hour

## Data Export

### CSV Export
Available for:
- Employee lists
- Payroll records
- Leave requests
- Project tasks
- Financial reports

### PDF Export
Available for:
- Invoices
- Payroll slips
- Reports
- HR policies

This API reference covers the core functionality of Beudox HR. For detailed implementation examples, refer to the component code in the `src/` directory.