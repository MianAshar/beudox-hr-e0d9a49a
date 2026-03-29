<!--
generated_by: tessera
source_sha: e27de79f84391ef9d477229b9416249cc2eef19c
generated_at: 2026-03-29T23:35:01.222Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track attendance, handle payroll, and oversee various HR operations through a secure, role-based interface.

## Features

### Core HR Management
- **Employee Management**: Add, view, edit, and manage employee profiles with role-based access
- **Attendance Tracking**: Monitor employee attendance and time management
- **Leave Management**: Handle vacation requests and leave policies
- **Public Holidays**: Manage company-wide holiday schedules

### Finance & Payroll
- **Payroll Processing**: Calculate and manage employee salaries
- **Finance Sheet**: Track financial data and reports
- **Loans Management**: Handle employee loan applications and repayments
- **Office Expenses**: Track and categorize business expenses
- **Outsourcing**: Manage external contractor relationships

### Project & Performance
- **Project Management**: Oversee company projects and assignments
- **Employee Evaluations**: Conduct performance reviews and assessments
- **HR Policies**: Maintain and distribute company policies

### System Features
- **Notifications**: Real-time alerts and announcements
- **Settings**: Configure system preferences and user settings
- **Role-Based Access Control**: Secure access with hierarchical permissions

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui (Radix UI primitives), Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest, Playwright

## User Roles & Permissions

- **CEO**: Full system access
- **HR Manager**: Employee management, attendance, leave, policies, settings
- **Finance Manager**: Payroll, finance, expenses, loans, outsourcing
- **Team Lead**: Attendance, projects, evaluations
- **Employee**: Dashboard, attendance, projects, notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and update the Supabase configuration if needed.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── test/               # Test files
```

## Database Schema

The application uses Supabase with PostgreSQL. Key tables include:

- **employees**: Employee profiles and information
- **companies**: Company/organization data
- **roles**: User roles and permissions
- **employee_roles**: Role assignments for employees

Row Level Security (RLS) policies ensure data access is restricted based on user roles and company membership.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## License

This project is private and proprietary to Beudox.