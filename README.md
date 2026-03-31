<!--
generated_by: tessera
source_sha: 4b6c7840184af8d9333056cebf98c520375f0140
generated_at: 2026-03-31T23:29:41.406Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, attendance, payroll, projects, and more through an intuitive web interface.

## Features

### Core HR Management
- **Employee Management**: Add, edit, and view employee profiles with detailed information
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests, sick leave, and other time-off policies
- **Public Holidays**: Manage and display company holiday schedules

### Financial Management
- **Payroll Processing**: Calculate and manage employee salaries and compensation
- **Finance Sheet**: Track financial data and reports
- **Loan Management**: Handle employee loan requests and repayments
- **Office Expenses**: Track and categorize business expenses
- **Outsourcing**: Manage external vendor relationships and contracts

### Project & Client Management
- **Project Tracking**: Create and manage projects with timelines and resources
- **Client Management**: Maintain client relationships and project assignments
- **Performance Evaluations**: Conduct employee performance reviews
- **HR Policies**: Store and manage company policies and procedures

### System Features
- **Role-Based Access Control**: Secure access based on user roles and permissions
- **Notifications**: Real-time alerts and system notifications
- **Settings**: Configurable system preferences and user settings

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui (built on Radix UI primitives)
- **State Management**: React Query for server state, React Context for auth
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Testing**: Vitest for unit tests, Playwright for E2E tests

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager

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

3. Set up environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

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
│   ├── ui/             # Shadcn/ui components
│   └── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application uses Supabase for authentication with role-based access control. User roles determine which features and pages are accessible. The system supports:

- Employee login and password management
- Invite-based user registration
- Password reset functionality
- Role-based route protection

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is private and proprietary to Beudox.