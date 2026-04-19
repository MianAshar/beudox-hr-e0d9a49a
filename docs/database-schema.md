<!--
generated_by: tessera
source_sha: 7cd56bd223f184273f03b6c7372dbc65d79d4bbd
generated_at: 2026-04-19T21:20:04.480Z
action: create
-->

# Database Schema

## Overview

Beudox HR uses PostgreSQL via Supabase with 26 migration files representing the evolution of a comprehensive HR management schema. The database includes tables for employee management, performance tracking, financial operations, and business processes.

## Core Tables

### Authentication & Users

#### employees
User profiles and employment information.

```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id),
  company_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  hire_date DATE NOT NULL,
  termination_date DATE,
  department TEXT,
  designation TEXT,
  salary DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### companies
Organization information.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### roles
Permission definitions.

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### employee_roles
User-role assignments.

```sql
CREATE TABLE employee_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES employees(id),
  UNIQUE(employee_id, role_id)
);
```

### Performance Management

#### evaluations
Quarterly performance reviews.

```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  evaluated_by UUID REFERENCES employees(id),
  company_id UUID NOT NULL,
  period TEXT NOT NULL, -- 'Q1-2024', 'Q2-2024', etc.
  overall_score DECIMAL(3,2) CHECK (overall_score >= 1 AND overall_score <= 5),
  comments TEXT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### daily_evaluations
Real-time feedback system.

```sql
CREATE TABLE daily_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES employees(id),
  reviewee_id UUID REFERENCES employees(id),
  company_id UUID NOT NULL,
  direction TEXT CHECK (direction IN ('positive', 'constructive', 'neutral')),
  date DATE NOT NULL,
  overall_score DECIMAL(3,2) CHECK (overall_score >= 1 AND overall_score <= 5),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reviewer_id, reviewee_id, date)
);
```

### Time & Leave Management

#### leave_types
Configurable leave categories.

```sql
CREATE TABLE leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  days_allowed INTEGER DEFAULT 0,
  carry_forward BOOLEAN DEFAULT false,
  max_carry_forward INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### leave_requests
Time-off requests and approvals.

```sql
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL,
  leave_type_id UUID REFERENCES leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested DECIMAL(4,1) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### leave_balances
Accrued leave tracking.

```sql
CREATE TABLE leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID REFERENCES leave_types(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  opening_balance DECIMAL(5,1) DEFAULT 0,
  accrued DECIMAL(5,1) DEFAULT 0,
  used DECIMAL(5,1) DEFAULT 0,
  carried_forward DECIMAL(5,1) DEFAULT 0,
  current_balance DECIMAL(5,1) GENERATED ALWAYS AS (opening_balance + accrued - used + carried_forward) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, leave_type_id, year)
);
```

### Payroll & Finance

#### payroll_records
Salary processing and payment history.

```sql
CREATE TABLE payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL,
  month_year TEXT NOT NULL, -- '2024-01'
  basic_salary DECIMAL(10,2),
  regular_ot_hours DECIMAL(5,2) DEFAULT 0,
  regular_ot_amount DECIMAL(10,2) DEFAULT 0,
  holiday_ot_hours DECIMAL(5,2) DEFAULT 0,
  holiday_ot_amount DECIMAL(10,2) DEFAULT 0,
  bonus DECIMAL(10,2) DEFAULT 0,
  loan_deduction DECIMAL(10,2) DEFAULT 0,
  other_deductions DECIMAL(10,2) DEFAULT 0,
  final_payment DECIMAL(10,2),
  payment_date DATE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  superseded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### monthly_expenses
Company financial tracking.

```sql
CREATE TABLE monthly_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  month_year TEXT NOT NULL, -- '2024-01'
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### loans
Employee loan management.

