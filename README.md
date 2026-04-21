<!--
generated_by: tessera
source_sha: ddc605df0c867b706d221a4a583de67a59941a41
generated_at: 2026-04-21T09:51:25.537Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, project tracking, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Profile Management**: Detailed employee profiles with personal information, roles, and history

### Performance & Evaluation
- **Quarterly Evaluations**: Bi-annual performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with filtering by role permissions

### Time & Attendance
- **Leave Management**: Request, approve, and track various leave types
- **Attendance Tracking**: Monitor employee attendance patterns
- **Public Holidays**: Manage company-wide holiday schedules

### Financial Management
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Expense Tracking**: Monitor monthly operational expenses
- **Finance Dashboard**: Visual analytics for payroll and expense trends
- **Loan Management**: Track employee loans and deductions

### Project Management
- **Project Tracking**: Create and manage projects with team assignments
- **Client Management**: Maintain client relationships and project associations
- **Task Management**: Assign and track project tasks
- **Project Activity Logs**: Audit trail of project changes

### Document Management
- **HR Policies**: Create and manage company policies with rich text editing
- **Job Descriptions**: Maintain detailed job descriptions and requirements
- **Invoice Generation**: Automated invoice creation with PDF export

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Rich Text**: Tiptap
- **Testing**: Vitest + Playwright

## Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**
   ```bash
   npm install
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

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

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
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application uses Supabase Auth for authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations, employee management, evaluations
- **Team Lead**: Team management, evaluations for team members
- **Employee**: Personal profile, leave requests, evaluations

## Key Components

### Layout System
- `AppLayout`: Main application layout with sidebar navigation
- `AppSidebar`: Responsive sidebar with role-based menu items
- `TopBar`: Header with notifications and user menu

### Data Management
- Uses React Query for server state management
- Supabase client configured in `src/integrations/supabase/client.ts`
- Type-safe database operations with generated types

### UI Components
- Extensive use of shadcn/ui components for consistent design
- Custom components for complex interactions (SearchableEmployeeSelect, EvaluationTimeline, etc.)
- Responsive design with Tailwind CSS

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all linting passes

## License

This project is proprietary software. All rights reserved.