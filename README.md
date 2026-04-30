<!--
generated_by: tessera
source_sha: a50ae020b8bc1529b9111500b3ab3af31bb1236c
generated_at: 2026-04-30T11:21:53.959Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built with modern web technologies. This application provides organizations with tools to manage employee attendance, leave requests, payroll processing, performance evaluations, and organizational settings.

## Features

### Core HR Modules
- **Employee Management**: Profile management, onboarding, and organizational structure
- **Attendance Tracking**: Daily attendance records, overtime calculation, and analytics
- **Leave Management**: Leave requests, balances, and approval workflows
- **Payroll Processing**: Salary calculations, overtime pay, and payroll generation
- **Performance Evaluations**: Employee reviews, salary reviews, and evaluation timelines
- **Project Management**: Team assignments, project tracking, and activity logs
- **Finance & Expenses**: Expense tracking and financial summaries
- **HR Policies**: Document management and policy administration

### Administrative Features
- **Settings Management**: Company configuration, departments, roles, and permissions
- **User Authentication**: Secure login with mandatory password changes
- **Notification System**: Automated alerts and notifications
- **Audit Logs**: Login tracking and system activity monitoring

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Routing**: React Router
- **State Management**: React hooks and context
- **Testing**: Vitest for unit testing
- **Code Quality**: ESLint configuration

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

3. **Environment Configuration**
   
   Copy the `.env` file and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. **Database Setup**
   
   The application uses Supabase migrations for database schema. The migrations are located in the `supabase/migrations/` directory and will be applied automatically when you run the Supabase CLI commands.
   
   If you're setting up locally:
   ```bash
   npx supabase start
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Testing

Run the test suite:
```bash
npm run test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── employee-profile/ # Employee profile tabs
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components (Next.js-style routing)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── main.tsx            # Application entry point

supabase/
├── migrations/         # Database schema migrations
└── config.toml         # Supabase configuration
```

## Key Components

### Layout System
- `AppLayout`: Main application layout with sidebar navigation
- `AppSidebar`: Navigation sidebar with role-based menu items
- `TopBar`: Top navigation bar with user menu and notifications

### Core Features
- `AttendanceSummary`: Comprehensive attendance analytics and reporting
- `MandatoryPasswordChange`: Secure password update flow for new users
- `SearchableEmployeeSelect`: Employee selection component with search
- `BeudoxLogo`: Brand logo component with variant support

## Authentication & Security

The application uses Supabase Authentication with the following security measures:
- JWT-based authentication
- Mandatory password changes for temporary accounts
- Role-based access control (RBAC)
- Login tracking and audit logs

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.