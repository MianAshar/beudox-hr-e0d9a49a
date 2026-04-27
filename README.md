<!--
generated_by: tessera
source_sha: 4ecbd4315761424bce1ba20f63480a717ee88eab
generated_at: 2026-04-27T10:58:39.484Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern companies. Beudox HR streamlines employee management, attendance tracking, leave requests, payroll processing, performance evaluations, and project management in a single, intuitive web application.

## Features

### Employee Management
- Complete employee profiles with personal information, job details, and organizational hierarchy
- Employee search and filtering capabilities
- Role-based access control and permissions

### Attendance Tracking
- Automated attendance import from biometric devices (ZKTeco-compatible)
- Real-time attendance monitoring with check-in/check-out times
- Overtime calculation and reporting
- Late arrival tracking and notifications
- Weekend and holiday management

### Leave Management
- Leave request submission and approval workflow
- Multiple leave types (annual, sick, maternity, etc.)
- Leave balance tracking and utilization reports
- Automated leave balance calculations

### Payroll Processing
- Automated payroll generation based on attendance data
- Salary structure management with allowances and deductions
- Payslip generation and distribution
- Tax calculations and compliance reporting

### Performance Management
- Employee evaluation and review cycles
- Performance rating systems
- Salary review and increment proposals
- Review schedule management

### Project Management
- Project creation and team assignment
- Task tracking and progress monitoring
- Project activity logging
- Resource allocation and management

### Administrative Tools
- Company settings and configuration
- Department and role management
- Expense category setup
- System audit logs and login tracking

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router
- **Testing**: Vitest + Playwright
- **Deployment**: Modern web standards

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
   
   Copy the `.env` file and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   If using Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   # or
   bun run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── employee-profile/  # Employee profile tabs
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components (Next.js Pages Router style)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge Functions
└── config.toml         # Supabase configuration
```

## Key Components

### Core Layout
- `AppLayout`: Main application layout with sidebar navigation
- `AppSidebar`: Navigation sidebar with role-based menu items
- `TopBar`: Top navigation bar with user menu and notifications

### Employee Features
- `AttendanceTab`: Employee attendance history and summaries
- `LeaveBalancesTab`: Leave balance overview and requests
- `PayrollTab`: Salary history and payslip access
- `SalaryReviewTab`: Performance reviews and increment proposals

### Administrative Features
- `AttendanceUploadFlow`: Bulk attendance data import with AI parsing
- `CompanyTab`: Company-wide settings and configuration
- `DepartmentsTab`: Department management
- `RolesTab`: User role and permission management

## API Integration

The application integrates with Supabase for:

- **Database**: PostgreSQL with real-time subscriptions
- **Authentication**: User management and session handling
- **File Storage**: Document uploads and avatar storage
- **Edge Functions**: Server-side processing (attendance parsing, payroll generation, notifications)

## Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run Playwright tests
npx playwright test
```

## Deployment

The application can be deployed to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Supabase Edge Functions for backend logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.