<!--
generated_by: tessera
source_sha: 1a02602ef1b6d5e3d6bfe9ed95973113e22aa666
generated_at: 2026-03-27T22:28:39.562Z
action: update
-->

# Beudox HR Management System

Beudox HR is a comprehensive Human Resources management application built for modern businesses. It provides tools for managing employees, tracking attendance, handling payroll, managing leave, and overseeing various HR-related operations.

## Features

### People Management
- **Employee Management**: Maintain employee records and profiles
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Public Holidays**: Manage and display public holiday schedules
- **Leave Management**: Handle employee leave requests and approvals

### Finance & Payroll
- **Payroll Processing**: Manage employee salaries and payroll cycles
- **Finance Sheet**: Financial reporting and analysis
- **Loans Management**: Track employee loans and repayments
- **Office Expenses**: Monitor and categorize office expenditures
- **Outsourcing**: Manage external contractor relationships

### Work Management
- **Projects**: Track project progress and assignments
- **Evaluations**: Employee performance evaluations
- **HR Policies**: Document and manage company policies

### System Features
- **Notifications**: System-wide notification management
- **Settings**: Application configuration and preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Backend**: Supabase (PostgreSQL database, authentication, real-time features)
- **Routing**: React Router DOM
- **State Management**: React hooks and context
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Code Quality**: ESLint for linting

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
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
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase as its backend. You'll need to:

1. Create a Supabase project
2. Run the database migrations located in `supabase/migrations/`
3. Configure authentication and RLS policies as needed

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── BeudoxLogo.tsx  # Logo component
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
├── lib/                # Utility functions
└── test/               # Test files
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software owned by Beudox.