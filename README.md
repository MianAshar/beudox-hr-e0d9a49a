<!--
generated_by: tessera
source_sha: 5907e75cc306a3ede9543ace57e5bf93a77fd02b
generated_at: 2026-04-23T22:09:30.254Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies to streamline HR operations, employee management, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Attendance Tracking**: Automated attendance monitoring with reporting and analytics
- **Leave Management**: Request, approval, and tracking of various leave types
- **Payroll Processing**: Automated payroll calculations and payslip generation
- **Performance Evaluations**: Regular and daily performance assessments

### Organizational Tools
- **Project Management**: Project tracking, team assignments, and activity logging
- **Client Management**: Client relationships and invoice generation
- **HR Policies**: Centralized policy management with rich text editing
- **Job Descriptions**: Structured job posting and description management
- **Finance Management**: Financial reporting and expense tracking

### Administrative Features
- **Role-Based Access Control**: Granular permissions system
- **Settings Management**: Company configuration, departments, roles, and policies
- **Public Holidays**: Holiday calendar management
- **Loan Management**: Employee loan tracking and management

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL database, Authentication, Edge Functions)
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, React Context for auth
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **Charts**: Recharts
- **Rich Text Editing**: TipTap
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

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
   
   Copy the environment file and configure your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase project details:
   ```env
   VITE_SUPABASE_PROJECT_ID=your-project-id
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in your Supabase project:
   ```bash
   # Migrations are located in supabase/migrations/
   # Apply them through Supabase dashboard or CLI
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build
```

Preview the production build:
```bash
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
│   ├── employee-profile/  # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Authentication & Authorization

The application uses Supabase Authentication with a custom role-based access control system. User roles determine access to different features and pages.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.