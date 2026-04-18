<!--
generated_by: tessera
source_sha: 9702a051f92ea0fd6730afbc4c5b603380ea9173
generated_at: 2026-04-18T00:37:56.180Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies.

## Overview

Beudox HR is a full-featured HR management application that streamlines employee management, performance tracking, leave administration, payroll processing, and organizational workflows. The system provides role-based access control and a modern, intuitive interface for managing all aspects of human resources.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback and rating mechanisms
- **Leave Management**: Comprehensive leave tracking, balances, and approval workflows
- **Payroll Processing**: Automated payroll generation with payslip management
- **Project Management**: Project tracking, client management, and resource allocation

### Administrative Tools
- **HR Policies**: Rich text policy documents with version control
- **Invoice Management**: Client invoicing and financial tracking
- **Loan Management**: Employee loan tracking and administration
- **Finance Dashboard**: Financial reporting and analytics
- **Settings Management**: Company configuration, departments, roles, and system settings

### User Experience
- **Role-Based Access Control**: Granular permissions for Employee, HR Manager, Finance Manager, Team Lead, and CEO roles
- **Responsive Design**: Modern UI built with shadcn/ui components
- **Real-time Notifications**: Integrated notification system
- **Mobile-Friendly**: Optimized for all device sizes

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui (Radix UI primitives), Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest, Playwright

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

5. **Development Server**
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

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Authentication with Row Level Security (RLS) policies. User roles determine access to different features:

- **CEO**: Full system access
- **HR Manager**: Employee management, evaluations, policies
- **Finance Manager**: Payroll, invoices, financial reports
- **Team Lead**: Team management, evaluations
- **Employee**: Personal dashboard, leave requests, evaluations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.