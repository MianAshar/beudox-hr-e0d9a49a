<!--
generated_by: tessera
source_sha: e495ea9f0a190729e3ac6b20bf6e08be47aab01d
generated_at: 2026-04-07T23:19:12.131Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete HR solution for managing employees, projects, clients, evaluations, payroll, and more.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and management
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Manage client relationships and details
- **Invoice Management**: Create, track, and manage invoices
- **HR Policies**: Rich text policy documents with full editing capabilities
- **Performance Evaluations**: Quarterly and daily evaluations with detailed feedback
- **Payroll Management**: Automated payroll processing and payslip generation
- **Loan Management**: Track employee loans and repayments
- **Finance Dashboard**: Comprehensive financial overview and reporting
- **Role-based Access Control**: Secure access based on user roles (HR Manager, CEO, Team Lead, Employee)
- **Responsive Design**: Modern, mobile-friendly interface

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editor**: Tiptap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## Installation

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

3. Create a `.env` file in the root directory with your Supabase credentials:
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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings-related components
│   └── ...             # Feature-specific components
├── pages/              # Page components for routing
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── ...
```

## Key Components

- **BeudoxLogo**: Brand logo component with variant support
- **SearchableEmployeeSelect**: Employee selection dropdown with search
- **EvaluationTimeline**: Timeline view of employee evaluations
- **RichTextEditor**: WYSIWYG editor for HR policies
- **AppLayout**: Main application layout with sidebar navigation

## Authentication & Authorization

The application uses Supabase for authentication and implements role-based access control with the following roles:

- **CEO**: Full access to all features
- **HR Manager**: Access to HR functions, evaluations, payroll
- **Team Lead**: Limited access to team management and evaluations
- **Employee**: Access to personal data and limited features

## Database Schema

The application uses Supabase with PostgreSQL. Key tables include:

- `employees` - Employee information
- `evaluations` - Quarterly performance evaluations
- `daily_evaluations` - Daily feedback
- `projects` - Project management
- `clients` - Client information
- `invoices` - Invoice management
- `hr_policies` - HR policy documents
- `payroll` - Payroll data
- `loans` - Employee loans

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is private and proprietary.