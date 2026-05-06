<!--
generated_by: tessera
source_sha: d05e2703bc4ca812d900c6eabbedaad699b1d5da
generated_at: 2026-05-06T17:22:08.016Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, payroll, leave requests, evaluations, and more.

## Features

- **Employee Management**: Profile management, onboarding, and organizational structure
- **Attendance Tracking**: Automated attendance recording, summary reports, and anomaly detection
- **Leave Management**: Request and approval workflows for various leave types
- **Payroll Processing**: Salary calculations, overtime tracking, and payslip generation
- **Performance Evaluations**: Scheduled reviews and feedback systems
- **Project Management**: Team assignments and activity tracking
- **HR Policies**: Rich text policy documents and management
- **Settings & Configuration**: Company settings, departments, roles, and system configuration

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **State Management**: React hooks and context
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Configured for modern web hosting

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
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for data storage. The database schema includes tables for:

- Employees and user authentication
- Attendance records
- Leave requests and balances
- Payroll data
- Company settings and configurations
- Public holidays
- Projects and tasks

Database migrations are located in the `supabase/migrations/` directory.

### Testing

Run unit tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── test/               # Test files
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceSummary**: Comprehensive attendance analytics and reporting
- **MandatoryPasswordChange**: Secure password reset flow for new users
- **SearchableEmployeeSelect**: Employee selection with search functionality
- **BeudoxLogo**: Brand logo component with multiple variants

## Contributing

1. Follow the existing code style and component patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.