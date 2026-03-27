<!--
generated_by: tessera
source_sha: 61560224e7cc16395ff950b1a1f96449dce27282
generated_at: 2026-03-27T03:48:30.522Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built as a modern React single-page application. This frontend provides an intuitive interface for managing employees, attendance, payroll, finance, projects, and HR policies.

## Features

- **Employee Management**: Manage employee information, roles, and profiles
- **Attendance Tracking**: Monitor employee attendance and public holidays
- **Leave Management**: Handle employee leave requests and approvals
- **Payroll Processing**: Calculate and manage employee salaries
- **Financial Management**: Track loans, office expenses, and outsourcing
- **Project Management**: Oversee company projects and evaluations
- **HR Policies**: Maintain and distribute HR documentation
- **Notifications**: System-wide notification management
- **Settings**: Application configuration and user preferences

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with Testing Library
- **E2E Testing**: Playwright

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
   - Copy `.env` file and update the Supabase configuration
   - Ensure you have valid Supabase project credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

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
├── components/
│   ├── layout/          # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/              # Reusable UI components (shadcn/ui)
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations (Supabase)
├── lib/                 # Utility functions
├── pages/               # Page components
└── types/               # TypeScript type definitions
```

## Authentication

The application uses Supabase for authentication. Users must log in to access the dashboard and other protected routes.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is private and proprietary to Beudox.