<!--
generated_by: tessera
source_sha: d3ee89c6c673118cacc5e2e71f75043ea1d53924
generated_at: 2026-04-07T12:49:30.817Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies to streamline HR operations for small to medium-sized businesses.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal details, employment history, and organizational structure
- **Role-Based Access Control**: Granular permissions system with 5 user roles (Employee, HR Manager, Finance Manager, Team Lead, CEO)
- **Company Settings**: Multi-company support with customizable settings, departments, and policies

### Performance & Evaluation
- **Quarterly Evaluations**: Structured performance reviews with customizable parameters and scoring
- **Daily Evaluations**: Real-time feedback system for continuous performance tracking
- **Evaluation Parameters**: Configurable evaluation criteria with min/max scores and display ordering

### Project Management
- **Project Tracking**: Full project lifecycle management with client assignments and deadlines
- **Resource Allocation**: Employee assignment to projects with time tracking
- **Client Management**: Client database with contact information and billing details

### Financial Management
- **Invoice Generation**: Automated invoice creation with PDF generation and email delivery
- **Payroll Processing**: Comprehensive payroll system with salary calculations, overtime, and deductions
- **Expense Tracking**: Office expense management with approval workflows
- **Loan Management**: Employee loan tracking with monthly deductions

### Time & Attendance
- **Attendance Tracking**: Automated check-in/check-out with import capabilities
- **Leave Management**: Leave request system with approval workflows and balance tracking
- **Public Holidays**: Configurable holiday calendar management

### Document Management
- **HR Policies**: Rich text policy documents with version control
- **Document Library**: Centralized storage for HR documents and policies

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **React Query** for efficient server state management
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom design system
- **TipTap** rich text editor for policy documents
- **React Hook Form** with Zod validation for forms

### Backend & Database
- **Supabase** (PostgreSQL) for backend-as-a-service
- **Row Level Security (RLS)** for data access control
- **Real-time subscriptions** for live updates
- **Supabase Auth** for user authentication
- **Supabase Storage** for file uploads

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type checking
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **Bun** as package manager

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The database schema is automatically managed through Supabase migrations. The application expects the following tables to be present (see `supabase/migrations/` for the complete schema):
   
   - Core: `companies`, `employees`, `roles`, `employee_roles`
   - Evaluations: `evaluations`, `daily_evaluations`, `evaluation_parameters`
   - Projects: `projects`, `clients`, `project_assignments`
   - Finance: `invoices`, `payroll_records`, `loans`, `office_expenses`
   - Time: `attendance_records`, `leave_requests`, `public_holidays`
   - Documents: `hr_documents`

5. **Development Server**
   ```bash
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

6. **Build for Production**
   ```bash
   bun run build
   ```

### Testing

- **Unit Tests**: `bun run test`
- **E2E Tests**: Configure Playwright and run `npx playwright test`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings page components
│   ├── evaluations/    # Evaluation-related components
│   └── hr-policies/    # HR policy components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## User Roles & Permissions

1. **Employee**: Basic access to personal data, evaluations, and policies
2. **Team Lead**: Employee access plus team evaluation capabilities
3. **HR Manager**: Full employee management, evaluations, and HR operations
4. **Finance Manager**: Financial operations, payroll, and invoicing
5. **CEO**: Full system access with all permissions

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.