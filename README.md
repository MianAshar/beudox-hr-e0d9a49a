<!--
generated_by: tessera
source_sha: b171fa629096f96f6d3b5bfe71f324dc5fa3d8d8
generated_at: 2026-04-30T11:22:04.680Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built with modern web technologies. This application provides a complete suite of HR tools for managing employees, attendance, payroll, leave, projects, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Attendance Tracking**: Automated attendance recording with analytics and reporting
- **Leave Management**: Request, approval, and tracking of various leave types
- **Payroll Processing**: Automated payroll calculations and payslip generation
- **Performance Evaluations**: Regular and daily performance reviews

### Project & Finance
- **Project Management**: Project tracking, team assignments, and activity logs
- **Client Management**: Client profiles and relationship management
- **Invoice Management**: Invoice creation, tracking, and PDF generation
- **Finance Dashboard**: Financial summaries and reporting

### Administrative Tools
- **HR Policies**: Rich text policy documents with version control
- **Job Descriptions**: Structured job posting and description management
- **Public Holidays**: Holiday calendar management
- **Settings**: Comprehensive system configuration (departments, roles, expense categories, etc.)

### User Experience
- **Role-Based Access Control**: Granular permissions system
- **Responsive Design**: Mobile-friendly interface
- **Real-time Notifications**: Toast notifications and alerts
- **Dark/Light Theme**: Theme switching support

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router DOM
- **UI Components**: Shadcn/ui (Radix UI primitives), Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: TipTap editor
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Charts**: Recharts
- **Testing**: Vitest, Playwright (E2E)
- **Build Tools**: Vite, ESLint, TypeScript

## Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   If using Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `http://localhost:5173`

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
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Auth for authentication with role-based access control:

- **Authentication Flow**: Login → Mandatory password change (first login) → Dashboard
- **Role-Based Access**: Different user roles have access to different features
- **Protected Routes**: All business routes are protected and require authentication

## Database Schema

The application uses PostgreSQL via Supabase with the following main entities:

- **employees**: User profiles and employment data
- **attendance_records**: Daily attendance entries
- **leave_requests**: Leave applications and approvals
- **payroll_records**: Salary and payroll data
- **projects**: Project management
- **evaluations**: Performance reviews
- **hr_policies**: Policy documents
- **invoices**: Billing and invoicing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.