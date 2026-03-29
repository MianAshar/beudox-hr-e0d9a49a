<!--
generated_by: tessera
source_sha: bcf71ae34e524f3c3dbb0f58c818a0ee4639cbef
generated_at: 2026-03-29T22:59:32.389Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern web application. Beudox HR provides organizations with tools to manage employees, attendance, payroll, leave management, and more through an intuitive dashboard interface.

## Features

- **Employee Management**: Add, view, and edit employee profiles
- **Attendance Tracking**: Monitor employee attendance and public holidays
- **Leave Management**: Handle leave requests and approvals
- **Payroll Processing**: Manage salary calculations and payments
- **Finance Management**: Track expenses, loans, and financial reports
- **Project Management**: Oversee projects and evaluations
- **Role-Based Access Control**: Different permission levels for employees, managers, and executives
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Authentication**: Supabase Auth
- **Backend**: Supabase (PostgreSQL database with real-time capabilities)
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright
- **Icons**: Lucide React

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
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npx playwright test
```

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

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Authentication & Authorization

The application uses Supabase for authentication with role-based access control:

- **CEO**: Full access to all features
- **HR Manager**: Employee management, attendance, leave, policies
- **Finance Manager**: Payroll, expenses, financial reports
- **Team Lead**: Project management, evaluations
- **Employee**: Basic dashboard, attendance, projects

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is private and proprietary to Beudox.