<!--
generated_by: tessera
source_sha: 20a2f1f5aaf60ab6fe81637614aae9e908a14729
generated_at: 2026-04-30T00:46:42.059Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources management system built as a modern web application. This portal enables companies to manage employee attendance, leave requests, payroll, profiles, and organizational settings through an intuitive interface.

## Features

- **Employee Management**: Comprehensive employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording, summary reports, and anomaly detection
- **Leave Management**: Request, approve, and track leave balances across different leave types
- **Payroll Processing**: Generate payroll sheets, track salary history, and manage increments
- **Performance Reviews**: Schedule and manage employee evaluations and salary reviews
- **Project Management**: Assign employees to projects and track project activities
- **HR Policies**: Rich text editor for creating and managing company policies
- **Settings Management**: Configure departments, roles, leave types, expense categories, and company information
- **Notifications**: Automated notifications for important HR events
- **Security**: Role-based access control and secure authentication

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Routing**: React Router
- **State Management**: React hooks and context
- **Testing**: Vitest for unit testing
- **Deployment**: Configured for modern web deployment

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Supabase account and project

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the `.env` file and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order to set up the database schema.

5. **Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

6. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

1. **First Time Setup**: New users will be prompted to change their temporary password upon first login
2. **Dashboard**: Access the main dashboard to view attendance summaries, leave balances, and recent activities
3. **Employee Profiles**: View and manage employee information, including attendance history, leave records, and payroll details
4. **Attendance Management**: Upload attendance data, view summaries, and monitor punctuality metrics
5. **Leave Requests**: Employees can submit leave requests, managers can approve/reject them
6. **Payroll Processing**: Generate and review payroll sheets with overtime calculations
7. **Settings**: Administrators can configure company settings, departments, roles, and policies

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── employee-profile/ # Employee profile tabs
│   ├── settings/       # Settings management components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all components are properly typed

## License

This project is proprietary software. All rights reserved.