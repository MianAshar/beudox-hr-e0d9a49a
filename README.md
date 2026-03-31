<!--
generated_by: tessera
source_sha: 40b00ee682691bbcef30c51375cf535d551e0a81
generated_at: 2026-03-31T22:19:40.175Z
action: update
-->

# Beudox HR Management System

A modern, role-based HR management web application built with React, TypeScript, and Supabase. This frontend application provides a comprehensive interface for managing employees, attendance, payroll, and other HR functions.

## Features

- **Role-Based Access Control**: Supports multiple user roles (Employee, HR Manager, Finance Manager, Team Lead, CEO) with granular permissions
- **Employee Management**: Add, view, edit, and manage employee profiles
- **Dashboard**: Overview of key HR metrics and activities
- **Authentication**: Secure login with Supabase Auth, including password reset and invite flows
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components for a modern, mobile-friendly interface

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui (Radix UI primitives) with Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Auth, Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest with Testing Library
- **E2E Testing**: Playwright

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
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_URL`: Your Supabase project URL

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npx playwright test
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (AppLayout, AppSidebar, TopBar)
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   └── ...               # Feature-specific components
├── hooks/               # Custom React hooks (useAuth, useToast)
├── lib/                 # Utilities and configurations
├── pages/               # Route components
├── integrations/        # External service integrations (Supabase)
└── test/                # Test utilities
```

## Available Routes

- `/` - Root (redirects to dashboard or login)
- `/login` - User login
- `/forgot-password` - Password reset request
- `/dashboard` - Main dashboard
- `/employees` - Employee list
- `/employees/new` - Add new employee
- `/employees/:id` - Employee profile
- `/employees/:id/edit` - Edit employee

## User Roles and Permissions

- **CEO**: Full access to all features
- **HR Manager**: Employee management, attendance, leave, projects, evaluations, HR policies
- **Finance Manager**: Payroll, finance, loans, expenses, outsourcing
- **Team Lead**: Attendance, projects, evaluations
- **Employee**: Basic dashboard, attendance, projects

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is private and proprietary.