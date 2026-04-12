<!--
generated_by: tessera
source_sha: 91a7ddffb5c8bb2e9463683161eacd0d041403f9
generated_at: 2026-04-12T19:31:32.730Z
action: create
-->

# API Documentation

## Backend Architecture

The application uses Supabase as its backend, providing:
- PostgreSQL database with Row Level Security (RLS)
- Authentication and authorization
- Real-time subscriptions
- Edge functions for serverless API endpoints
- File storage for documents and images

## Database Schema

### Core Tables

#### employees
User profiles and organizational information
```sql
- id: uuid (primary key)
- email: text (unique)
- full_name: text
- avatar_url: text
- role_name: text (employee, hr_manager, finance_manager, team_lead, ceo)
- department_id: uuid (foreign key)
- designation: text
- employee_id: text (unique identifier)
- hire_date: date
- salary: numeric
- status: text (active, inactive)
```

#### evaluations
Quarterly performance reviews
```sql
- id: uuid (primary key)
- employee_id: uuid (foreign key)
- evaluator_id: uuid (foreign key)
- company_id: uuid
- period: text (Q1, Q2, Q3, Q4)
- overall_score: numeric (1-5)
- comments: text
- recommendation: text
- created_at: timestamp
```

#### daily_evaluations
Peer feedback and daily reviews
```sql
- id: uuid (primary key)
- reviewer_id: uuid (foreign key)
- reviewee_id: uuid (foreign key)
- company_id: uuid
- direction: text (positive, constructive, neutral)
- date: date
- overall_score: numeric (1-5)
- remarks: text
```

#### leave_requests
Leave management system
```sql
- id: uuid (primary key)
- employee_id: uuid (foreign key)
- leave_type_id: uuid (foreign key)
- start_date: date
- end_date: date
- reason: text
- status: text (pending, approved, rejected)
- approved_by: uuid (foreign key)
```

#### projects
Project management
```sql
- id: uuid (primary key)
- name: text
- description: text
- client_id: uuid (foreign key)
- project_manager_id: uuid (foreign key)
- start_date: date
- end_date: date
- status: text (planning, active, completed, on_hold)
- budget: numeric
```

#### invoices
Client billing
```sql
- id: uuid (primary key)
- project_id: uuid (foreign key)
- amount: numeric
- status: text (draft, sent, paid, overdue)
- due_date: date
- invoice_number: text
```

## API Endpoints

### Authentication

#### POST /auth/signin
User login
```typescript
interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  user: User;
  session: Session;
}
```

#### POST /auth/signup
User registration (admin only)
```typescript
interface SignUpRequest {
  email: string;
  password: string;
  full_name: string;
  role_name: string;
}
```

### Employee Management

#### GET /employees
List employees with filtering
```typescript
interface EmployeesQuery {
  department_id?: string;
  role_name?: string;
  status?: 'active' | 'inactive';
  search?: string;
  limit?: number;
  offset?: number;
}

interface EmployeesResponse {
  data: Employee[];
  count: number;
}
```

#### POST /employees
Create new employee
```typescript
interface CreateEmployeeRequest {
  email: string;
  full_name: string;
  department_id: string;
  role_name: string;
  designation: string;
  hire_date: string;
  salary: number;
}
```

#### GET /employees/{id}
Get employee details
```typescript
interface EmployeeDetails {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  department: Department;
  role_name: string;
  designation: string;
  hire_date: string;
  salary: number;
  evaluations: Evaluation[];
  leave_balance: LeaveBalance[];
}
```

### Evaluations

#### GET /evaluations
List evaluations
```typescript
interface EvaluationsQuery {
  employee_id?: string;
  evaluator_id?: string;
  period?: string;
  limit?: number;
}
```

#### POST /evaluations
Create evaluation
```typescript
interface CreateEvaluationRequest {
  employee_id: string;
  period: string;
  overall_score: number;
  comments: string;
  recommendation?: string;
}
```

#### GET /daily-evaluations
List daily evaluations
```typescript
interface DailyEvaluationsQuery {
  reviewer_id?: string;
  reviewee_id?: string;
  date_from?: string;
  date_to?: string;
}
```

### Leave Management

#### GET /leave-requests
List leave requests
```typescript
interface LeaveRequestsQuery {
  employee_id?: string;
  status?: 'pending' | 'approved' | 'rejected';
  date_from?: string;
  date_to?: string;
}
```

#### POST /leave-requests
Create leave request
```typescript
interface CreateLeaveRequest {
  leave_type_id: string;
  start_date: string;
  end_date: string;
  reason: string;
}
```

#### PUT /leave-requests/{id}/approve
Approve leave request
```typescript
interface ApproveLeaveRequest {
  approved_by: string;
  comments?: string;
}
```

### Projects & Invoices

#### GET /projects
List projects
```typescript
interface ProjectsQuery {
  client_id?: string;
  status?: string;
  project_manager_id?: string;
}
```

#### GET /invoices
List invoices
```typescript
interface InvoicesQuery {
  project_id?: string;
  status?: string;
  client_id?: string;
}
```

## Real-time Subscriptions

### Employee Updates
```typescript
supabase
  .channel('employees')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'employees'
  }, callback)
  .subscribe()
```

### Notifications
```typescript
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `recipient_id=eq.${userId}`
  }, callback)
  .subscribe()
```

## Edge Functions

### Payroll Generation
**Function**: `generate-payroll`

Generates payroll data based on attendance and salary information.

**Input**:
```typescript
interface PayrollInput {
  employee_id: string;
  month: number;
  year: number;
}
```

**Output**:
```typescript
interface PayrollOutput {
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_pay: number;
  attendance_summary: AttendanceSummary;
}
```

### Invoice PDF Generation
**Function**: `generate-invoice-pdf`

Creates PDF invoices for client billing.

**Input**:
```typescript
interface InvoicePdfInput {
  invoice_id: string;
  include_logo?: boolean;
}
```

**Output**: PDF file buffer

### Email Notifications
**Function**: `send-invoice-email`

Sends invoice emails to clients.

**Input**:
```typescript
interface EmailInput {
  invoice_id: string;
  recipient_email: string;
  subject?: string;
  message?: string;
}
```

## Error Handling

### Standard Error Response
```typescript
interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
```

### Common Error Codes
- `auth/invalid-credentials`: Invalid login credentials
- `auth/unauthorized`: Insufficient permissions
- `validation/invalid-input`: Invalid request data
- `database/not-found`: Resource not found
- `database/constraint-violation`: Database constraint error

## Rate Limiting

API endpoints implement rate limiting:
- Authentication: 5 attempts per minute
- Data mutations: 100 requests per minute
- File uploads: 10 uploads per minute
- Report generation: 5 reports per minute

## Security

### Row Level Security (RLS)
All tables have RLS policies ensuring users can only access authorized data.

### Authentication
JWT tokens with 1-hour expiration, automatic refresh.

### Data Validation
All inputs validated using Zod schemas on both client and server.

### File Storage
Secure file uploads with type validation and size limits.