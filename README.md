<!--
generated_by: tessera
source_sha: a3fee058d2cecde50bd4cbc8525ed9b5120feb14
generated_at: 2026-04-17T23:08:55.981Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies.

## Overview

Beudox HR is a full-featured HR management platform that helps organizations manage employees, leave requests, evaluations, payroll, projects, and more. The system supports multiple companies with role-based access control.

## Features

- **Employee Management**: Complete employee lifecycle management including profiles, roles, and departments
- **Leave Management**: Request, approve, and track leave balances and requests
- **Performance Evaluations**: Quarterly and daily evaluations with customizable parameters
- **Payroll Management**: Generate payslips, manage payroll cycles, and financial reporting
- **Project Management**: Track projects, assign team members, and manage client relationships
- **Invoice Management**: Create and manage client invoices with PDF generation
- **HR Policies**: Rich text policy documents with full formatting support
- **Loan Management**: Track employee loans and repayments
- **Attendance Tracking**: Monitor employee attendance and working hours
- **Notifications**: Automated notifications for important HR events
- **Multi-tenant**: Support for multiple companies with data isolation

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **shadcn/ui** + **Radix UI** for component library
- **Tailwind CSS** for styling
- **TipTap** for rich text editing
- **Recharts** for data visualization
- **React Hook Form** + **Zod** for form validation

### Backend
- **Supabase** (PostgreSQL database, Authentication, Storage, Edge Functions)
- **Row Level Security (RLS)** for data access control

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** + **TypeScript** for code quality

## User Roles

The system supports five user roles with different access levels:

- **CEO**: Full access to all features
- **HR Manager**: Employee management, leave, evaluations, policies, settings
- **Finance Manager**: Payroll, invoices, finance, expenses
- **Team Lead**: Project management, evaluations, team oversight
- **Employee**: Personal dashboard, leave requests, evaluations, payslips

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

3. Create a `.env` file with your Supabase credentials:
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

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase for data storage. You'll need to:

1. Create a Supabase project
2. Run the database migrations (located in `supabase/migrations/`)
3. Configure Row Level Security policies
4. Set up authentication providers if needed

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
│   ├── layout/         # App layout components
│   └── [feature]/      # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.