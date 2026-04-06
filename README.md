<!--
generated_by: tessera
source_sha: b682541668f611dce32bdef9e919667a2a1bcf76
generated_at: 2026-04-06T20:52:50.112Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR provides organizations with tools to manage employees, payroll, projects, clients, and HR policies in a unified, user-friendly interface.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and personnel records
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation, sick leave, and other time-off requests
- **Payroll Processing**: Calculate salaries, manage payroll cycles, and generate payslips

### Financial Management
- **Invoice Management**: Create, send, and track invoices for clients
- **Expense Tracking**: Monitor office expenses and reimbursements
- **Loan Management**: Handle employee loans and repayments
- **Financial Reporting**: Comprehensive finance sheets and analytics

### Project & Client Management
- **Project Tracking**: Manage project lifecycle from initiation to completion
- **Client Relationships**: Maintain client information and project associations
- **Evaluations**: Performance reviews and employee assessments

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Public Holidays**: Configure and manage holiday calendars
- **Settings**: Company configuration, departments, roles, and system settings
- **Notifications**: System-wide notification management

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Radix UI, Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack React Query
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editing**: Tiptap
- **Charts & Analytics**: Recharts
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

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
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for backend services. Database migrations are located in the `supabase/migrations/` directory. Run migrations in your Supabase project to set up the required tables and functions.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings-specific components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses role-based access control. User roles determine which features and pages are accessible. Authentication is handled through Supabase Auth with support for email/password login and password reset flows.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.