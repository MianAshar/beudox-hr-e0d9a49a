<!--
generated_by: tessera
source_sha: 5682a75da22c4767737d769a1b570d4bea55ecf0
generated_at: 2026-04-01T00:09:25.978Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built for modern businesses. This system provides a complete suite of HR tools including employee management, attendance tracking, payroll processing, leave management, project management, and financial oversight.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Attendance Tracking**: Automated attendance recording with import capabilities and overtime calculations
- **Leave Management**: Comprehensive leave request system with balance tracking and approval workflows
- **Payroll Processing**: Full payroll management with salary history, bonuses, and deductions

### Project & Client Management
- **Project Management**: Project lifecycle management with team assignments and progress tracking
- **Client Management**: Client relationship management with invoicing and billing
- **Evaluations**: Performance evaluation system with customizable parameters

### Financial & Administrative
- **Finance Sheet**: Financial reporting and analysis tools
- **Office Expenses**: Expense tracking and approval system
- **Loans Management**: Employee loan processing and repayment tracking
- **HR Policies**: Document management system for company policies

### System Features
- **Role-Based Access Control**: Granular permissions for different user roles (Employee, HR Manager, Finance Manager, Team Lead, CEO)
- **Notifications**: In-app notification system
- **Settings**: Company-wide configuration management

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest + Playwright

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
   
   Copy the `.env` file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase as the backend. The database schema includes 40+ tables for comprehensive HR management. Run the migrations in the `supabase/migrations/` directory to set up the database.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   └── ui/            # shadcn/ui components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── integrations/      # External service integrations (Supabase)
└── test/              # Test files
```

## User Roles & Permissions

The system implements role-based access control with the following roles:

- **Employee**: Basic access to dashboard, attendance, projects, and notifications
- **HR Manager**: Full HR management including employees, attendance, leave, evaluations, and policies
- **Finance Manager**: Financial operations including payroll, expenses, loans, and outsourcing
- **Team Lead**: Project and evaluation management with team oversight
- **CEO**: Full system access to all features

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Testing

The project includes both unit tests (Vitest) and end-to-end tests (Playwright).

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.
