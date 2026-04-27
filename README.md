<!--
generated_by: tessera
source_sha: e3b474779bf09d55302d2bc89be1ae87a6a9e9d7
generated_at: 2026-04-27T12:14:30.064Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern businesses. Beudox HR streamlines employee management, attendance tracking, payroll processing, and organizational workflows.

## Features

### Core HR Management
- **Employee Profiles**: Complete employee information management with roles, departments, and personal details
- **Attendance Tracking**: Automated attendance import from ZKTeco machines with AI-powered parsing
- **Leave Management**: Request, approve, and track employee leave balances
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Performance Evaluations**: Regular and daily performance reviews with scheduling

### Organizational Tools
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Generation**: Create and manage client invoices with PDF export
- **HR Policies**: Rich text policy documents with version control
- **Job Descriptions**: Structured job posting and description management

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user types
- **Company Settings**: Configure departments, leave types, evaluation parameters
- **Public Holidays**: Manage company-wide holiday schedules
- **Loan Management**: Track employee loans and repayments
- **Finance Dashboard**: Comprehensive financial overview and reporting

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui (Radix UI components)
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL, Authentication, Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text**: Tiptap
- **Testing**: Vitest, Playwright
- **Build Tools**: Vite, ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
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
   
   Copy `.env` and update the Supabase configuration:
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

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase as the backend. The database schema includes tables for:

- Employees and user authentication
- Attendance records
- Leave requests and balances
- Payroll data
- Projects and clients
- Evaluations and reviews
- Company settings and configurations

Database migrations are located in `supabase/migrations/` and should be applied to your Supabase project.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee profile tabs
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── functions/          # Edge functions for AI parsing, PDF generation
├── migrations/         # Database schema migrations
└── config.toml         # Supabase configuration
```

## Key Features Explained

### Attendance Upload Flow

The system supports automated attendance import from ZKTeco biometric machines:

1. Upload Excel/CSV files exported from ZKTeco devices
2. AI-powered parsing normalizes data and handles various formats
3. Automatic calculation of working hours, overtime, and late arrivals
4. Support for unmatched employee codes with import/skip options
5. Batch processing with detailed import summaries

### Role-Based Access

The application implements comprehensive role-based access control:

- **Admin**: Full system access
- **HR Manager**: Employee management, attendance, payroll
- **Project Manager**: Project and client management
- **Employee**: Personal profile, leave requests, timesheets

### Payroll Processing

Automated payroll generation includes:

- Base salary calculations
- Overtime (regular and holiday) tracking
- Leave deductions
- Tax calculations
- PDF payslip generation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.