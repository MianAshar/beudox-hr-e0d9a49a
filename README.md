<!--
generated_by: tessera
source_sha: 99a40ba569414f43251b340331e742906aca530b
generated_at: 2026-05-06T15:45:53.734Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern web application. Beudox HR provides companies with tools to manage employees, track attendance, handle leave requests, process payroll, manage projects, and configure HR policies.

## Features

- **Employee Management**: Profile management, onboarding, and employee directory
- **Attendance Tracking**: Daily attendance records, overtime calculation, and analytics
- **Leave Management**: Leave requests, balances, and approval workflows
- **Payroll Processing**: Salary calculations, payslips, and payroll history
- **Project Management**: Team assignments, task tracking, and project activity logs
- **HR Policies**: Rich text policy documents and management
- **Finance Overview**: Financial summaries and expense tracking
- **Settings & Configuration**: Company settings, departments, roles, leave types, and more
- **Notifications**: Automated notifications for HR events
- **Reporting**: Comprehensive analytics and reporting dashboards

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with Shadcn/ui
- **State Management**: TanStack Query for server state, React Context for auth
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Rich Text**: Tiptap
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
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

4. Set up Supabase:
   
   The application uses Supabase for data storage. You'll need to:
   - Create a Supabase project
   - Run the database migrations located in `supabase/migrations/`
   - Configure authentication and storage as needed

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile components
│   ├── finance/        # Finance components
│   ├── hr-policies/    # HR policy components
│   ├── layout/         # Layout components (sidebar, topbar, etc.)
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── test/               # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is private and proprietary.