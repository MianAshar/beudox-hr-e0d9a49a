<!--
generated_by: tessera
source_sha: d05e2703bc4ca812d900c6eabbedaad699b1d5da
generated_at: 2026-05-06T17:23:53.132Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources management system built as a modern web application. Beudox HR provides tools for employee management, attendance tracking, leave administration, payroll processing, and organizational settings.

## Features

- **Employee Management**: Profile management, role-based access control, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording, analytics, and reporting
- **Leave Management**: Leave request workflows, balance tracking, and approval processes
- **Payroll Processing**: Automated payroll calculations, payslip generation, and financial reporting
- **Settings & Configuration**: Company settings, departments, roles, leave types, and expense categories
- **Notifications**: Automated alerts for reviews, leave approvals, and system events

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Routing**: React Router
- **State Management**: React hooks and context
- **Testing**: Vitest for unit tests, Playwright for end-to-end tests
- **Deployment**: Configured for modern web hosting platforms

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
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
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

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
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── settings/       # Admin settings components
├── pages/              # Page components (routes)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Database Schema

The application uses Supabase with PostgreSQL. Database migrations are located in `supabase/migrations/` and include tables for:

- Employees and user authentication
- Attendance records
- Leave requests and balances
- Payroll data
- Company settings and configurations
- Audit logs and notifications

## Contributing

1. Follow the existing code style and component patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure TypeScript types are properly defined

## License

This project is proprietary software. All rights reserved.