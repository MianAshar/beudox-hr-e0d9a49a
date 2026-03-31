<!--
generated_by: tessera
source_sha: c137177acc2da9c7c6111ad3f73b93efd194a352
generated_at: 2026-03-31T22:27:13.993Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This system provides tools for managing employees, attendance, payroll, leave management, and other HR functions.

## Features

- **Employee Management**: Add, edit, and view employee profiles
- **Dashboard**: Overview of key HR metrics and activities
- **Attendance Tracking**: Monitor employee attendance
- **Leave Management**: Handle vacation and leave requests
- **Payroll Processing**: Manage salary and payroll calculations
- **Finance Management**: Track expenses, loans, and financial data
- **Project Management**: Organize and track HR-related projects
- **HR Policies**: Maintain and distribute company policies
- **Notifications**: System-wide notification management
- **Settings**: Configure system preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (authentication, database, edge functions)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest with Playwright for E2E

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
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
   
   Copy `.env` and update the Supabase configuration:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

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
├── components/
│   ├── layout/          # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/              # Reusable UI components (shadcn/ui)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── pages/               # Page components
├── integrations/        # External service integrations (Supabase)
└── test/                # Test files
```

## Authentication & Authorization

The application uses Supabase for authentication and implements role-based access control. Different user roles have access to different sections of the application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.