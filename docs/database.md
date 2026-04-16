<!--
generated_by: tessera
source_sha: 939657ec2ede9cca1a4aad08f88592834464cc25
generated_at: 2026-04-16T12:21:14.215Z
action: create
-->

# Beudox HR - Database Documentation

## Overview

Beudox HR uses Supabase as its backend-as-a-service provider, offering PostgreSQL database with real-time capabilities, authentication, and file storage. The database schema supports comprehensive HR management functionality.

## Database Architecture

### Supabase Services

#### PostgreSQL Database
- **Tables**: Core business entities
- **Views**: Pre-computed data aggregations
- **Functions**: Server-side business logic
- **Triggers**: Automated data processing

#### Row Level Security (RLS)
- **Automatic Filtering**: Data access based on user context
- **Role-based Policies**: Granular permission control
- **Secure Queries**: All access goes through RLS

#### Real-time Subscriptions
- **Live Updates**: Instant UI synchronization
- **Selective Subscriptions**: Targeted data watching
- **Performance Optimized**: Efficient change detection

## Core Tables

### Employees

**Purpose**: Central user management and profile storage

```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  date_of_birth DATE,
  hire_date DATE NOT NULL,
  termination_date DATE,
  role_name VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  designation VARCHAR(100),
  avatar_url TEXT,
  address TEXT,
  emergency_contact JSONB,
  bank_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Relationships**:
- **company_id**: Links to company settings
- **role_name**: Determines permissions and access
- **JSONB fields**: Flexible storage for complex data

### Evaluations

**Purpose**: Formal performance reviews

```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  evaluated_by UUID NOT NULL REFERENCES employees(id),
  period VARCHAR(20) NOT NULL, -- 'Q1', 'Q2', etc.
  overall_score DECIMAL(3,1) CHECK (overall_score >= 1 AND overall_score <= 5),
  comments TEXT,
  recommendation TEXT,
  strengths TEXT[],
  areas_for_improvement TEXT[],
  goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Business Logic**:
- **Scoring**: 1-5 star rating system
- **Period-based**: Quarterly evaluations
- **Structured Feedback**: Categorized improvement areas

### Daily Evaluations

**Purpose**: Continuous feedback system

```sql
CREATE TABLE daily_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  reviewer_id UUID NOT NULL REFERENCES employees(id),
  reviewee_id UUID NOT NULL REFERENCES employees(id),
  direction VARCHAR(20) NOT NULL, -- 'upward', 'downward', 'peer'
  date DATE NOT NULL,
  overall_score DECIMAL(3,1) CHECK (overall_score >= 1 AND overall_score <= 5),
  remarks TEXT,
  categories JSONB, -- {'communication': 4, 'leadership': 3}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Evaluation Types**:
- **Upward**: Employee feedback to manager
- **Downward**: Manager feedback to employee
- **Peer**: Colleague feedback

### Leave Management

**Purpose**: Time-off tracking and approvals

```sql
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  leave_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested DECIMAL(5,1) NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  leave_type VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  allocated_days DECIMAL(5,1) NOT NULL,
  used_days DECIMAL(5,1) DEFAULT 0,
  carried_forward DECIMAL(5,1) DEFAULT 0,
  UNIQUE(employee_id, leave_type, year)
);
```

**Leave Types**:
- **Annual Leave**: Standard vacation
- **Sick Leave**: Medical absence
- **Personal Leave**: Personal matters
- **Maternity/Paternity**: Family leave

### Projects & Finance

**Purpose**: Project management and billing

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id),
  project_manager UUID REFERENCES employees(id),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE project_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  role VARCHAR(100),
  allocation_percentage INTEGER CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
  start_date DATE NOT NULL,
  end_date DATE,
  UNIQUE(project_id, employee_id, start_date)
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### HR Policies

**Purpose**: Company policy documentation

```sql
CREATE TABLE hr_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL, -- HTML content
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Payroll

**Purpose**: Compensation processing

```sql
CREATE TABLE payroll_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  processed_by UUID REFERENCES employees(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payroll_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  basic_salary DECIMAL(10,2) NOT NULL,
  allowances DECIMAL(10,2) DEFAULT 0,
  deductions DECIMAL(10,2) DEFAULT 0,
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  overtime_amount DECIMAL(10,2) DEFAULT 0,
  net_salary DECIMAL(10,2) NOT NULL,
  UNIQUE(payroll_run_id, employee_id)
);
```

