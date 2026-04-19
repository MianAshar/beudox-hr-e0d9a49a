<!--
generated_by: tessera
source_sha: 4e2fedc679fa3d3d4b6efaee02682e6c65c72603
generated_at: 2026-04-19T13:54:32.019Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, payroll processing, leave management, and financial tracking for organizations.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Organization Structure**: Departments, roles, and hierarchical management

### Performance & Evaluation
- **Quarterly Evaluations**: Comprehensive performance reviews with recommendations
- **Daily Evaluations**: Real-time feedback and peer reviews
- **Evaluation Timeline**: Historical view of all evaluations with ratings and comments

### Financial Management
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Expense Tracking**: Monthly expense management and reporting
- **Financial Dashboard**: Revenue and expense trends with interactive charts
- **Loan Management**: Employee loan tracking and deductions

### Leave & Time Management
- **Leave Requests**: Streamlined leave application and approval workflow
- **Leave Balances**: Real-time tracking of leave entitlements
- **Public Holidays**: Configurable holiday calendar

### Project Management
- **Project Tracking**: Project lifecycle management
- **Client Management**: Client relationship and invoice tracking
- **Task Management**: Individual and team task assignment

### Policy & Documentation
- **HR Policies**: Rich text policy documents with full editing capabilities
- **Document Management**: Centralized policy storage and access

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing

### UI & Styling
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible, unstyled UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization components

### State Management & Data
- **TanStack Query** - Powerful data synchronization for React
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Supabase** - Backend-as-a-Service with PostgreSQL database

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
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

3. **Configure environment variables**
   
   Copy `.env` and update the Supabase configuration:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

### Database Setup

The application uses Supabase as its backend. The database schema includes tables for:
- Companies and employees
- Roles and permissions
- Evaluations and daily feedback
- Payroll and financial records
- Projects and clients
- Leave management
- HR policies

Database migrations are located in the `supabase/migrations/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── finance/        # Financial components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Authentication

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

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