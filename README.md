<!--
generated_by: tessera
source_sha: 9fa1d09e6ad40d3c1a2750b2863dbf3a2290aa19
generated_at: 2026-04-23T11:10:09.709Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This system provides organizations with tools to manage employees, payroll, leave requests, performance evaluations, projects, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal information, roles, and organizational structure
- **Attendance Tracking**: Daily attendance records with check-in/check-out times, overtime tracking, and absence management
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and deductions

### Performance & Development
- **Performance Evaluations**: Regular and daily performance reviews with customizable evaluation parameters
- **Salary Reviews**: Salary history tracking and increment proposals
- **Job Descriptions**: Detailed job role definitions and requirements

### Project Management
- **Project Tracking**: Project lifecycle management with team assignments and activity logging
- **Client Management**: Client information and relationship tracking
- **Task Management**: Individual and team task assignments

### Administrative
- **HR Policies**: Rich text policy documents and guidelines
- **Settings Management**: Company settings, departments, roles, and system configuration
- **Finance Overview**: Financial summaries and expense tracking
- **Invoice Management**: Client invoicing and billing

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN/UI** - High-quality component library built on Radix UI

### Backend & Data
- **Supabase** - PostgreSQL database with real-time capabilities and authentication
- **React Query** - Powerful data fetching and caching

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing
- **TypeScript** - Type checking

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager

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
   
   Copy the `.env` file and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── ...
```

## Key Components

### Layout System
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Navigation sidebar with role-based menu items
- **TopBar**: Header with user menu and notifications

### Core Features
- **Employee Profiles**: Comprehensive employee information with tabs for attendance, leave, payroll, etc.
- **SearchableEmployeeSelect**: Reusable component for selecting employees with search functionality
- **AttendanceTab**: Monthly attendance view with summary statistics
- **BeudoxLogo**: Brand logo component with variant support

## Authentication & Authorization

The application uses Supabase authentication with role-based access control:
- **Session Management**: Automatic login/logout handling
- **Protected Routes**: Route-level protection based on user roles
- **Password Reset**: Invite and recovery flow support

## Database Schema

The application uses Supabase with PostgreSQL. Key tables include:
- `employees` - Employee information
- `attendance_records` - Daily attendance data
- `leave_requests` - Leave applications
- `payroll_records` - Salary and payroll data
- `projects` - Project information
- `evaluations` - Performance reviews
- `hr_policies` - Company policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.