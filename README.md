<!--
generated_by: tessera
source_sha: 117c538de9ba2c3a55fd1e5f15d80b9accb70ecf
generated_at: 2026-04-21T11:07:37.158Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with powerful tools to manage employees, track attendance, handle payroll, manage projects, and streamline HR operations.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal details, roles, and organizational structure
- **Attendance Tracking**: Daily attendance records, working hours, overtime tracking, and leave management
- **Payroll Processing**: Automated payroll generation, payslip management, and salary history
- **Leave Management**: Leave requests, balances tracking, and approval workflows

### Project & Client Management
- **Project Management**: Project creation, team assignment, task tracking, and activity logging
- **Client Management**: Client profiles, project associations, and invoice generation
- **Invoice Management**: Automated invoice creation, PDF generation, and email delivery

### Performance & Development
- **Employee Evaluations**: Performance reviews, evaluation parameters, and review schedules
- **Daily Evaluations**: Real-time feedback and performance tracking
- **Job Descriptions**: Structured job descriptions and role definitions

### Administrative Tools
- **HR Policies**: Rich text policy documents with full editing capabilities
- **Company Settings**: Departments, roles, expense categories, and system configuration
- **Finance Overview**: Financial summaries and expense tracking
- **Loan Management**: Employee loan tracking and management

### Security & Access
- **Role-Based Access Control**: Granular permissions based on user roles
- **Secure Authentication**: Supabase-powered authentication with password recovery
- **Audit Logging**: Login tracking and system activity monitoring

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Radix UI components with Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editor**: TipTap
- **Charts**: Recharts
- **Testing**: Vitest + Playwright

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
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Set up the database:
   
   Run the Supabase migrations in order:
   ```bash
   supabase db reset
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase as the backend. The database schema includes tables for:

- Companies, Employees, and Roles
- Attendance records and Leave management
- Projects, Clients, and Invoices
- Payroll and Financial data
- HR Policies and Job Descriptions
- Evaluations and Performance tracking

All migrations are located in the `supabase/migrations/` directory and should be applied in chronological order.

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── layout/         # App layout components
│   ├── employee-profile/  # Employee-specific components
│   └── ...
├── pages/              # Page components and routing
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase project configuration
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses:
- **ESLint** for code linting
- **TypeScript** for type checking
- **Vitest** for unit testing
- **Playwright** for end-to-end testing

### Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.