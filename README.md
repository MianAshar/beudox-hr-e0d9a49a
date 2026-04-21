<!--
generated_by: tessera
source_sha: e1a6e79ec4b2a6acf45767ecaf287fd256faaf2b
generated_at: 2026-04-21T09:07:11.748Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, payroll processing, leave tracking, performance evaluations, project management, and financial reporting for organizations.

## Features

- **Employee Management**: Complete employee profiles, role-based access control, and organizational structure
- **Payroll Processing**: Automated payroll calculations, overtime tracking, bonuses, and loan deductions
- **Leave Management**: Leave request workflows, balance tracking, and approval processes
- **Performance Evaluations**: Quarterly and daily evaluation systems with timeline tracking
- **Project Management**: Team assignments, activity logging, and project categorization
- **Financial Dashboard**: Real-time expense tracking and 6-month trend analysis
- **HR Policies**: Rich text policy management and documentation
- **Settings Management**: Configurable company settings, departments, roles, and categories

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Testing**: Vitest (unit tests) + Playwright (E2E tests)
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. Run database migrations:
   
   The Supabase migrations are included in the `supabase/migrations/` directory. Apply them to your Supabase project.

5. Start the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
bun run build
```

The built files will be in the `dist/` directory.

### Running Tests

- Unit tests: `bun run test`
- E2E tests: `bun run test:e2e`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── evaluations/    # Evaluation-related components
│   ├── finance/        # Financial dashboard components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings/configuration components
│   └── hr-policies/    # Policy management components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge Functions
```

## Architecture Overview

### Frontend Architecture

The application follows a component-based architecture with:

- **Layout Components**: `AppLayout`, `AppSidebar`, `TopBar` for consistent navigation
- **Feature Components**: Organized by domain (evaluations, finance, leave, etc.)
- **UI Components**: Reusable design system components from shadcn/ui
- **Custom Hooks**: For data fetching, authentication, and state management

### Routing Structure

The app uses React Router for client-side routing. Key routes include:

- `/` - Dashboard/Home page
- `/evaluations/*` - Evaluation management
- `/finance` - Financial dashboard
- `/leave/*` - Leave management
- `/payroll/*` - Payroll processing
- `/projects/*` - Project management
- `/settings/*` - System configuration

### Database Schema

The application uses Supabase with PostgreSQL. Key tables include:

- `employees` - Employee information and profiles
- `evaluations` - Performance evaluation records
- `daily_evaluations` - Daily feedback system
- `payroll_records` - Payroll processing data
- `leave_requests` - Leave management
- `projects` - Project information
- `monthly_expenses` - Financial tracking

### Authentication & Authorization

- **Authentication**: Supabase Auth for user management
- **Authorization**: Role-based access control with roles like `hr_manager`, `team_lead`, `ceo`, etc.
- **Permissions**: Component-level access control based on user roles

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run tests: `bun run test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## License

This project is proprietary software. All rights reserved.