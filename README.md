<!--
generated_by: tessera
source_sha: b5485c341bfd9d2120406250767f8b36d408f25c
generated_at: 2026-04-19T21:33:49.847Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, projects, evaluations, payroll, leave management, and more.

## Features

- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Project Management**: Create and manage projects, assign team members, and track progress
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Payroll Management**: Automated payroll processing with overtime calculations and loan deductions
- **Leave Management**: Comprehensive leave tracking and approval workflows
- **Finance Dashboard**: Real-time financial insights with expense tracking and reporting
- **HR Policies**: Rich text policy documents with version control
- **Client Management**: Manage client relationships and project assignments
- **Invoice Management**: Generate and manage client invoices
- **Role-Based Access Control**: Granular permissions system for different user roles

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editor**: Tiptap
- **Testing**: Vitest + Playwright
- **Package Manager**: npm/bun

## Prerequisites

- Node.js 18+
- npm or bun
- Supabase account and project

## Setup Instructions

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

3. **Environment Configuration**
   
   Copy the `.env` file and update the Supabase configuration:
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
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   You can use the Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

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
│   ├── [feature]/      # Feature-specific components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
├── test/               # Test files
└── types/              # TypeScript type definitions
```

## User Roles

- **CEO**: Full access to all features
- **HR Manager**: Access to employee management, evaluations, payroll, and settings
- **Team Lead**: Access to team management, evaluations, and project oversight
- **Employee**: Limited access to personal profile, tasks, and leave management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.