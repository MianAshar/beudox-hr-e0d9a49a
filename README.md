<!--
generated_by: tessera
source_sha: d2dd5800dede643bd5c76facc7cd3e7c05224a68
generated_at: 2026-05-05T12:07:36.157Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, payroll, evaluations, and organizational workflows.

## Overview

Beudox HR Portal (also referred to as Forte HR Portal) is a full-featured HR management solution that provides:

- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Attendance Tracking**: Automated attendance recording with analytics and reporting
- **Leave Management**: Comprehensive leave request and approval workflows
- **Payroll Processing**: Automated payroll calculations and payslip generation
- **Performance Evaluations**: Regular and daily evaluation systems
- **Project Management**: Project tracking with team assignments and task management
- **Finance & Invoicing**: Invoice generation and financial reporting
- **HR Policies**: Document management for company policies
- **Role-Based Access Control**: Granular permissions system

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library (built on Radix UI primitives)
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **TipTap** for rich text editing
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend & Infrastructure
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** database with 40+ migration files
- **Row Level Security (RLS)** for data access control

### Development & Testing
- **ESLint** and **TypeScript** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **React Testing Library** for component testing

## Getting Started

### Prerequisites
- Node.js 18+
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
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
│   ├── utils.ts        # General utilities
│   ├── role-access.ts  # Permission checking
│   ├── attendance-format.ts # Attendance formatting
│   └── ...
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── test/               # Test files
```

## Key Features

### Authentication & Security
- Supabase authentication with email/password
- Mandatory password change on first login
- Role-based access control with granular permissions
- Protected routes with automatic redirects

### Employee Management
- Comprehensive employee profiles with multiple tabs
- Document management and storage
- Salary history and increment tracking
- Performance review scheduling

### Attendance System
- Automated attendance recording
- Working hours calculation
- Overtime tracking (regular and holiday)
- Attendance analytics and reporting
- Late arrival detection

### Leave Management
- Multiple leave types configuration
- Leave balance tracking
- Request and approval workflows
- Leave data clearing utilities

### Payroll & Finance
- Automated payroll generation
- Payslip generation and distribution
- Invoice creation and management
- Financial reporting

### Project Management
- Project creation and assignment
- Team management
- Task tracking
- Activity logging

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.