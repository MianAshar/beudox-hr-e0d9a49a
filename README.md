<!--
generated_by: tessera
source_sha: 1b74217db34b59fbc80f9bd1c1f0ed89be51b4a5
generated_at: 2026-04-29T22:27:03.116Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React application. This portal enables companies to manage employees, track attendance, handle leave requests, process payroll, conduct evaluations, and oversee various HR operations through an intuitive web interface.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Attendance Tracking**: Automated attendance import from Excel files with AI-powered parsing, real-time tracking, and reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Generate payslips, manage salaries, bonuses, and deductions
- **Performance Evaluations**: Conduct regular and daily evaluations with customizable parameters

### Additional Modules
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices
- **HR Policies**: Create and maintain company policies with rich text editing
- **Job Descriptions**: Manage position descriptions and requirements
- **Finance Overview**: Monitor company financial metrics and expenses
- **Loan Management**: Track employee loans and repayments

### Administrative Features
- **Role-Based Access Control**: Granular permissions system for different user roles
- **Company Settings**: Configure attendance rules, leave types, evaluation parameters
- **Public Holidays**: Manage company-wide holiday schedules
- **Audit Logs**: Track login activity and system changes

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library built on Radix UI primitives
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation for forms

### Backend & Infrastructure
- **Supabase** for backend-as-a-service (authentication, database, real-time subscriptions, edge functions)
- **PostgreSQL** database with comprehensive schema for HR data
- **Supabase Edge Functions** for server-side processing (AI attendance parsing, PDF generation)

### Development Tools
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** and **TypeScript** for code quality
- **Tailwind CSS** with custom configuration

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
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
   ```

3. **Environment Setup**
   
   Copy the `.env` file and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order to set up the database schema.

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-specific components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Route components/pages
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
│   ├── utils.ts        # General utilities
│   ├── role-access.ts  # Permission logic
│   ├── attendance-format.ts # Attendance formatting
│   └── ...
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── types/              # TypeScript type definitions
```

## Key Components

### Authentication Flow
- Login with email/password
- Mandatory password change on first login
- Role-based route protection
- Session management with Supabase Auth

### Attendance Upload
- Excel file upload with AI parsing using GPT
- Support for ZKTeco-style attendance exports
- Automatic calculation of working hours, overtime, and late arrivals
- Batch import with conflict resolution

### Data Management
- Real-time data synchronization with Supabase
- Optimistic updates with TanStack Query
- Comprehensive error handling and loading states

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.