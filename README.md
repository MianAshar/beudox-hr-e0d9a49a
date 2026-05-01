<!--
generated_by: tessera
source_sha: 037a941f3665106a19b6f21d5d95b4325e6c27a7
generated_at: 2026-05-01T13:53:35.522Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React application for managing employee data, attendance, leave requests, payroll, evaluations, and company settings.

## Features

- **Employee Management**: Profile management, role-based access control, and employee directory
- **Attendance Tracking**: Automated attendance recording, summary analytics, and anomaly detection
- **Leave Management**: Request submission, approval workflows, and balance tracking
- **Payroll Processing**: Salary calculations, overtime tracking, and payslip generation
- **Performance Evaluations**: Review scheduling, timeline tracking, and increment proposals
- **Project Management**: Team assignments, activity logging, and task tracking
- **Company Settings**: Department management, leave types, expense categories, and system configuration

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database with real-time subscriptions)
- **Routing**: React Router
- **State Management**: React hooks and context
- **Testing**: Vitest for unit testing
- **Deployment**: Configured for modern web deployment

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Configure environment variables:
   
   Copy `.env` and update the Supabase credentials:
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

The application uses Supabase migrations for database schema. The migrations are located in `supabase/migrations/` and include tables for:

- Employees and authentication
- Attendance records
- Leave requests and balances
- Payroll data
- Company settings and configurations
- Public holidays and evaluations

Run migrations in your Supabase project to set up the database schema.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint

## Key Components

### Core UI Components
- **BeudoxLogo**: Brand logo with variant support (default/sidebar)
- **NavLink**: Enhanced React Router NavLink with active state styling
- **SearchableEmployeeSelect**: Employee selection dropdown with search functionality

### Feature Components
- **AttendanceSummary**: Comprehensive attendance analytics dashboard
- **MandatoryPasswordChange**: First-time password setup modal
- **AppLayout**: Main application layout with sidebar navigation

## Authentication & Security

- Supabase Auth for user authentication
- Role-based access control (admin, manager, employee roles)
- Mandatory password change on first login
- Secure API key management through environment variables

## Contributing

1. Follow the existing code style and component patterns
2. Use TypeScript for type safety
3. Add unit tests for new functionality
4. Update documentation for new features

## License

This project is proprietary software for Beudox HR management.