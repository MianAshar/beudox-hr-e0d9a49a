<!--
generated_by: tessera
source_sha: 03509de5f6208160253b996346e7b1f70041c3ca
generated_at: 2026-05-07T05:53:02.960Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources management web application built for modern businesses. This frontend application provides a complete HR portal for managing employees, attendance, leave requests, payroll, evaluations, and organizational settings.

## Features

### Core HR Functionality
- **Employee Management**: Profile management, role-based access control, and employee directory
- **Attendance Tracking**: Automated attendance recording, summary analytics, and anomaly detection
- **Leave Management**: Leave request workflows, balance tracking, and approval processes
- **Payroll Processing**: Salary calculations, payslip generation, and payroll history
- **Performance Evaluations**: Employee evaluations, review schedules, and salary increment proposals
- **Project Management**: Team assignments, project tracking, and activity logging

### Administrative Tools
- **Company Settings**: Configure departments, roles, leave types, expense categories
- **HR Policies**: Rich text editor for policy documentation
- **Login Monitoring**: Track user login activity and device information
- **Data Management**: Import/export capabilities and data clearing utilities

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **State Management**: React hooks and context
- **Testing**: Vitest and Playwright
- **Package Manager**: Bun

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
bun run build
```

The built files will be in the `dist` directory.

### Testing

Run unit tests:
```bash
bun run test
```

Run end-to-end tests:
```bash
bun run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── main.tsx           # Application entry point
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceSummary**: Comprehensive attendance analytics dashboard
- **MandatoryPasswordChange**: Secure password reset modal for new users
- **SearchableEmployeeSelect**: Employee selection component with search functionality
- **BeudoxLogo**: Brand logo component with multiple variants

## Authentication & Security

The application uses Supabase authentication with role-based access control. New users are required to change their temporary password upon first login through the `MandatoryPasswordChange` component.

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software owned by Beudox.