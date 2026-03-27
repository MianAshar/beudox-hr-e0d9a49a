<!--
generated_by: tessera
source_sha: a1fe681bb06393e58c8dee68ec335f474e4437b8
generated_at: 2026-03-27T03:27:28.348Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application designed to streamline HR operations for organizations. It provides a modern, user-friendly interface for managing employees, tracking attendance, handling payroll, managing leave, and overseeing various HR-related tasks.

## Features

- **Employee Management**: Manage employee profiles, roles, and information
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle leave requests and approvals
- **Payroll Processing**: Manage salary calculations and payroll
- **Finance Management**: Oversee financial aspects including loans and expenses
- **Project Management**: Track projects and evaluations
- **HR Policies**: Maintain and distribute HR policies
- **Notifications**: System-wide notification management
- **Settings**: Configure application settings

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest with Playwright for E2E

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn or bun package manager
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
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   Update the values in `.env.local` with your Supabase project details.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build
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
└── test/                # Test files
```

## Authentication

The application uses Supabase for authentication. Users can log in, reset passwords, and access protected routes based on their authentication status.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.