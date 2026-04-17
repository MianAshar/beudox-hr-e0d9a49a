<!--
generated_by: tessera
source_sha: 93ba9a42b1f47246ac1f0acfa152b243f990fa9d
generated_at: 2026-04-17T21:53:46.119Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Performance Evaluations**: Quarterly and daily evaluation systems with structured feedback
- **Leave Management**: Automated leave request and approval workflows
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **HR Policies**: Rich text policy documents with version control

### Business Operations
- **Project Management**: Project tracking with client and employee assignments
- **Client Management**: Client relationship and project association tracking
- **Invoice Management**: Automated invoice generation and PDF export
- **Loan Management**: Employee loan tracking and repayment schedules
- **Finance Dashboard**: Comprehensive financial reporting and analytics

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles
- **Company Settings**: Configurable departments, roles, leave types, and expense categories
- **Notifications**: Automated email notifications for key events
- **Public Holidays**: Configurable holiday calendar management

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing and navigation
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library built on Radix UI primitives
- **TanStack Query** for efficient server state management
- **React Hook Form** with Zod validation for form handling
- **TipTap** rich text editor for policy documents
- **Recharts** for data visualization
- **date-fns** for date manipulation

### Backend & Infrastructure
- **Supabase** (PostgreSQL database + Auth + Edge Functions)
- **Row Level Security (RLS)** for data access control
- **Real-time subscriptions** for live updates
- **File storage** for documents and images
- **Email integration** for notifications and communications

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** for code quality
- **TypeScript** for type checking

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

3. **Environment Configuration**
   
   Copy the environment template and configure your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase project details:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations for database schema. The migrations are located in `supabase/migrations/` and will be applied when you run the Supabase CLI commands.

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
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── BeudoxLogo.tsx  # Application logo component
├── pages/              # Route components/pages
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for serverless operations
└── config.toml         # Supabase project configuration
```

## User Roles & Permissions

The application implements role-based access control with the following roles:

- **CEO**: Full system access including all management features
- **HR Manager**: Employee management, evaluations, payroll, and settings
- **Team Lead**: Team member management and evaluations
- **Employee**: Personal profile, leave requests, and evaluations

## Key Workflows

### Employee Onboarding
1. HR creates employee profile with role assignment
2. System sends invitation email with password setup
3. Employee completes profile and starts using the system

### Performance Management
1. Daily evaluations for immediate feedback
2. Quarterly evaluations for comprehensive performance reviews
3. Automated reminders and deadline tracking

### Leave Management
1. Employee submits leave request with dates and reason
2. Automatic approval for certain leave types
3. Manager approval workflow for other requests
4. Leave balance tracking and validation

### Payroll Processing
1. Automated payroll generation based on attendance and salary data
2. PDF payslip generation and email distribution
3. Tax calculations and compliance reporting

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation for API changes
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.