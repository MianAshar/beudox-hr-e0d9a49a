<!--
generated_by: tessera
source_sha: 91a7ddffb5c8bb2e9463683161eacd0d041403f9
generated_at: 2026-04-12T19:31:32.730Z
action: create
-->

# Database Documentation

## Schema Overview

The Beudox HR system uses PostgreSQL via Supabase with 23 migration files representing the evolution of the database schema. The database follows a relational model with proper normalization and implements Row Level Security (RLS) for data protection.

## Core Tables

### employees
**Purpose**: Stores all employee information and organizational relationships

**Key Columns**:
- `id` (uuid, primary key)
- `email` (text, unique) - Login email
- `full_name` (text) - Display name
- `avatar_url` (text) - Profile picture URL
- `role_name` (text) - Access role (employee, hr_manager, finance_manager, team_lead, ceo)
- `department_id` (uuid, foreign key) - Department assignment
- `designation` (text) - Job title
- `employee_id` (text, unique) - Company employee number
- `hire_date` (date) - Employment start date
- `salary` (numeric) - Base salary
- `status` (text) - Employment status (active, inactive)

**Relationships**:
- Belongs to: departments
- Has many: evaluations, daily_evaluations, leave_requests, project_assignments

### departments
**Purpose**: Organizational structure and reporting hierarchy

**Key Columns**:
- `id` (uuid, primary key)
- `name` (text) - Department name
- `description` (text) - Department purpose
- `manager_id` (uuid, foreign key) - Department head
- `company_id` (uuid) - Multi-tenant support

### evaluations
**Purpose**: Formal quarterly performance reviews

**Key Columns**:
- `id` (uuid, primary key)
- `employee_id` (uuid, foreign key) - Review subject
- `evaluator_id` (uuid, foreign key) - Review author
- `company_id` (uuid) - Tenant isolation
- `period` (text) - Quarter (Q1, Q2, Q3, Q4)
- `overall_score` (numeric) - 1-5 rating
- `comments` (text) - Detailed feedback
- `recommendation` (text) - HR recommendations (salary, promotion, etc.)
- `created_at` (timestamp) - Review date

**Relationships**:
- Belongs to: employees (reviewee and evaluator)

### daily_evaluations
**Purpose**: Peer feedback and daily performance notes

**Key Columns**:
- `id` (uuid, primary key)
- `reviewer_id` (uuid, foreign key) - Feedback giver
- `reviewee_id` (uuid, foreign key) - Feedback receiver
- `company_id` (uuid) - Tenant isolation
- `direction` (text) - Feedback type (positive, constructive, neutral)
- `date` (date) - Feedback date
- `overall_score` (numeric) - 1-5 rating
- `remarks` (text) - Feedback content

### leave_requests
**Purpose**: Time-off request management

**Key Columns**:
- `id` (uuid, primary key)
- `employee_id` (uuid, foreign key) - Requesting employee
- `leave_type_id` (uuid, foreign key) - Type of leave
- `start_date` (date) - Leave start
- `end_date` (date) - Leave end
- `reason` (text) - Leave justification
- `status` (text) - Request status (pending, approved, rejected)
- `approved_by` (uuid, foreign key) - Approving manager
- `created_at` (timestamp) - Request date

### leave_types
**Purpose**: Configurable leave categories

**Key Columns**:
- `id` (uuid, primary key)
- `name` (text) - Leave type name (Annual, Sick, Maternity, etc.)
- `days_allowed` (integer) - Annual entitlement
- `requires_approval` (boolean) - Approval workflow flag
- `color` (text) - UI color coding

### leave_balances
**Purpose**: Employee leave entitlement tracking

**Key Columns**:
- `id` (uuid, primary key)
- `employee_id` (uuid, foreign key)
- `leave_type_id` (uuid, foreign key)
- `year` (integer) - Balance year
- `total_days` (numeric) - Annual allocation
- `used_days` (numeric) - Days taken
- `remaining_days` (numeric) - Available balance

### projects
**Purpose**: Project management and tracking

**Key Columns**:
- `id` (uuid, primary key)
- `name` (text) - Project name
- `description` (text) - Project details
- `client_id` (uuid, foreign key) - Associated client
- `project_manager_id` (uuid, foreign key) - Project lead
- `start_date` (date) - Project start
- `end_date` (date) - Project end
- `status` (text) - Project status (planning, active, completed, on_hold)
- `budget` (numeric) - Project budget
- `company_id` (uuid) - Tenant isolation

### project_assignments
**Purpose**: Employee-project relationships

**Key Columns**:
- `id` (uuid, primary key)
- `project_id` (uuid, foreign key)
- `employee_id` (uuid, foreign key)
- `role` (text) - Project role (developer, designer, etc.)
- `allocation_percentage` (numeric) - Time allocation
- `start_date` (date) - Assignment start
- `end_date` (date) - Assignment end

### clients
**Purpose**: Client relationship management

