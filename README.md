<!--
generated_by: tessera
source_sha: 3f5b98fbaa46f9fbbb1092622651a32ae423e401
generated_at: 2026-03-27T22:10:21.090Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete HR solution for managing employees, attendance, payroll, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles and information
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation, sick leave, and other time-off requests
- **Public Holidays**: Manage and display public holiday schedules

### Financial Management
- **Payroll Processing**: Calculate and manage employee salaries
- **Finance Sheet**: Financial reporting and analysis
- **Loan Management**: Track employee loans and repayments
- **Office Expenses**: Monitor and categorize business expenses
- **Outsourcing**: Manage external contractor relationships

### Project & Performance
- **Project Management**: Track organizational projects
- **Employee Evaluations**: Performance reviews and assessments
- **HR Policies**: Document and manage company policies

### System Features
- **Notifications**: In-app notification system
- **Settings**: System configuration and preferences
- **Authentication**: Secure login with password recovery
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest with Playwright for E2E

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

3. Set up environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

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
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # App layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
├── lib/                # Utility functions
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

## Authentication

The application uses Supabase for authentication with the following features:
- Email/password login
- Password reset via email
- User invitation and account setup
- Session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.