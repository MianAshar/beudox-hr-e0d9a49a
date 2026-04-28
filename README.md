<!--
generated_by: tessera
source_sha: 5ca44d02702b582c1f03f610449df00325d1ddee
generated_at: 2026-04-28T21:40:56.810Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application. This portal enables companies to manage employees, track attendance, handle leave requests, process payroll, manage projects, and maintain HR policies all in one place.

## Features

- **Employee Management**: Complete employee profiles with personal details, job information, and organizational structure
- **Attendance Tracking**: Automated attendance import from Excel files with AI-powered parsing, real-time tracking, and overtime calculations
- **Leave Management**: Request, approve, and track various types of leave with balance monitoring
- **Payroll Processing**: Generate payslips, manage salary structures, and handle payroll calculations
- **Project Management**: Track projects, assign team members, and monitor project activities
- **Finance & Invoicing**: Create and manage invoices, track expenses, and maintain financial records
- **HR Policies**: Create and manage company policies with rich text editing
- **Performance Evaluations**: Conduct regular and daily evaluations with customizable parameters
- **Settings & Configuration**: Company-wide settings for departments, roles, leave types, and more

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text Editor**: Tiptap
- **Testing**: Vitest + Playwright

## Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## Installation

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
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── employee-profile/  # Employee profile specific components
│   ├── attendance/     # Attendance management components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Auth for user authentication. Role-based access control is implemented to restrict access to different features based on user roles. New users are required to change their temporary password on first login.

## Database Schema

The application uses Supabase PostgreSQL with the following main entities:
- Employees
- Attendance Records
- Leave Requests
- Payroll Data
- Projects
- Invoices
- HR Policies
- Evaluations
- Company Settings

Database migrations are managed through Supabase and stored in the `supabase/migrations/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is proprietary software owned by Beudox.