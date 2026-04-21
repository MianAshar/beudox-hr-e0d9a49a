<!--
generated_by: tessera
source_sha: 387391b56870e1f87a0608cfe39642ec2a98d0ba
generated_at: 2026-04-21T11:09:24.207Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies.

## Overview

Beudox HR is a full-featured HR management application that provides organizations with tools to manage employee data, track attendance, handle leave requests, process payroll, manage projects, and configure company settings. The system is designed to streamline HR operations and improve productivity.

## Features

### Employee Management
- **Employee Profiles**: Comprehensive employee information including personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Daily attendance records with check-in/check-out times, working hours, and overtime calculations
- **Leave Management**: Apply for leave, track balances, and manage leave requests
- **Payroll Processing**: Salary calculations, overtime pay, and payroll summaries
- **Document Management**: Store and manage employee documents (coming soon)

### HR Operations
- **Project Management**: Create and manage projects, assign team members, and track project activities
- **Performance Evaluations**: Schedule and conduct employee evaluations
- **Finance Overview**: Financial summaries and expense tracking
- **Notifications**: Automated notifications for important HR events

### System Administration
- **Company Settings**: Configure company information and policies
- **Department Management**: Organize employees by departments
- **Role-Based Access Control**: Define roles and permissions
- **Audit Logs**: Track system activities and login history

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library (shadcn/ui inspired)
- **Routing**: React Router
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database + real-time features)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Create environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for the backend. The database schema is managed through migrations located in the `supabase/migrations/` directory.

To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref <your-project-ref>`
3. Run migrations: `supabase db push`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── employee-profile/ # Employee profile related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and business logic
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add your feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Open a Pull Request

## License

This project is proprietary software. All rights reserved.