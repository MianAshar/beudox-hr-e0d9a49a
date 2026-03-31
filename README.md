<!--
generated_by: tessera
source_sha: b539e0ef426dc79227432acc6263ba638f91abbe
generated_at: 2026-03-31T22:18:34.119Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This system provides tools for managing employees, attendance, payroll, projects, evaluations, and more.

## Features

### Core HR Functions
- **Employee Management**: Add, edit, and view employee profiles with detailed information
- **Attendance Tracking**: Monitor employee check-in/check-out times, overtime, and absences
- **Leave Management**: Handle leave requests, balances, and approvals
- **Payroll Processing**: Calculate salaries, bonuses, deductions, and generate payroll records
- **Project Management**: Track projects, assignments, and client relationships
- **Performance Evaluations**: Conduct daily and periodic employee evaluations
- **Finance Management**: Handle loans, office expenses, and outsourcing records

### User Roles & Access Control
- **CEO**: Full access to all features
- **HR Manager**: Employee management, attendance, leave, projects, evaluations, policies
- **Finance Manager**: Payroll, finance, loans, expenses, outsourcing
- **Team Lead**: Dashboard, attendance, projects, evaluations
- **Employee**: Basic dashboard, attendance, projects, notifications

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

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

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8080`.

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
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── test/               # Test files
```

## Database Schema

The application uses a PostgreSQL database via Supabase with the following main entities:

- **companies**: Multi-tenant company information
- **employees**: Employee profiles and details
- **attendance_records**: Daily attendance tracking
- **payroll_records**: Monthly payroll calculations
- **projects**: Project management and assignments
- **leave_requests**: Leave management system
- **evaluations**: Performance evaluation system
- **notifications**: In-app notification system

## Authentication

The application uses Supabase Auth for user authentication with role-based access control. Users can log in via email/password or through invitation links.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is private and proprietary.