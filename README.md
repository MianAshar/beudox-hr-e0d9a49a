<!--
generated_by: tessera
source_sha: 9c80afc1b52db9f415efa1903cba4e5182b1af01
generated_at: 2026-04-27T12:31:25.792Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with React, TypeScript, and Supabase. This frontend application provides a modern, intuitive interface for managing employee data, attendance tracking, leave requests, payroll processing, and organizational settings.

## Features

### Core HR Functionality
- **Employee Management**: Comprehensive employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance import from biometric devices, manual entry, and detailed reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, personal)
- **Payroll Processing**: Automated payroll calculations with overtime, deductions, and salary history
- **Performance Reviews**: Employee evaluations, salary reviews, and increment proposals

### Administrative Tools
- **Company Settings**: Configure departments, roles, leave types, expense categories, and evaluation parameters
- **User Management**: Role-based access control with granular permissions
- **Project Management**: Team assignments, activity logging, and project tracking
- **Finance Overview**: Expense tracking and financial summaries
- **HR Policies**: Rich text editor for policy documents

### Technical Features
- **AI-Powered Data Processing**: Intelligent parsing of attendance files from various biometric systems
- **Real-time Notifications**: Automated alerts for leave requests, reviews, and system events
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Data Export**: CSV and PDF generation for reports and invoices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Custom component library based on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **State Management**: React Query for server state, Zustand for client state
- **Routing**: React Router
- **Forms**: React Hook Form with validation
- **Charts**: Recharts for data visualization

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
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   Key database entities include:
   - `employees`: Employee master data
   - `attendance_records`: Daily attendance entries
   - `leave_requests`: Leave applications and approvals
   - `payroll_records`: Salary and payroll data
   - `company_settings`: Organization-wide configuration

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

6. **Build for Production**
   ```bash
   npm run build
   # or
   bun run build
   ```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI primitives (buttons, forms, etc.)
│   ├── layout/          # Layout components (sidebar, header, etc.)
│   ├── attendance/      # Attendance-specific components
│   ├── employee-profile/ # Employee detail components
│   ├── leave/           # Leave management components
│   ├── payroll/         # Payroll components
│   └── ...
├── pages/               # Route-level page components
├── lib/                 # Utility functions and configurations
├── hooks/               # Custom React hooks
└── integrations/        # External service integrations
```

## Key Components

### Layout System
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Collapsible navigation menu with role-based menu items
- **TopBar**: Global header with notifications and user menu

### Core Features
- **AttendanceUploadFlow**: Multi-step wizard for importing attendance data with AI parsing
- **SearchableEmployeeSelect**: Type-ahead employee selection component
- **RichTextEditor**: WYSIWYG editor for HR policies and documents

### Data Display
- **DataTable**: Sortable, filterable tables with pagination
- **Charts**: Various chart types for analytics and reporting
- **Summary Cards**: KPI displays for dashboards

## Authentication & Authorization

The application uses Supabase Auth for user authentication with role-based access control:

- **Admin**: Full system access
- **HR Manager**: Employee and HR data management
- **Manager**: Team management and approvals
- **Employee**: Personal data and requests

## API Integration

### Supabase Edge Functions
- `parse-attendance-ai`: AI-powered attendance file parsing
- `generate-payroll`: Automated payroll calculation
- `generate-invoice-pdf`: PDF invoice generation
- `send-notification`: Email/SMS notifications

### Database Schema
The application manages complex relationships between:
- Employees and their attendance records
- Leave requests and approval workflows
- Payroll calculations and salary history
- Company settings and organizational structure

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Component naming follows React conventions

### State Management
- React Query for server state (API data)
- Local component state for UI interactions
- Optimistic updates for better UX

### Testing
- Vitest for unit testing
- Playwright for end-to-end testing
- Component testing with React Testing Library

## Deployment

The application is designed to be deployed on modern hosting platforms:

- **Vercel**: Recommended for frontend deployment
- **Netlify**: Alternative static hosting option
- **Docker**: Containerized deployment available

Ensure environment variables are configured in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team or refer to the internal documentation.