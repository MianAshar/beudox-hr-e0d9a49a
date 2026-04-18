<!--
generated_by: tessera
source_sha: 09e0c31289d212e2667da89ff8a6b0a3a8b71061
generated_at: 2026-04-18T00:43:27.978Z
action: update
-->

# Beudox HR Management System

A comprehensive web-based Human Resources management application built with modern web technologies. This system provides organizations with tools to manage employees, projects, evaluations, leave, payroll, and more.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Leave Management**: Request, approve, and track employee leave with various leave types
- **Performance Evaluations**: Bi-annual evaluations and daily feedback system
- **Payroll Management**: Automated payroll processing and payslip generation
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Manage client relationships and project assignments
- **Invoice Management**: Create and manage client invoices
- **HR Policies**: Create and maintain company policies with rich text editing
- **Loan Management**: Track employee loans and repayments
- **Finance Dashboard**: Comprehensive financial reporting and analytics

### User Roles & Access Control
- **CEO**: Full system access
- **HR Manager**: Employee management, evaluations, policies, settings
- **Finance Manager**: Payroll, invoices, finance, expenses
- **Team Lead**: Project management, team evaluations, limited employee access
- **Employee**: Personal dashboard, leave requests, evaluations, payslips

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **shadcn/ui** component library built on Radix UI
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **Tiptap** for rich text editing
- **Recharts** for data visualization

### Backend & Database
- **Supabase** (PostgreSQL database + Auth + Edge Functions)
- **Row Level Security (RLS)** policies for data access control
- **Real-time subscriptions** for live updates

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** for code linting
- **TypeScript** for type safety

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
   
   The database schema is managed through Supabase migrations. The migrations are located in the `supabase/migrations/` directory and will be applied when you set up your Supabase project.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for serverless operations
└── config.toml         # Supabase project configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Auth for user authentication. Role-based access control is implemented at the route level, with each user role having specific permissions defined in `src/lib/role-access.ts`.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is proprietary software owned by Beudox.