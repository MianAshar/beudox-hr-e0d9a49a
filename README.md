<!--
generated_by: tessera
source_sha: 0750a0f91d657ac84947a7b3427876080d9d0667
generated_at: 2026-04-07T21:30:19.220Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR provides organizations with tools to manage employees, projects, clients, payroll, evaluations, and HR policies in a unified, user-friendly interface.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and organizational structure
- **Role-Based Access Control**: Granular permissions system with roles like HR Manager, CEO, Team Lead, and Employee
- **Performance Evaluations**: Both quarterly formal evaluations and daily feedback mechanisms
- **Payroll Management**: Automated payroll processing, payslip generation, and salary management

### Project & Client Management
- **Project Tracking**: Create and manage projects with team assignments and progress tracking
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage invoices with PDF export capabilities

### HR Operations
- **HR Policies**: Create and manage company policies with rich text editing
- **Loan Management**: Track employee loans and repayments
- **Public Holidays**: Manage company-wide holiday schedules
- **Settings**: Configure company information, departments, roles, and evaluation parameters

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM
- **UI Components**: Radix UI (shadcn/ui)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

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
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`

4. Start the development server:
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
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication

The application uses Supabase Auth with email/password authentication. New employees are invited via email with temporary passwords that must be changed on first login.

## Authorization

Role-based permissions control access to different features:
- **CEO**: Full access to all features
- **HR Manager**: Employee management, evaluations, payroll
- **Team Lead**: Team member evaluations, project management
- **Employee**: Limited access to personal data and basic features

## Database

The application uses Supabase with PostgreSQL. Database migrations are located in the `supabase/migrations/` directory.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npx playwright test
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software owned by Beudox.