<!--
generated_by: tessera
source_sha: a1bff7edbae84e80501fe849fd7caafe65784f2f
generated_at: 2026-04-27T22:53:31.948Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React application. This portal enables companies to manage employee data, attendance, leave requests, payroll, evaluations, and organizational settings through an intuitive web interface.

## Features

- **Employee Management**: Comprehensive employee profiles with personal information, job details, and organizational hierarchy
- **Attendance Tracking**: Upload and manage attendance records from biometric systems with AI-powered parsing
- **Leave Management**: Request, approve, and track leave balances and requests
- **Payroll Processing**: Generate payroll reports and manage salary information
- **Performance Evaluations**: Schedule and conduct employee evaluations with customizable parameters
- **Project Management**: Assign employees to projects and track project activities
- **Company Settings**: Configure departments, roles, leave types, expense categories, and company policies
- **Notifications**: Automated notifications for important HR events and deadlines

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database with real-time subscriptions)
- **Authentication**: Supabase Auth
- **State Management**: React hooks and context
- **Routing**: React Router
- **Forms**: React Hook Form with validation
- **Charts**: Recharts for data visualization
- **File Processing**: SheetJS for Excel file parsing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
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

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase project credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase as its backend. The database schema includes tables for:

- Employees and their profiles
- Attendance records
- Leave requests and balances
- Payroll data
- Company settings and configurations
- Projects and assignments

Database migrations are managed through Supabase and should be applied automatically when the project is set up.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee profile related components
│   ├── attendance/     # Attendance management components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Settings and configuration components
│   └── ...
├── pages/              # Page components and routing
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.