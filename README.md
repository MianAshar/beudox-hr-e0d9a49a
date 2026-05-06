<!--
generated_by: tessera
source_sha: 3929819abf0e12b9f52e71b3a47fb8eb6bac72e3
generated_at: 2026-05-06T15:19:33.829Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built with modern web technologies. This application provides a complete suite of HR tools for managing employees, attendance, payroll, leave, evaluations, projects, and more.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Attendance Tracking**: Automated attendance recording with analytics and reporting
- **Leave Management**: Request, approve, and track various types of leave
- **Payroll Processing**: Automated payroll calculations and payslip generation
- **Performance Evaluations**: Regular and daily performance assessments
- **Project Management**: Project tracking, task management, and team assignments
- **Finance & Invoicing**: Client management, invoice generation, and financial reporting
- **HR Policies**: Document management and policy administration
- **Settings & Configuration**: Company settings, roles, departments, and system configuration

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text Editor**: Tiptap
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or bun

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
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   Copy `.env` and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key

4. Run database migrations:
   The application uses Supabase migrations. Ensure your Supabase project has the migrations applied from the `supabase/migrations/` directory.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Testing

Run unit tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run E2E tests:
```bash
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── config.toml        # Supabase configuration
```

## Authentication & Authorization

The application uses role-based access control with the following user roles:
- Admin: Full system access
- HR Manager: HR-related functions
- Manager: Team management
- Employee: Limited access to personal data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.