<!--
generated_by: tessera
source_sha: 545dc3a8815d875f7cb23308b63e9db6fe152f3d
generated_at: 2026-04-01T10:26:20.221Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management system designed to streamline employee management, payroll, project tracking, and organizational operations. Built as a modern web application, it provides role-based access to various HR functions including employee profiles, attendance tracking, leave management, payroll processing, invoicing, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation, sick leave, and other time-off requests
- **Payroll Processing**: Calculate and manage employee salaries and benefits

### Financial Management
- **Invoicing System**: Create, send, and track invoices
- **Expense Tracking**: Monitor office expenses and outsourcing costs
- **Financial Reports**: Generate comprehensive financial sheets

### Project & Client Management
- **Project Tracking**: Manage projects, assign team members, and track progress
- **Client Relations**: Maintain client information and project associations
- **Evaluations**: Conduct employee performance evaluations

### Administrative Features
- **Public Holidays**: Configure and manage company holiday schedules
- **HR Policies**: Store and access company policies and procedures
- **Notifications**: System-wide notification management
- **Settings**: Company-wide configuration and preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or bun package manager
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
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase for authentication with role-based access control. Different user roles have varying levels of access to different sections of the application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.