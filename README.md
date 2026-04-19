<!--
generated_by: tessera
source_sha: 5bfa2e413d2c0629147e392ed5378a2266016f80
generated_at: 2026-04-19T21:13:44.177Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track performance, handle payroll, manage leave requests, and oversee various HR operations through an intuitive web interface.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profile management, and offboarding
- **Role-Based Access Control**: Granular permissions system with roles like CEO, HR Manager, Team Lead, and Employee
- **Organization Structure**: Departments, roles, and hierarchical management

### Performance & Evaluations
- **Quarterly Evaluations**: Bi-annual performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous performance tracking
- **Evaluation Timeline**: Historical view of all evaluations with filtering based on user roles

### Leave & Time Management
- **Leave Requests**: Comprehensive leave management system with approval workflows
- **Leave Balances**: Real-time tracking of leave entitlements and usage
- **Public Holidays**: Centralized holiday management

### Financial Management
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Finance Dashboard**: Visual analytics for payroll and expense tracking
- **Expense Management**: Monthly expense tracking and reporting
- **Loan Management**: Employee loan tracking and deductions

### Project Management
- **Project Tracking**: Project lifecycle management with task assignments
- **Client Management**: Client relationship management
- **Invoice Generation**: Automated invoice creation and PDF generation

### Administrative Features
- **HR Policies**: Rich text policy documents with version control
- **Settings Management**: Configurable system settings (departments, leave types, evaluation parameters, etc.)
- **Notifications**: Automated email notifications for various HR events

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **TanStack Query** for efficient server state management
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library built on Radix UI primitives
- **Recharts** for data visualization
- **React Hook Form** with Zod validation for form handling

### Backend & Infrastructure
- **Supabase** for backend-as-a-service (authentication, database, real-time subscriptions, edge functions)
- **PostgreSQL** database with Supabase
- **Supabase Edge Functions** for server-side logic (payroll generation, notifications, etc.)

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** for code linting
- **TypeScript** for type checking

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   You can use the Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
├── test/               # Test files
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for server-side logic
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application uses Supabase Auth for authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

## Key Workflows

### Employee Onboarding
1. HR creates employee account via invitation
2. Employee sets password and completes profile
3. HR assigns role and department
4. Employee gains access based on role permissions

### Performance Management
1. Daily evaluations for continuous feedback
2. Quarterly evaluations for formal reviews
3. Managers can view evaluation history
4. HR oversees evaluation processes

### Payroll Processing
1. System calculates payroll based on attendance and overtime
2. HR reviews and approves payroll runs
3. Employees can view their payslips
4. Automated notifications for payroll events

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.