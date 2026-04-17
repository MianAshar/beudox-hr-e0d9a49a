<!--
generated_by: tessera
source_sha: 7ffb1b86e9cd74132ef738aca1165796264a4de4
generated_at: 2026-04-17T15:13:38.066Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies to streamline HR operations for businesses.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Performance Evaluations**: Quarterly and daily performance reviews with structured feedback
- **Payroll Processing**: Automated payroll generation with payslips and financial reporting
- **HR Policies**: Create and manage company policies with rich text editing

### Business Operations
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices with PDF export
- **Loan Management**: Track employee loans and repayment schedules
- **Finance Dashboard**: Comprehensive financial overview and reporting

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Settings Management**: Configure company settings, departments, leave types, and more
- **Public Holidays**: Manage company-wide holiday schedules
- **Notifications**: Automated notifications for important HR events

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library built on Radix UI primitives

### Data Management
- **Supabase** for backend-as-a-service (database, authentication, real-time subscriptions)
- **TanStack Query** for efficient server state management and caching
- **React Hook Form** with Zod validation for robust form handling

### Rich Features
- **TipTap** rich text editor for policy documents
- **Recharts** for data visualization and analytics
- **React Image Crop** for profile picture management
- **xlsx** for Excel export functionality
- **date-fns** for date manipulation and formatting

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** with TypeScript rules for code quality
- **TypeScript** for type safety across the application

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
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_PROJECT_ID=your-project-id
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. If setting up a new project:
   ```bash
   cd supabase
   supabase db reset
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
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Route components/pages
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for backend logic
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full access to all features
- **HR Manager**: Access to HR functions, employee management, payroll
- **Team Lead**: Limited access to team management and evaluations
- **Employee**: Access to personal data, leave requests, evaluations

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Ensure all linting passes
4. Test across different user roles and permissions

## License

This project is proprietary software for Beudox HR solutions.