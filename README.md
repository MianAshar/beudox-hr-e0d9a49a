<!--
generated_by: tessera
source_sha: 581f5529382d629912d51d9dc86613125abd7306
generated_at: 2026-03-27T01:50:35.311Z
action: update
-->

# Beudox HR Frontend

A modern React-based frontend application for HR management, built with TypeScript, Vite, and shadcn/ui components. This application provides a comprehensive interface for managing employee data, attendance, payroll, leave requests, projects, and more.

## Features

- **Employee Management**: Complete employee profiles with personal details, roles, and assignments
- **Attendance Tracking**: Daily attendance records with check-in/out times and overtime calculations
- **Payroll Processing**: Automated payroll calculations including salary, allowances, and deductions
- **Leave Management**: Leave requests, balances, and approval workflows
- **Project Management**: Project tracking with client relationships and team assignments
- **Invoice Management**: Client invoicing with payment tracking
- **Performance Evaluations**: Daily and periodic employee evaluations
- **Office Expenses**: Expense tracking and approval system
- **Loan Management**: Employee loan processing and monthly deductions
- **Notifications**: In-app and email notifications for important events

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Testing**: Vitest + Testing Library
- **E2E Testing**: Playwright

## Prerequisites

- Node.js 18+
- npm or bun package manager

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

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── NavLink.tsx     # Custom navigation component
├── pages/              # Page components
│   ├── Index.tsx       # Main dashboard page
│   └── NotFound.tsx    # 404 page
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── App.tsx             # Main app component
```

## Architecture

### Routing Structure

The application uses React Router with the following routes:

- `/` - Main dashboard (Index page)
- `*` - 404 Not Found page

### Core Components

The application leverages shadcn/ui components built on Radix UI primitives:

- **Form Components**: Input, Textarea, Select, Checkbox, Radio Group
- **Layout Components**: Card, Sheet, Dialog, Drawer
- **Navigation**: Navigation Menu, Tabs, Breadcrumb
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Data Display**: Table, Badge, Avatar

### State Management

- **Server State**: TanStack Query for API data fetching and caching
- **Local State**: React hooks for component-level state
- **Form State**: React Hook Form for form management

### Database Schema

The application uses a comprehensive PostgreSQL database with tables for:

- Companies and company settings
- Employees and their roles
- Attendance records and imports
- Payroll processing and salary history
- Leave management (types, requests, balances)
- Projects and project assignments
- Clients and invoicing
- Performance evaluations
- Office expenses and loans

## Development

### Code Quality

- **Linting**: ESLint with React and TypeScript rules
- **Type Checking**: TypeScript strict mode
- **Testing**: Unit tests with Vitest, E2E tests with Playwright

### Component Development

Components follow the shadcn/ui pattern:
- Built with Radix UI primitives
- Styled with Tailwind CSS
- TypeScript for type safety
- Forward refs for proper DOM access

### API Integration

The application uses Supabase client for:
- Authentication (login/logout)
- Database queries and mutations
- Real-time subscriptions
- File storage

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The build artifacts will be stored in the `dist/` directory.

3. Deploy the `dist/` directory to your hosting provider (Netlify, Vercel, etc.).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the linter: `npm run lint`
6. Run tests: `npm run test`
7. Submit a pull request

## License

This project is private and proprietary.