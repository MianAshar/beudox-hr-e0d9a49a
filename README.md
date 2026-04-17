<!--
generated_by: tessera
source_sha: 21ae2096fc55f252e5448664d9f062a41ba0491c
generated_at: 2026-04-17T23:26:56.763Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track performance evaluations, handle leave requests, process payroll, and maintain HR policies.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profile management, and offboarding
- **Performance Evaluations**: Bi-annual evaluations and daily feedback system
- **Leave Management**: Request, approve, and track various types of leave
- **Payroll Processing**: Automated payroll generation with payslip management
- **HR Policies**: Rich text policy documents with full editing capabilities

### Business Operations
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices
- **Loan Management**: Track employee loans and repayments
- **Finance Sheets**: Comprehensive financial reporting and analysis

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Settings Management**: Configure company settings, departments, leave types, and evaluation parameters
- **Public Holidays**: Manage company-wide holiday schedules
- **Notifications**: Automated email notifications for various HR events

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent, accessible UI components
- **React Query** for efficient server state management
- **TipTap** for rich text editing in HR policies

### Backend & Infrastructure
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** database with custom migrations
- **Supabase Edge Functions** for server-side processing (payroll, invoices, notifications)

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **React Hook Form** with Zod validation for forms

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
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
   yarn install
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
   
   The project includes Supabase migrations. Run them in your Supabase project:
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Apply migrations
   supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
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
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for server-side logic
```

## Authentication & Authorization

The application uses Supabase Authentication with custom user roles:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and requests

Role-based access is enforced at the route level using the `canAccess` utility function.

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all linting passes: `npm run lint`
5. Run tests: `npm test`

## License

This project is proprietary software. All rights reserved.