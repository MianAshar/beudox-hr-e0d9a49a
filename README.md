<!--
generated_by: tessera
source_sha: 7cd56bd223f184273f03b6c7372dbc65d79d4bbd
generated_at: 2026-04-19T21:21:09.441Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern React frontend application. Beudox HR provides tools for employee management, evaluations, leave tracking, payroll processing, finance summaries, and more.

## Features

- **Employee Management**: Searchable employee selection, profiles, and role-based access
- **Evaluations**: Quarterly and daily performance evaluations with timelines
- **Leave Management**: Apply for leave, track balances, and manage requests
- **Payroll**: Generate and view payroll records with overtime and bonuses
- **Finance**: Monthly expense tracking and financial summaries with trend analysis
- **HR Policies**: Rich text editor for policy management
- **Settings**: Configure departments, roles, leave types, expense categories, and more

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Setup and Installation

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

3. **Environment Configuration**
   
   Copy the `.env` file and ensure the following variables are set:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components (sidebar, topbar, etc.)
│   ├── evaluations/    # Evaluation-related components
│   ├── finance/        # Finance dashboard components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── profile/        # User profile components
│   ├── projects/       # Project management components
│   ├── settings/       # Admin settings components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components (Next.js-style routing)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase configuration
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **EvaluationTimeline**: Displays evaluation history for employees
- **FinanceSummary**: Financial dashboard with charts and metrics
- **SearchableEmployeeSelect**: Employee selection component with search
- **BeudoxLogo**: Brand logo component with variant support

## Development

- **Linting**: ESLint configuration
- **Testing**: Vitest for unit tests
- **Type Checking**: TypeScript strict mode
- **Code Formatting**: Prettier (via ESLint)

## Contributing

1. Follow the existing code style and TypeScript types
2. Add tests for new features
3. Update documentation as needed
4. Ensure all components are accessible and responsive

## License

This project is proprietary software for Beudox HR.