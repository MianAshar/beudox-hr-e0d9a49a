<!--
generated_by: tessera
source_sha: 6de9f53b095a7eb1412b4e47f3213ed1d5192eeb
generated_at: 2026-04-27T10:11:52.423Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, attendance tracking, payroll processing, leave management, project coordination, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with personal details, roles, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording with check-in/out times, overtime calculation, and reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll generation with salary calculations, deductions, and payslip generation
- **Performance Evaluations**: Regular and daily performance reviews with customizable evaluation parameters

### Project & Client Management
- **Project Management**: Create and manage projects with team assignments, task tracking, and progress monitoring
- **Client Relations**: Maintain client information and project associations
- **Invoice Management**: Generate and manage project invoices with PDF export

### Organizational Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Job Descriptions**: Define roles and responsibilities with detailed job specifications
- **Public Holidays**: Configure and manage company holiday schedules
- **Loan Management**: Track employee loans and repayment schedules
- **Finance Overview**: Comprehensive financial reporting and analytics

### Administrative Features
- **Role-Based Access Control**: Granular permissions system for different user roles
- **Settings Management**: Configure company settings, departments, roles, and system parameters
- **Notification System**: Automated notifications for important HR events
- **Document Storage**: Secure document management for employee files (coming soon)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: Tiptap
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager

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

3. Set up environment variables:
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

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
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee profile tabs
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Database Schema

The application uses Supabase with a comprehensive PostgreSQL schema including:
- Employee management tables
- Attendance and time tracking
- Payroll and compensation
- Project and task management
- Leave and holiday management
- Evaluation and performance data
- Document storage

Database migrations are located in `supabase/migrations/`.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.