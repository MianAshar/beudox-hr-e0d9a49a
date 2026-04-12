<!--
generated_by: tessera
source_sha: 6d9cda64cd9334845b3c6f8814a62912f7001638
generated_at: 2026-04-12T19:40:18.918Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This system provides organizations with tools to manage employees, projects, evaluations, payroll, leave management, and more.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Leave Management**: Request, approve, and track employee leave balances and requests
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback
- **Payroll Management**: Automated payroll processing, payslip generation, and financial reporting
- **HR Policies**: Create and manage company policies with rich text editing

### Project & Client Management
- **Project Tracking**: Manage project lifecycle, assignments, and progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and track invoices for client billing

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Settings Management**: Configure company settings, departments, leave types, and more
- **Public Holidays**: Manage company-wide holiday schedules
- **Loan Management**: Track employee loans and repayments

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editing**: TipTap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
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
   
   If using Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (default Vite port)

### Build for Production

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
├── test/               # Test files
└── main.tsx            # Application entry point
```

## Authentication & Authorization

The application uses Supabase for authentication with role-based access control:

- **CEO**: Full access to all features
- **HR Manager**: Access to HR functions, employee management, evaluations
- **Team Lead**: Limited access to team-related features and evaluations
- **Employee**: Access to personal data, leave requests, payslips

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.