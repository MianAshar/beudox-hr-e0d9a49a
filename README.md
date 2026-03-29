<!--
generated_by: tessera
source_sha: 6278215e793f4b3b57e35f02bce8cc81ca309f3f
generated_at: 2026-03-29T23:16:02.507Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This system provides role-based access to various HR functions including employee management, attendance tracking, payroll, leave management, and more.

## Features

### Core Functionality
- **Employee Management**: Add, view, and edit employee profiles
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests and approvals
- **Payroll Processing**: Manage salary calculations and payments
- **Finance Management**: Track expenses, loans, and financial reports
- **Project Management**: Assign and track employee projects
- **Performance Evaluations**: Conduct and manage employee reviews
- **HR Policies**: Maintain and distribute company policies
- **Notifications**: System-wide notification management

### Role-Based Access Control
The application supports multiple user roles with specific permissions:
- **Employee**: Basic access to personal dashboard, attendance, and projects
- **HR Manager**: Full employee management, attendance, leave, and HR policies
- **Finance Manager**: Payroll, finance, expenses, and financial reporting
- **Team Lead**: Team management, projects, and evaluations
- **CEO**: Full system access

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

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
2. Run the migrations in the `supabase/migrations/` directory
3. Configure authentication and RLS policies
4. Set up the Supabase Edge Functions (if any)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication

The application uses Supabase Authentication with email/password login. New employees can be invited via email with temporary passwords.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.