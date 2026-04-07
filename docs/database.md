<!--
generated_by: tessera
source_sha: 8e11b5d7fe7d65cb4672bc4879a4a7d4c01dc9e0
generated_at: 2026-04-07T22:34:23.180Z
action: create
-->

# Beudox HR - Database Schema & Relationships

## Database Overview

Beudox HR uses Supabase (PostgreSQL) as its database backend with 20 migration files defining the complete schema. The database follows a multi-tenant architecture with Row Level Security (RLS) policies for data access control.

## Core Entities

### Companies (`companies`)
**Purpose**: Multi-tenant organization data

**Key Fields:**
- `id`: UUID primary key
- `name`: Company name
- `email`: Contact email
- `phone`: Contact phone
- `address`: Physical address
- `logo_url`: Company logo
- `created_at`, `updated_at`: Timestamps

**Relationships:**
- One-to-many with employees, departments, projects, etc.

### Employees (`employees`)
**Purpose**: User profiles and organizational structure

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key to companies
- `user_id`: Foreign key to auth.users
- `employee_id`: Unique employee identifier
- `full_name`: Employee full name
- `email`: Work email
- `phone`: Contact phone
- `avatar_url`: Profile picture
- `designation`: Job title
- `department_id`: Department assignment
- `role_name`: System role (ceo, hr_manager, team_lead, employee)
- `date_of_birth`: DOB
- `date_of_joining`: Employment start date
- `salary`: Base salary
- `status`: Employment status
- `created_at`, `updated_at`: Timestamps

**Relationships:**
- Belongs to company and department
- Has many evaluations, daily_evaluations, payroll records
- Referenced in projects, loans, etc.

### Departments (`departments`)
**Purpose**: Organizational structure

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `name`: Department name
- `description`: Department description
- `head_employee_id`: Department head
- `created_at`, `updated_at`: Timestamps

### Projects (`projects`)
**Purpose**: Project management and tracking

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `name`: Project name
- `description`: Project description
- `client_id`: Associated client
- `project_manager_id`: Project manager
- `start_date`, `end_date`: Project timeline
- `budget`: Project budget
- `status`: Project status
- `created_at`, `updated_at`: Timestamps

**Relationships:**
- Belongs to company and client
- Has many project_assignments (employees assigned to project)

### Clients (`clients`)
**Purpose**: Client relationship management

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `name`: Client name
- `email`: Contact email
- `phone`: Contact phone
- `address`: Billing address
- `contact_person`: Primary contact
- `created_at`, `updated_at`: Timestamps

### Invoices (`invoices`)
**Purpose**: Invoice generation and tracking

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `client_id`: Foreign key
- `project_id`: Associated project
- `invoice_number`: Unique invoice number
- `issue_date`: Invoice date
- `due_date`: Payment due date
- `total_amount`: Invoice total
- `status`: Payment status
- `notes`: Additional notes
- `created_at`, `updated_at`: Timestamps

**Relationships:**
- Belongs to company, client, and project
- Has many invoice_items

### Invoice Items (`invoice_items`)
**Purpose**: Line items for invoices

**Key Fields:**
- `id`: UUID primary key
- `invoice_id`: Foreign key
- `description`: Item description
- `quantity`: Item quantity
- `rate`: Unit rate
- `amount`: Line total

### HR Policies (`hr_policies`)
**Purpose**: Company policy documents

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `title`: Policy title
- `content`: Rich text content (HTML)
- `category`: Policy category
- `is_active`: Publication status
- `created_by`: Author employee ID
- `created_at`, `updated_at`: Timestamps

### Evaluations (`evaluations`)
**Purpose**: Quarterly performance reviews

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `employee_id`: Foreign key (reviewee)
- `evaluated_by`: Foreign key (reviewer)
- `period`: Evaluation period (Q1, Q2, etc.)
- `overall_score`: Numeric score (1-5)
- `comments`: Review comments
- `recommendation`: Manager recommendation
- `created_at`, `updated_at`: Timestamps

### Daily Evaluations (`daily_evaluations`)
**Purpose**: Daily feedback system

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `reviewer_id`: Foreign key (who gave feedback)
- `reviewee_id`: Foreign key (who received feedback)
- `date`: Evaluation date
- `direction`: Feedback direction (upward/downward/peer)
- `overall_score`: Numeric score (1-5)
- `remarks`: Feedback comments
- `created_at`: Timestamp

