<!--
generated_by: tessera
source_sha: 9fa1d09e6ad40d3c1a2750b2863dbf3a2290aa19
generated_at: 2026-04-23T11:11:31.257Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies to streamline employee management, attendance tracking, leave management, payroll processing, and organizational workflows.

## Features

### Employee Management
- **Employee Profiles**: Complete employee information including personal details, job history, and organizational structure
- **Attendance Tracking**: Real-time attendance monitoring with check-in/out times, working hours calculation, and overtime tracking
- **Leave Management**: Comprehensive leave request system with balance tracking, approval workflows, and calendar integration
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, deductions, and payslip generation
- **Performance Reviews**: Structured evaluation system with review schedules, feedback collection, and salary increment proposals

### Organizational Tools
- **Project Management**: Team assignment, task tracking, and project activity logging
- **Department & Role Management**: Hierarchical organizational structure with customizable roles and permissions
- **HR Policies**: Rich text policy documentation and management
- **Expense Tracking**: Expense category management and approval workflows

### Administrative Features
- **Company Settings**: Centralized configuration for company information and policies
- **User Authentication**: Secure login with role-based access control
- **Notification System**: Automated notifications for important HR events and deadlines
- **Audit Logs**: Comprehensive logging of user activities and system changes

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Routing**: React Router
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database + real-time subscriptions)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Configured for modern hosting platforms

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and configure your Supabase credentials:
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

5. **Start Development Server**
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

### Testing

- **Unit Tests**: `npm run test`
- **E2E Tests**: `npm run test:e2e`
- **Linting**: `npm run lint`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/ # Employee-specific components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   └── settings/       # Administrative settings
├── pages/              # Page components (Next.js style routing)
├── lib/                # Utility functions and business logic
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for backend logic
```

## Key Components

### Core Components
- **AppLayout**: Main application layout with sidebar navigation
- **BeudoxLogo**: Brand logo component with variant support
- **SearchableEmployeeSelect**: Employee selection with search functionality

### Feature Components
- **AttendanceTab**: Monthly attendance view with summary statistics
- **LeaveBalancesTab**: Leave balance tracking and requests
- **PayrollSummary**: Payroll overview and processing
- **EvaluationTimeline**: Performance review timeline

## API Integration

The application integrates with Supabase for:
- **Database**: PostgreSQL with real-time subscriptions
- **Authentication**: User management and session handling
- **Storage**: File uploads and document management
- **Edge Functions**: Server-side processing for payroll generation and notifications

## Contributing

1. Follow the existing code style and component patterns
2. Write tests for new features
3. Update documentation for API changes
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.
