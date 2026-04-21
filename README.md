<!--
generated_by: tessera
source_sha: c22b35e7a9e2412e18c88d406ae14275f7dea9da
generated_at: 2026-04-21T11:10:38.284Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, attendance tracking, payroll processing, leave management, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Attendance Tracking**: Real-time attendance monitoring with check-in/check-out, overtime calculation, and reporting
- **Leave Management**: Comprehensive leave request and approval system with balance tracking
- **Payroll Processing**: Automated payroll generation with salary calculations, deductions, and payslip generation
- **Performance Evaluations**: Regular and daily performance reviews with customizable evaluation parameters

### Organizational Tools
- **Project Management**: Project tracking, team assignments, and activity logging
- **Client Management**: Client relationship management with detailed profiles
- **Invoice Management**: Invoice creation, tracking, and PDF generation
- **HR Policies**: Rich text policy documents with version control
- **Job Descriptions**: Structured job description management

### Administrative Features
- **Role-Based Access Control**: Granular permissions system for different user roles
- **Settings Management**: Configurable company settings, departments, roles, and system parameters
- **Finance Dashboard**: Financial overview with expense tracking and reporting
- **Loan Management**: Employee loan tracking and management

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library built on Radix UI primitives
- **React Hook Form** with Zod validation for form management
- **React Query** for server state management

### Backend & Infrastructure
- **Supabase** for backend-as-a-service (database, authentication, real-time subscriptions)
- **PostgreSQL** database with automated migrations
- **Supabase Edge Functions** for server-side logic

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **React Testing Library** for component testing

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
   
   Copy the environment template:
   ```bash
   cp .env .env.local
   ```
   
   Configure your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. If setting up a new project:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-id
   
   # Apply migrations
   supabase db push
   ```

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
│   ├── employee-profile/  # Employee profile tabs
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **Authentication**: Email/password with magic link support
- **Authorization**: Route-level and component-level permission checks
- **Roles**: Configurable roles with granular permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.