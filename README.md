<!--
generated_by: tessera
source_sha: ec2e01acba141080ac54074ec9a8a8aea5064674
generated_at: 2026-04-23T10:41:03.431Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track attendance, handle leave requests, process payroll, conduct evaluations, and maintain HR policies.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Attendance Tracking**: Daily attendance records, working hours, and overtime tracking
- **Leave Management**: Leave requests, balances, and approvals
- **Payroll Processing**: Salary calculations, payslips, and payroll generation
- **Performance Evaluations**: Regular and daily evaluations with customizable parameters
- **Project Management**: Project tracking, team assignments, and activity logs
- **Client Management**: Client relationships and invoice management
- **HR Policies**: Document and manage company policies
- **Job Descriptions**: Create and maintain job descriptions
- **Finance Management**: Financial summaries and expense tracking
- **Role-Based Access Control**: Secure access based on user roles and permissions

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui (Radix UI primitives), Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text Editor**: Tiptap
- **Testing**: Vitest, Playwright
- **Build Tools**: Vite, ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
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

   The application will be available at `http://localhost:8080`

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

# Run e2e tests
npx playwright test
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/ # Employee profile tabs
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── ...

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Database Schema

The application uses Supabase with PostgreSQL. Key tables include:

- `employees` - Employee information
- `attendance_records` - Daily attendance data
- `leave_requests` - Leave applications
- `payroll_records` - Payroll data
- `evaluations` - Performance evaluations
- `projects` - Project management
- `invoices` - Client invoicing
- `hr_policies` - Company policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.