## Database Queries & Patterns

### Common Query Patterns

#### Employee with Relations
```sql
SELECT 
  e.*,
  d.name as department_name,
  m.full_name as manager_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN employees m ON e.manager_id = m.id
WHERE e.company_id = $1;
```

#### Evaluation Timeline
```sql
-- Quarterly evaluations
SELECT 
  'quarterly' as type,
  ev.created_at as date,
  ev.overall_score,
  ev.comments,
  evaluator.full_name as evaluator_name
FROM evaluations ev
JOIN employees evaluator ON ev.evaluated_by = evaluator.id
WHERE ev.employee_id = $1
ORDER BY ev.created_at DESC;

-- Daily evaluations
SELECT 
  'daily' as type,
  de.date,
  de.overall_score,
  de.remarks,
  reviewer.full_name as reviewer_name
FROM daily_evaluations de
JOIN employees reviewer ON de.reviewer_id = reviewer.id
WHERE de.reviewee_id = $1
ORDER BY de.date DESC;
```

#### Leave Balance Calculation
```sql
SELECT 
  leave_type,
  allocated_days - used_days as remaining_days
FROM leave_balances
WHERE employee_id = $1 AND year = $2;
```

### Row Level Security Policies

#### Employee Data Access
```sql
-- Employees can view their own data
CREATE POLICY "employees_view_own" ON employees
FOR SELECT USING (auth.uid() = user_id);

-- HR can view all employee data
CREATE POLICY "hr_view_all" ON employees
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employees 
    WHERE id = auth.uid() 
    AND role_name IN ('hr_manager', 'ceo')
  )
);
```

#### Evaluation Visibility
```sql
-- Employees can view evaluations about themselves
CREATE POLICY "evaluations_self" ON evaluations
FOR SELECT USING (auth.uid() = employee_id);

-- Managers can view evaluations they conducted
CREATE POLICY "evaluations_conducted" ON evaluations
FOR SELECT USING (auth.uid() = evaluated_by);
```

## Migration Strategy

### Migration Files
Located in `supabase/migrations/` with timestamp-based naming:

```
20260327024411_dd73d633-87f8-4810-ade7-67a731f7245d.sql
20260327233449_3688515e-184e-4704-8759-e560c8990571.sql
...
```

### Migration Best Practices
- **Incremental Changes**: Each migration is a single change
- **Reversible**: Support for rollbacks
- **Tested**: Validate in staging before production
- **Documented**: Clear comments explaining changes

## Performance Optimization

### Indexing Strategy
```sql
-- Composite indexes for common queries
CREATE INDEX idx_evaluations_employee_period 
ON evaluations(employee_id, period);

CREATE INDEX idx_daily_evals_reviewee_date 
ON daily_evaluations(reviewee_id, date DESC);

-- Partial indexes for active records
CREATE INDEX idx_active_policies 
ON hr_policies(company_id) WHERE is_active = true;
```

### Query Optimization
- **Pagination**: Use LIMIT/OFFSET for large datasets
- **Selective Fields**: Only select needed columns
- **Joins**: Prefer INNER JOINs over OUTER when possible
- **Aggregations**: Use database functions for calculations

## Real-time Features

### Subscription Patterns
```typescript
// Real-time leave request updates
const channel = supabase
  .channel('leave_requests')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'leave_requests',
    filter: `employee_id=eq.${employeeId}`
  }, (payload) => {
    // Handle real-time update
    queryClient.invalidateQueries(['leave-requests']);
  })
  .subscribe();
```

### Real-time Tables
- **leave_requests**: Live status updates
- **daily_evaluations**: Instant feedback notifications
- **notifications**: Real-time alert system

## Backup & Recovery

### Supabase Backup
- **Automatic Backups**: Daily database snapshots
- **Point-in-time Recovery**: Restore to specific timestamp
- **Geographic Redundancy**: Multi-region replication

### Data Export
- **CSV Export**: Bulk data extraction
- **API Access**: Programmatic data retrieval
- **Audit Logs**: Change tracking and compliance

This database documentation provides a comprehensive overview of the Beudox HR system's data architecture, schema design, and operational patterns.