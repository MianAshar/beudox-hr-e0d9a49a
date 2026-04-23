<!--
generated_by: tessera
source_sha: 99d0a0ebeeee26f5bde3db11e6954b24e4e25713
generated_at: 2026-04-23T22:19:19.082Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track attendance, handle payroll, manage leave requests, conduct evaluations, and oversee projects and finances.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal details, roles, and organizational structure
- **Attendance Tracking**: Automated attendance recording with check-in/out times, overtime calculation, and reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and payslip generation

### Performance & Development
- **Employee Evaluations**: Regular performance reviews and daily evaluation tracking
- **Salary Reviews**: Increment proposals and salary history management
- **Job Descriptions**: Create and manage detailed job descriptions and requirements

### Project & Finance Management
- **Project Management**: Track projects, assign team members, and monitor project activities
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices with PDF export
- **Financial Reporting**: Comprehensive finance sheets and expense tracking

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Settings Management**: Configure company settings, departments, roles, and system parameters
- **Public Holidays**: Manage holiday calendars and scheduling
- **Loan Management**: Track employee loans and repayments

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI (shadcn/ui)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text**: Tiptap
- **Testing**: Vitest, Playwright
- **Package Manager**: npm/bun

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
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
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

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
# or
bun run build
```

### Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── ...
```

## Authentication & Authorization

The application uses Supabase for authentication with role-based access control. Users can have different roles with specific permissions to access various features of the system.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is private and proprietary to Beudox.