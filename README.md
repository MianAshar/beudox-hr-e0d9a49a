<!--
generated_by: tessera
source_sha: c3170ac3be14d8a64f3396e1e79f905f52fb9f93
generated_at: 2026-04-19T14:20:27.922Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources Management System designed to streamline HR operations for modern businesses. Built as a React-based frontend application, it provides a user-friendly interface for managing employee data, evaluations, payroll, leave requests, finance tracking, and more.

## Features

- **Employee Management**: Comprehensive employee profiles with searchable selection
- **Performance Evaluations**: Bi-annual and daily evaluation timelines with scoring and feedback
- **Payroll Management**: Automated payroll processing with overtime and bonus calculations
- **Leave Management**: Request and track leave balances across different leave types
- **Finance Dashboard**: Monthly expense tracking and financial summaries with trend analysis
- **Project Management**: Activity logging and task tracking for projects
- **HR Policies**: Rich text editor for creating and managing company policies
- **Settings Management**: Configurable company settings, departments, roles, and notifications

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database with real-time subscriptions)
- **Charts**: Recharts for data visualization
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Configured for modern web deployment

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
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase as its backend. The database schema includes tables for:

- Employees and user authentication
- Companies and organizational structure
- Evaluations (quarterly and daily)
- Payroll records and financial data
- Leave requests and balances
- Projects and tasks
- Expenses and finance tracking

Database migrations are located in the `supabase/migrations/` directory.

### Testing

Run unit tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── evaluations/    # Evaluation-related components
│   ├── finance/        # Financial dashboard components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings and configuration
│   └── hr-policies/    # HR policy components
├── pages/              # Page components (Next.js style routing)
├── lib/                # Utility functions and helpers
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **EvaluationTimeline**: Displays evaluation history with filtering
- **FinanceSummary**: Financial dashboard with charts and KPIs
- **SearchableEmployeeSelect**: Employee selection component with search
- **BeudoxLogo**: Brand logo component with variant support

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.