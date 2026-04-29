<!--
generated_by: tessera
source_sha: 80d9cee29c9c592df7b6e322ed905397603616d6
generated_at: 2026-04-29T23:06:14.453Z
action: update
-->

# Beudox HR Portal

A comprehensive HR management portal built for modern companies to streamline employee lifecycle management, attendance tracking, payroll processing, and organizational workflows.

## Features

### Employee Management
- **Employee Profiles**: Comprehensive employee information including personal details, job history, salary information, and document storage
- **Onboarding**: New employee setup with mandatory password changes and role assignments
- **Directory**: Searchable employee directory with avatars and designations

### Attendance & Time Tracking
- **Attendance Upload**: AI-powered parsing of Excel attendance files from biometric systems (ZKTeco-compatible)
- **Time Calculations**: Automatic calculation of working hours, overtime, late arrivals, and shift compliance
- **Import Management**: Batch import with conflict resolution and unmatched employee handling

### Leave Management
- **Leave Requests**: Employee self-service for applying leave with balance tracking
- **Approval Workflows**: Manager approval process for leave requests
- **Leave Balances**: Real-time tracking of various leave types (vacation, sick, etc.)

### Payroll & Compensation
- **Payroll Processing**: Automated payroll calculations with overtime and deductions
- **Salary Reviews**: Performance-based salary increment proposals and approvals
- **Payroll History**: Complete salary history and increment tracking

### Performance & Evaluations
- **Evaluation System**: Structured performance reviews with customizable parameters
- **Review Scheduling**: Automated review cycle management with alerts
- **Timeline Tracking**: Historical evaluation records and progress tracking

### Administrative Tools
- **Company Settings**: Configurable company policies, departments, roles, and expense categories
- **User Management**: Role-based access control with granular permissions
- **Audit Logs**: Login tracking and activity monitoring

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **State Management**: React hooks with Supabase real-time subscriptions
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Modern web standards, deployable to any static hosting

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

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
   
   The application uses Supabase migrations. Run them in your Supabase project:
   ```bash
   supabase db reset
   ```
   
   Or apply migrations manually through the Supabase dashboard.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
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
│   ├── layout/         # App layout components (sidebar, header, etc.)
│   ├── employee-profile/  # Employee detail components
│   ├── attendance/     # Attendance management components
│   ├── payroll/        # Payroll-related components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex attendance import workflow with AI parsing
- **MandatoryPasswordChange**: Secure password reset component
- **SearchableEmployeeSelect**: Employee selection with search and filtering
- **BeudoxLogo**: Brand logo component with multiple variants

## API Integration

The application integrates with Supabase for:
- **Authentication**: User login/logout with role-based access
- **Database**: PostgreSQL queries for all HR data
- **Real-time**: Live updates for notifications and status changes
- **Edge Functions**: Server-side processing for attendance parsing and payroll calculations

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Contributing

1. Follow the existing code style and component patterns
2. Add tests for new features
3. Update documentation for API changes
4. Use TypeScript strictly with proper type definitions

## License

This project is proprietary software. All rights reserved.