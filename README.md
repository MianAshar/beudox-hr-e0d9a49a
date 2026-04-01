<!--
generated_by: tessera
source_sha: 49efd5789a2fd043e8337de3e55431c26077ebfc
generated_at: 2026-04-01T00:00:22.117Z
action: update
-->

# Beudox HR Management System

Beudox HR is a comprehensive web-based Human Resources management application designed to streamline employee management, project tracking, client relations, and organizational workflows for modern businesses.

## Features

### People Management
- **Employee Directory**: Complete employee profiles with personal and professional information
- **Attendance Tracking**: Monitor employee attendance and time management
- **Leave Management**: Handle vacation requests, sick leave, and time-off policies
- **Public Holidays**: Configure and manage company-wide holiday schedules

### Finance & Operations
- **Payroll Management**: Process salaries, bonuses, and compensation
- **Financial Reporting**: Track company expenses and financial metrics
- **Loan Management**: Handle employee loan requests and repayments
- **Office Expenses**: Monitor and categorize business expenses
- **Outsourcing**: Manage external vendor relationships and contracts

### Project & Client Management
- **Project Tracking**: Create, assign, and monitor project progress
- **Client Relations**: Maintain client information and project associations
- **Evaluations**: Performance reviews and employee assessments
- **HR Policies**: Document and manage company policies and procedures

### System Administration
- **Notifications**: System-wide announcements and alerts
- **Settings**: Configure application preferences and user roles
- **Role-Based Access Control**: Granular permissions based on user roles

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Testing**: Vitest for unit tests, Playwright for E2E tests

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
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. Start the development server:
   ```bash
   npm run dev
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

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Main layout components
│   │   ├── AppLayout.tsx
│   │   ├── AppSidebar.tsx
│   │   └── TopBar.tsx
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   └── BeudoxLogo.tsx   # Logo component
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── integrations/        # External service integrations
└── test/                # Test files

supabase/
├── migrations/          # Database schema migrations
├── functions/           # Edge functions for employee operations
└── config.toml          # Supabase configuration
```

## Authentication & Authorization

The application uses Supabase for authentication with role-based access control. User roles determine access to different sections of the application through the `canAccess` utility function.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is private and proprietary to Beudox.