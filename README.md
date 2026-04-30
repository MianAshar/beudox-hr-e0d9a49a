<!--
generated_by: tessera
source_sha: 34d559802d5e6dcb7b8924f0c4be312d305fd5d1
generated_at: 2026-04-30T11:12:14.651Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources management web application built for companies to manage employee data, attendance, leave requests, payroll, and organizational settings.

## Features

- **Employee Management**: Profile management, role-based access control, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording, summary reports, and anomaly detection
- **Leave Management**: Leave request workflows, balance tracking, and approval processes
- **Payroll Processing**: Salary calculations, overtime tracking, and payroll generation
- **Project Management**: Team assignments, task tracking, and project activity logging
- **HR Policies**: Rich text policy documents and HR guideline management
- **Settings & Configuration**: Company settings, departments, roles, expense categories, and evaluation parameters
- **Notifications**: Automated notifications for HR events and employee communications

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database with real-time subscriptions)
- **Routing**: React Router
- **State Management**: React hooks and context
- **Testing**: Vitest for unit tests, Playwright for end-to-end tests
- **Deployment**: Configured for modern web deployment

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

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase as its backend. The database schema includes tables for:

- Employees and user authentication
- Attendance records
- Leave requests and balances
- Payroll data
- Company settings and configurations
- Projects and tasks

Database migrations are located in `supabase/migrations/` and should be applied to your Supabase project.

### Testing

Run unit tests:
```bash
npm run test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings and configuration components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── ...
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceSummary**: Comprehensive attendance analytics and reporting
- **MandatoryPasswordChange**: Secure password setup for new users
- **SearchableEmployeeSelect**: Employee selection with search functionality
- **BeudoxLogo**: Brand logo component with multiple variants

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.