```sql
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2) DEFAULT 0,
  term_months INTEGER NOT NULL,
  monthly_installment DECIMAL(10,2),
  remaining_balance DECIMAL(10,2),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted')),
  purpose TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Project Management

#### projects
Project tracking and management.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id),
  project_manager_id UUID REFERENCES employees(id),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on-hold', 'completed', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### project_team
Project team assignments.

```sql
CREATE TABLE project_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, employee_id)
);
```

#### project_tasks
Task management within projects.

```sql
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES employees(id),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Client & Invoice Management

#### clients
Client relationship management.

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  contact_person TEXT,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### invoices
Billing and invoicing.

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### invoice_items
Invoice line items.

```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Administrative

#### hr_policies
Policy document management.

```sql
CREATE TABLE hr_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  version TEXT DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### public_holidays
Holiday calendar management.

```sql
CREATE TABLE public_holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### notifications
System notification tracking.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes

### Performance Indexes
```sql
-- Employee queries
CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_auth_user_id ON employees(auth_user_id);
CREATE INDEX idx_employees_status ON employees(status);

-- Evaluation queries
CREATE INDEX idx_evaluations_employee_id ON evaluations(employee_id);
CREATE INDEX idx_evaluations_company_id ON evaluations(company_id);
CREATE INDEX idx_daily_evaluations_reviewee_id ON daily_evaluations(reviewee_id);
CREATE INDEX idx_daily_evaluations_reviewer_id ON daily_evaluations(reviewer_id);

-- Leave management
CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_balances_employee_id ON leave_balances(employee_id);

-- Payroll and finance
CREATE INDEX idx_payroll_records_employee_id ON payroll_records(employee_id);
CREATE INDEX idx_payroll_records_month_year ON payroll_records(month_year);
CREATE INDEX idx_monthly_expenses_company_id ON monthly_expenses(company_id);

-- Projects
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_tasks_project_id ON project_tasks(project_id);
```

## Row Level Security (RLS) Policies

### Authentication Policies
```sql
-- Employees can only see their own record
CREATE POLICY "employees_select_own" ON employees
  FOR SELECT USING (auth_user_id = auth.uid());

-- Company access through employee relationship
CREATE POLICY "companies_select_own" ON companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM employees WHERE auth_user_id = auth.uid()
    )
  );
```

### Role-Based Policies
```sql
-- HR can see all employees in company
CREATE POLICY "employees_hr_access" ON employees
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM employees
      WHERE auth_user_id = auth.uid()
      AND role_name IN ('hr_manager', 'ceo')
    )
  );
```

## Functions & Triggers

### Business Logic Functions
```sql
-- Get employee with role information
CREATE OR REPLACE FUNCTION get_employee_by_auth_id()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  role_name TEXT,
  company_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.full_name,
    e.email,
    r.name as role_name,
    e.company_id
  FROM employees e
  JOIN employee_roles er ON e.id = er.employee_id
  JOIN roles r ON er.role_id = r.id
  WHERE e.auth_user_id = auth.uid()
  LIMIT 1;
END;
$$;
```

### Automated Triggers
```sql
-- Update leave balances on approval
CREATE OR REPLACE FUNCTION update_leave_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE leave_balances
    SET used = used + NEW.days_requested
    WHERE employee_id = NEW.employee_id
    AND leave_type_id = NEW.leave_type_id
    AND year = EXTRACT(YEAR FROM NEW.start_date);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER leave_request_approved_trigger
  AFTER UPDATE ON leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_leave_balance();
```

## Migration History

The schema evolved through 26 migrations:

1. **Initial setup**: Companies, employees, roles
2. **Authentication**: RLS policies, auth functions
3. **HR Core**: Evaluations, leave management
4. **Finance**: Payroll, expenses, loans
5. **Projects**: Project management, tasks
6. **Business**: Clients, invoices
7. **Admin**: Policies, holidays, notifications
8. **Refinements**: Performance optimizations, additional fields

This schema provides a comprehensive foundation for HR management with proper relationships, constraints, and performance optimizations.