**Key Columns**:
- `id` (uuid, primary key)
- `name` (text) - Client company name
- `contact_person` (text) - Primary contact
- `email` (text) - Contact email
- `phone` (text) - Contact phone
- `address` (text) - Client address
- `company_id` (uuid) - Tenant isolation

### invoices
**Purpose**: Client billing and payment tracking

**Key Columns**:
- `id` (uuid, primary key)
- `project_id` (uuid, foreign key) - Billed project
- `invoice_number` (text) - Unique invoice number
- `amount` (numeric) - Invoice amount
- `status` (text) - Payment status (draft, sent, paid, overdue)
- `issue_date` (date) - Invoice date
- `due_date` (date) - Payment due date
- `paid_date` (date) - Payment received date

### payroll
**Purpose**: Salary processing and attendance integration

**Key Columns**:
- `id` (uuid, primary key)
- `employee_id` (uuid, foreign key)
- `month` (integer) - Payroll month
- `year` (integer) - Payroll year
- `basic_salary` (numeric) - Base pay
- `allowances` (numeric) - Additional pay
- `deductions` (numeric) - Tax and other deductions
- `net_pay` (numeric) - Final amount
- `status` (text) - Processing status

### hr_policies
**Purpose**: Document storage for HR policies

**Key Columns**:
- `id` (uuid, primary key)
- `title` (text) - Policy title
- `content` (text) - HTML content
- `category` (text) - Policy category
- `is_active` (boolean) - Publication status
- `created_by` (uuid, foreign key) - Author
- `created_at` (timestamp) - Creation date
- `updated_at` (timestamp) - Last modification

### notifications
**Purpose**: System and user notifications

**Key Columns**:
- `id` (uuid, primary key)
- `recipient_id` (uuid, foreign key) - Target user
- `sender_id` (uuid, foreign key) - Notification source
- `type` (text) - Notification type
- `title` (text) - Notification title
- `message` (text) - Notification content
- `is_read` (boolean) - Read status
- `created_at` (timestamp) - Notification time
- `action_url` (text) - Related page URL

## Database Relationships

### One-to-Many Relationships
- departments → employees (one department, many employees)
- employees → evaluations (one employee, many evaluations as reviewee)
- employees → daily_evaluations (one employee, many evaluations as reviewer/reviewee)
- employees → leave_requests (one employee, many leave requests)
- leave_types → leave_requests (one type, many requests)
- projects → project_assignments (one project, many assignments)
- clients → projects (one client, many projects)
- projects → invoices (one project, many invoices)
- employees → payroll (one employee, many payroll records)

### Many-to-Many Relationships
- employees ↔ projects (via project_assignments table)

### Self-Referencing Relationships
- employees.manager_id → employees.id (reporting hierarchy)
- departments.manager_id → employees.id (department heads)

## Indexes and Performance

### Primary Indexes
All tables have primary key indexes on `id` columns

### Foreign Key Indexes
Foreign key columns are indexed for join performance:
- `employees.department_id`
- `evaluations.employee_id`, `evaluations.evaluator_id`
- `leave_requests.employee_id`, `leave_requests.leave_type_id`
- `project_assignments.project_id`, `project_assignments.employee_id`

### Query-Specific Indexes
- `employees.email` (unique constraint)
- `employees.employee_id` (unique constraint)
- `evaluations.created_at` (for timeline queries)
- `daily_evaluations.date` (for date range queries)
- `leave_requests.status` (for approval workflow)

## Row Level Security (RLS)

### Security Policies

All tables implement RLS with company-based isolation:

```sql
-- Example: Employees table RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view employees in their company" ON employees
FOR SELECT USING (company_id = get_current_company_id());

CREATE POLICY "HR managers can manage employees" ON employees
FOR ALL USING (
  company_id = get_current_company_id() AND
  get_current_user_role() IN ('hr_manager', 'ceo')
);
```

### Access Patterns
- **Company Isolation**: Users can only access data from their company
- **Role-Based Access**: Different permissions for different roles
- **Hierarchical Access**: Managers can access their team's data
- **Self Access**: Employees can access their own records

## Data Integrity

### Constraints
- Primary key constraints on all tables
- Foreign key constraints maintaining referential integrity
- Unique constraints on email and employee_id
- Check constraints on status fields and numeric ranges
- Not null constraints on required fields

### Triggers
- Updated timestamp triggers for audit trails
- Balance calculation triggers for leave management
- Notification triggers for workflow events

## Migration Strategy

### Migration Files
The database evolved through 23 migrations:
- Initial schema creation
- Feature additions (evaluations, leave management)
- Relationship enhancements
- Performance optimizations
- Security policy implementations
- Data type refinements

### Migration Best Practices
- Incremental changes
- Backward compatibility
- Rollback capabilities
- Data migration scripts
- Testing in staging environments

## Backup and Recovery

### Automated Backups
- Daily database snapshots
- Point-in-time recovery
- Cross-region replication

### Data Export
- CSV export for reporting
- JSON export for API integration
- Encrypted backups for compliance

This database schema provides a robust foundation for the HR management system with proper normalization, security, and performance optimizations.