### Loans (`loans`)
**Purpose**: Employee loan management

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `employee_id`: Foreign key
- `loan_type`: Type of loan
- `principal_amount`: Loan amount
- `interest_rate`: Annual interest rate
- `term_months`: Loan term
- `monthly_payment`: Calculated monthly payment
- `remaining_balance`: Current balance
- `status`: Loan status
- `created_at`, `updated_at`: Timestamps

### Payroll (`payroll`)
**Purpose**: Salary and payroll management

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `employee_id`: Foreign key
- `pay_period`: Payroll period
- `basic_salary`: Base salary
- `allowances`: Additional allowances
- `deductions`: Tax and other deductions
- `net_salary`: Final amount
- `status`: Processing status
- `created_at`, `updated_at`: Timestamps

### Public Holidays (`public_holidays`)
**Purpose**: Holiday calendar management

**Key Fields:**
- `id`: UUID primary key
- `company_id`: Foreign key
- `name`: Holiday name
- `date`: Holiday date
- `is_recurring`: Annual recurrence
- `created_at`, `updated_at`: Timestamps

## Database Relationships

### Entity Relationship Diagram (ERD)

```
companies (1) ──── (many) employees
    │                      │
    │                      │
    ├─── (many) departments│
    │                      │
    ├─── (many) projects ──┼─── (many) project_assignments
    │           │          │
    ├─── (many) clients ───┼─── (many) invoices
    │                      │           │
    ├─── (many) hr_policies│           └─── (many) invoice_items
    │                      │
    ├─── (many) evaluations│
    │                      │
    ├─── (many) daily_evaluations
    │
    ├─── (many) loans
    │
    ├─── (many) payroll
    │
    └─── (many) public_holidays
```

## Key Relationships & Constraints

### Multi-Tenant Architecture
- All major entities include `company_id` for data isolation
- Row Level Security policies enforce company data access
- Foreign key constraints maintain referential integrity

### User Authentication
- `employees.user_id` links to Supabase `auth.users`
- Authentication handled by Supabase Auth
- JWT tokens for API access

### Organizational Hierarchy
- Employees belong to departments
- Department heads are designated employees
- Role-based permissions control access

### Project Management
- Projects link clients and employees
- Project assignments track resource allocation
- Invoices generated from project work

### Evaluation System
- Quarterly evaluations: Formal performance reviews
- Daily evaluations: Continuous feedback
- Role-based visibility (managers see more data)

## Database Migrations

The system uses 20 Supabase migrations to build the complete schema:

1. **Initial Setup**: Companies, employees, departments
2. **Project Management**: Projects, clients, assignments
3. **Financial**: Invoices, invoice items
4. **HR Core**: HR policies, evaluations
5. **Advanced Features**: Daily evaluations, loans, payroll
6. **Refinements**: Public holidays, additional fields

## Row Level Security (RLS) Policies

### Security Model
- **Company Isolation**: Users can only access their company's data
- **Role-Based Access**: Different permissions for different roles
- **Data Ownership**: Users can access data they're authorized to see

### Example Policies
```sql
-- Company data isolation
CREATE POLICY "company_isolation" ON employees
FOR ALL USING (company_id = get_current_company_id());

-- Role-based evaluation access
CREATE POLICY "evaluation_visibility" ON evaluations
FOR SELECT USING (
  employee_id = auth.uid() OR
  evaluated_by = auth.uid() OR
  EXISTS (SELECT 1 FROM employees WHERE id = auth.uid() AND role_name IN ('hr_manager', 'ceo'))
);
```

## Database Performance

### Indexing Strategy
- Primary keys automatically indexed
- Foreign key columns indexed
- Composite indexes for common query patterns
- Date-based indexes for time-range queries

### Query Optimization
- Efficient JOIN operations
- Proper use of WHERE clauses
- Pagination for large result sets
- Cached queries where appropriate

## Data Integrity

### Constraints
- NOT NULL constraints on required fields
- Foreign key constraints for referential integrity
- Unique constraints on business keys
- Check constraints for data validation

### Data Types
- UUID for primary keys
- TIMESTAMP WITH TIME ZONE for dates
- DECIMAL for monetary values
- TEXT for flexible content fields
- JSONB for structured data where needed

## Backup & Recovery

### Supabase Features
- Automatic backups
- Point-in-time recovery
- Database exports
- Migration-based schema versioning

### Data Export
- CSV export for reports
- PDF generation for documents
- API access for integrations

This database schema provides a comprehensive foundation for the HR management system with proper relationships, security, and scalability considerations.