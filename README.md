<!--
generated_by: tessera
source_sha: 842e6a7199f663ff50096feaa00b5dbbc25d20a5
generated_at: 2026-04-28T21:21:42.461Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built with modern web technologies. This application provides a complete suite of HR tools for managing employees, attendance, leave, payroll, evaluations, and more.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with personal details, job information, and organizational structure
- **Attendance Tracking**: Automated attendance import from biometric devices (ZKTeco), manual entry, and comprehensive reporting
- **Leave Management**: Request, approve, and track various types of leave with balance calculations
- **Payroll Processing**: Automated payroll generation with overtime calculations and salary history
- **Performance Reviews**: Employee evaluations with customizable parameters and review schedules
- **Finance Management**: Expense tracking and financial summaries

### Administrative Tools
- **Company Settings**: Configure departments, roles, leave types, expense categories, and company policies
- **User Management**: Role-based access control with granular permissions
- **Notifications**: Automated alerts for reviews, leave requests, and important HR events
- **Audit Logs**: Comprehensive login tracking and activity monitoring

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **Authentication**: Supabase Auth
- **State Management**: React hooks and context
- **Testing**: Vitest
- **Deployment**: Lovable platform

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
   
   Copy the `.env` file and update the Supabase configuration:
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
   
   The application uses Supabase migrations. If setting up a new project:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your_project_ref
   
   # Apply migrations
   supabase db push
   ```

5. **Development Server**
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

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── main.tsx           # Application entry point

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions
```

## Key Components

### Authentication Flow
- **MandatoryPasswordChange**: Forces password reset for temporary accounts
- **Role-based Access**: Different permissions for HR, Managers, and Employees

### Attendance Management
- **AttendanceUploadFlow**: AI-powered Excel file parsing for bulk attendance import
- **Biometric Integration**: Supports ZKTeco device exports
- **Overtime Calculation**: Automatic regular and holiday overtime computation

### Employee Experience
- **Dashboard**: Personalized dashboard with relevant information
- **Self-service**: Employees can manage their own leave, view payroll, etc.
- **Notifications**: Real-time notifications for important events

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Use the provided UI components from shadcn/ui
3. Ensure proper error handling and loading states
4. Test components with Vitest
5. Follow the established folder structure

## License

This project is proprietary software for Beudox HR solutions.