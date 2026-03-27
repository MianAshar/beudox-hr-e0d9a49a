<!--
generated_by: tessera
source_sha: 06803334093ea16ece13e839a0d02c3c2861a163
generated_at: 2026-03-27T03:57:52.281Z
action: update
-->

# Beudox HR Management System

A modern, web-based Human Resources management application built with React, TypeScript, and Supabase. This application provides comprehensive HR functionality including employee management, attendance tracking, payroll, leave management, and more.

## Features

- **Employee Management**: Manage employee profiles, roles, and information
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests, sick leave, and public holidays
- **Payroll Processing**: Calculate and manage employee salaries
- **Finance Management**: Track loans, expenses, and financial reports
- **Project Management**: Oversee HR-related projects and evaluations
- **Notifications**: In-app notification system
- **Settings**: System configuration and preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Backend**: Supabase (PostgreSQL database)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
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
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_URL`: Your Supabase project URL

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
```

### Run Tests

```bash
npm run test
```

### Run E2E Tests

```bash
npx playwright install
npx playwright test
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (AppLayout, AppSidebar, TopBar)
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── BeudoxLogo.tsx   # Logo component
│   └── NavLink.tsx      # Navigation link wrapper
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations (Supabase)
├── lib/                 # Utility functions
├── pages/               # Page components
└── main.tsx             # Application entry point
```

## Authentication

The application uses Supabase Authentication for user management. Users can:
- Log in with email/password
- Reset passwords
- Accept invitations to set up accounts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.