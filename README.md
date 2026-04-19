<!--
generated_by: tessera
source_sha: a90685c00aea6cff27dce068c05702801a768e5c
generated_at: 2026-04-19T20:47:40.051Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies.

## Overview

Beudox HR is a full-featured HR management platform designed to streamline employee management, performance evaluations, leave tracking, payroll processing, and financial reporting. The system provides a user-friendly interface for HR managers, team leads, and employees to manage various aspects of workforce administration.

## Features

### Core Functionality
- **Employee Management**: Comprehensive employee profiles and searchable employee selection
- **Performance Evaluations**: Quarterly and daily evaluation system with timeline tracking
- **Leave Management**: Request, approve, and track leave balances
- **Payroll Processing**: Automated payroll generation with overtime and bonus calculations
- **Financial Reporting**: Real-time finance summaries with 6-month trend analysis
- **Project Management**: Project tracking with activity logs and task management
- **Company Settings**: Configurable departments, roles, leave types, and expense categories
- **Notifications**: Automated notification system for HR events

### User Roles
- **CEO**: Full system access
- **HR Manager**: Comprehensive HR operations
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and requests

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL database with real-time subscriptions)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Configured for modern hosting platforms

## Architecture

### Frontend Structure
- `src/components/`: Reusable UI components organized by feature
- `src/pages/`: Page components (using React Router)
- `src/lib/`: Utility functions and business logic
- `src/hooks/`: Custom React hooks
- `src/integrations/`: External service integrations (Supabase)

### Key Components
- **Layout Components**: AppLayout, AppSidebar, TopBar for consistent UI
- **Feature Components**: Specialized components for evaluations, finance, leave, etc.
- **UI Components**: shadcn/ui primitives (buttons, forms, tables, etc.)

### Database Schema
The application uses Supabase with PostgreSQL, featuring tables for:
- Employees and user management
- Evaluations (quarterly and daily)
- Leave requests and balances
- Payroll records
- Projects and tasks
- Company settings and configurations

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Configure environment variables:
   Copy `.env` and update with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application includes Supabase migrations in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

### Testing

Run unit tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Run ESLint

### Code Organization
- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error handling and loading states
- Maintain consistent component structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.