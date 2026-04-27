<!--
generated_by: tessera
source_sha: ee620c4cb89bbae5b73469faa38110b90495fae1
generated_at: 2026-04-27T23:33:58.166Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built with modern web technologies. This application provides a complete suite of HR tools for managing employees, attendance, payroll, leave, evaluations, and more.

## Features

- **Employee Management**: Complete employee profiles with personal details, roles, departments, and organizational structure
- **Attendance Tracking**: Automated attendance import from Excel files with AI-powered parsing, time tracking, and overtime calculations
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Generate payslips, manage salaries, allowances, and deductions
- **Performance Evaluations**: Regular and daily evaluations with customizable parameters
- **Project Management**: Track projects, assign team members, and monitor progress
- **Finance Management**: Invoice generation, client management, and financial reporting
- **HR Policies**: Create and manage company policies with rich text editing
- **Job Descriptions**: Maintain detailed job descriptions and requirements
- **Loan Management**: Track employee loans and repayments
- **Settings & Configuration**: Company settings, departments, roles, leave types, and more

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI primitives with shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text Editor**: Tiptap
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

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
   
   Copy `.env` and update the values:
   ```bash
   cp .env .env.local
   ```
   
   The required environment variables are:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase public key

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
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee profile specific components
│   ├── attendance/     # Attendance related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Settings components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex component for importing attendance data from Excel files
- **MandatoryPasswordChange**: Modal for forcing password changes on first login
- **SearchableEmployeeSelect**: Reusable component for selecting employees with search
- **BeudoxLogo**: Logo component with variant support

## Authentication & Authorization

The application uses Supabase for authentication and implements role-based access control. Users must change their temporary password on first login. Access to different sections is controlled based on user roles.

## Database Schema

The application uses Supabase with PostgreSQL. Key tables include:
- `employees` - Employee information
- `attendance_records` - Attendance data
- `leave_requests` - Leave management
- `payroll_records` - Payroll data
- `evaluations` - Performance evaluations
- `projects` - Project management
- `invoices` - Financial invoices
- `company_settings` - Company configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is private and proprietary.