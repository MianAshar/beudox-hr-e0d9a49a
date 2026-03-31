<!--
generated_by: tessera
source_sha: 31af184409d257b5e5f8f357cba10d70c2c9aea4
generated_at: 2026-03-31T22:53:44.573Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This system provides organizations with tools to manage employees, track attendance, handle leave requests, process payroll, and maintain HR policies.

## Features

### People Management
- **Employee Management**: Add, view, edit, and manage employee profiles
- **Attendance Tracking**: Monitor employee attendance and time records
- **Leave Management**: Handle vacation requests, sick leave, and other time off
- **Public Holidays**: Manage company-wide holiday schedules

### Finance & Payroll
- **Payroll Processing**: Calculate and manage employee salaries
- **Finance Sheet**: Track financial data and reports
- **Loan Management**: Handle employee loan requests and repayments
- **Office Expenses**: Track and categorize business expenses
- **Outsourcing**: Manage external contractor relationships

### Work Management
- **Project Management**: Track project progress and assignments
- **Employee Evaluations**: Conduct performance reviews
- **HR Policies**: Maintain and distribute company policies

### System Features
- **Notifications**: System-wide messaging and alerts
- **Settings**: Configure application preferences
- **Role-based Access Control**: Secure access based on user roles

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with Playwright for E2E

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
   
   Copy `.env` and update the Supabase configuration with your project credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npx playwright test
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (AppLayout, AppSidebar, TopBar)
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   └── ...               # Feature-specific components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
├── integrations/        # External service integrations (Supabase)
└── test/                # Test files

supabase/
├── migrations/          # Database schema migrations
└── functions/           # Edge functions
```

## Authentication & Authorization

The application uses Supabase for authentication and implements role-based access control. User roles determine which features and pages are accessible.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is private and proprietary.