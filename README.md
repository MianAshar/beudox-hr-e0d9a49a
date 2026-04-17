<!--
generated_by: tessera
source_sha: 9f5994cb2e02ca6967a2f43a3aaef3e84c0735eb
generated_at: 2026-04-17T22:13:21.715Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This system provides organizations with tools to manage employees, projects, clients, payroll, evaluations, leave management, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Organization Settings**: Configure departments, roles, leave types, expense categories, and company information

### Performance & Evaluation
- **Quarterly Evaluations**: Formal performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations for employees

### Project & Client Management
- **Project Tracking**: Create and manage projects with detailed information
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and track invoices for projects

### Financial Management
- **Payroll Processing**: Automated payroll generation with attendance tracking
- **Loan Management**: Track employee loans and repayments
- **Finance Sheets**: Comprehensive financial reporting
- **Payslip Generation**: Employee payslip access and PDF generation

### Leave & Attendance
- **Leave Management**: Request, approve, and track leave balances
- **Public Holidays**: Configure and manage company holidays
- **Attendance Tracking**: Monitor employee attendance patterns

### Policy & Communication
- **HR Policies**: Create and manage company policies with rich text editing
- **Notifications**: Automated notifications for important events

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful, customizable components

### State Management & Data
- **TanStack Query** - Powerful data synchronization for React
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Rich Content & Charts
- **Tiptap** - Rich text editor for policies
- **Recharts** - Composable charting library
- **date-fns** - Modern JavaScript date utility library

### Backend & Database
- **Supabase** - Open source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Edge functions for business logic

### Development & Testing
- **Vitest** - Fast unit testing framework
- **Playwright** - End-to-end testing
- **ESLint** - Code linting
- **TypeScript** - Type checking

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
   
   You can use the Supabase CLI:
   ```bash
   supabase db reset
   ```

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
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations
└── ...

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for business logic
└── config.toml         # Supabase configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full access to all features
- **HR Manager**: Access to HR functions, evaluations, payroll
- **Team Lead**: Limited access to team management and evaluations
- **Employee**: Access to personal data, leave requests, profile

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.