<!--
generated_by: tessera
source_sha: 032d6bb634e9897711dc75712a837fea6fe47713
generated_at: 2026-04-27T09:41:22.591Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern businesses. Beudox HR streamlines employee management, attendance tracking, payroll processing, leave management, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Attendance Tracking**: Automated attendance monitoring with manual upload capabilities and detailed reporting
- **Leave Management**: Comprehensive leave request and approval system with balance tracking
- **Payroll Processing**: Automated payroll generation with payslip distribution

### Organizational Tools
- **Project Management**: Project tracking, team assignments, and activity logging
- **Client Management**: Client relationship management with detailed profiles
- **Invoice Management**: Invoice creation, tracking, and financial reporting
- **HR Policies**: Centralized policy management with rich text editing
- **Job Descriptions**: Structured job description management

### Performance & Evaluation
- **Employee Evaluations**: Regular performance reviews and feedback cycles
- **Daily Evaluations**: Daily check-ins and progress tracking
- **Salary Reviews**: Automated salary review scheduling and increment proposals

### Administrative Features
- **Role-Based Access Control**: Granular permissions system for different user roles
- **Settings Management**: Configurable company settings, departments, roles, and policies
- **Finance Dashboard**: Comprehensive financial overview and reporting
- **Loan Management**: Employee loan tracking and management

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **UI Components**: Radix UI primitives with custom theming
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text**: Tiptap editor for policy documents

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
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee profile tabs
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **Authentication**: Email/password with magic link support
- **Authorization**: Route-level and component-level permission checks
- **Roles**: Configurable roles with granular permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.