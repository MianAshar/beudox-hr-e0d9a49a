<!--
generated_by: tessera
source_sha: 21b6f1e9ecf5507edab8e7de3c36959f7fc8ea2f
generated_at: 2026-03-27T22:57:13.843Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides tools for managing employees, attendance, payroll, leave management, and other HR functions.

## Features

- **Employee Management**: Manage employee information and profiles
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation, sick leave, and other time-off requests
- **Payroll Processing**: Calculate and manage employee salaries and benefits
- **Finance Management**: Track office expenses, loans, and financial reports
- **Project Management**: Oversee company projects and evaluations
- **HR Policies**: Maintain and distribute HR policies and procedures
- **Notifications**: System-wide notification management
- **Settings**: Configure application preferences

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Icons**: Lucide React
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Prerequisites

- Node.js 18+ or Bun
- Supabase account and project

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Configuration**
   
   Copy the `.env` file and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. **Supabase Setup**
   
   Ensure your Supabase project has the required tables and configurations for:
   - User authentication
   - Employee data
   - Attendance records
   - Payroll information
   - And other HR-related data structures

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (default Vite port)

## Available Scripts

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
├── lib/                # Utility functions
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication

The application uses Supabase authentication with support for:
- Email/password login
- Password reset
- User invitations
- Session management

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is private and proprietary.