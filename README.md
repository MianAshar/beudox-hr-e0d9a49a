<!--
generated_by: tessera
source_sha: 80efe2046d217f238257691701ebade568760af2
generated_at: 2026-04-12T19:59:55.824Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This system provides organizations with tools to manage employees, track performance evaluations, handle leave requests, process payroll, and maintain HR policies.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback and recommendations
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll generation with payslips and financial reporting
- **HR Policies**: Create and manage company policies with rich text editing

### Business Operations
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices with PDF export
- **Loan Management**: Track employee loans and repayment schedules
- **Public Holidays**: Configure and manage company holiday calendars

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Settings Management**: Configure company details, departments, leave types, expense categories, and more
- **Notifications System**: Automated notifications for important HR events
- **Finance Dashboard**: Comprehensive financial reporting and analytics

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React Hook Form for forms
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Rich Text Editing**: TipTap editor
- **Charts & Analytics**: Recharts
- **Testing**: Vitest with React Testing Library, Playwright for E2E
- **Deployment**: Configured for modern hosting platforms

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
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
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal data and requests

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure all linting passes

## License

This project is proprietary software. All rights reserved.