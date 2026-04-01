<!--
generated_by: tessera
source_sha: 5aebaecd8c9b67e13aeaee27a5b7635b4ec60fe1
generated_at: 2026-04-01T00:01:56.844Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track attendance, handle payroll, manage projects, and oversee various HR operations.

## Features

### Core HR Modules
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests, sick leave, and other time-off policies
- **Payroll Processing**: Calculate and manage employee salaries and benefits
- **Finance Management**: Track office expenses, loans, and financial reports

### Project & Client Management
- **Project Management**: Create and manage projects with team assignments
- **Client Relations**: Maintain client information and project associations
- **Evaluations**: Performance reviews and employee assessments

### Administrative Features
- **Public Holidays**: Configure and manage company holiday schedules
- **HR Policies**: Document and manage company policies
- **Notifications**: System-wide notification management
- **Settings**: Configure system preferences and user roles

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest + Playwright

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
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

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

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application uses Supabase for authentication with role-based access control. User roles determine access to different modules and features.

## Database

The application uses Supabase as the backend, which includes:
- PostgreSQL database
- Real-time subscriptions
- Row Level Security (RLS)
- Edge Functions for serverless operations

Database migrations are located in `supabase/migrations/`.

## Testing

Run tests with:
```bash
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
```

End-to-end tests use Playwright:
```bash
npx playwright test
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is private and proprietary to Beudox.