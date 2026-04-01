<!--
generated_by: tessera
source_sha: f8e63aff55b9832c02ca51ce745bf1116d15709e
generated_at: 2026-04-01T10:56:29.191Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines HR operations for companies, providing tools for employee management, attendance tracking, payroll processing, project management, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal details, salary information, and employment history
- **Attendance Tracking**: Automated attendance recording with check-in/out times, overtime calculation, and import capabilities
- **Leave Management**: Flexible leave types, balance tracking, and approval workflows
- **Payroll Processing**: Automated payroll calculations including salary, allowances, overtime, and deductions

### Project & Client Management
- **Project Management**: Create and manage projects with client deadlines, team assignments, and progress tracking
- **Client Management**: Maintain client relationships with billing information and project history
- **Invoice Generation**: Automated invoice creation with PDF generation and payment tracking

### Financial Management
- **Office Expenses**: Track and approve office expenses with receipt management
- **Employee Loans**: Manage employee loan requests and monthly deductions
- **Outsourcing Records**: Track external service providers and fees

### Performance & Evaluation
- **Employee Evaluations**: Periodic performance reviews with customizable parameters
- **Daily Evaluations**: Real-time feedback and project-based assessments
- **HR Policies**: Document management for company policies and procedures

### System Administration
- **Multi-tenant Architecture**: Support for multiple companies with isolated data
- **Role-based Access Control**: Granular permissions based on user roles
- **Notifications System**: Automated notifications for important events
- **Settings Management**: Company-specific configuration and feature flags

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL with Edge Functions)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest with Playwright for E2E

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

3. Create a `.env` file with your Supabase configuration:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase as the backend. The database schema includes migrations that will be automatically applied when you set up your Supabase project.

Key database tables:
- `companies` - Multi-tenant company information
- `employees` - Employee profiles and data
- `attendance_records` - Daily attendance tracking
- `payroll_records` - Monthly payroll data
- `projects` - Project management
- `invoices` - Client invoicing
- `leave_requests` - Employee leave management

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── settings/       # Settings-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── migrations/         # Database migrations
└── functions/          # Edge functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

Run tests:
```bash
npm run test
```

Run E2E tests:
```bash
npx playwright test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the linter and tests
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.