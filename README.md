<!--
generated_by: tessera
source_sha: 5151392f5fe8986d95c2273f1a1fe20370854997
generated_at: 2026-04-07T22:19:37.690Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete HR suite for managing employees, projects, evaluations, payroll, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and directory
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Manage client relationships and project associations
- **Invoice Management**: Generate and track invoices for projects

### Performance & Evaluation
- **Quarterly Evaluations**: Comprehensive performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback and performance tracking
- **Evaluation Timeline**: Historical view of all evaluations for employees

### Financial Management
- **Payroll Processing**: Automated payroll generation with allowances and deductions
- **Loan Management**: Track employee loans and repayments
- **Finance Dashboard**: Comprehensive financial reporting and analytics
- **Payslip Access**: Secure employee access to personal payslips

### HR Operations
- **HR Policies**: Rich text policy documents with full formatting support
- **Public Holidays**: Centralized holiday management
- **Settings Management**: Configurable company settings, roles, and parameters

### Security & Access Control
- **Role-Based Access**: Five distinct user roles (Employee, Team Lead, HR Manager, Finance Manager, CEO)
- **Secure Authentication**: Supabase-powered authentication with password recovery
- **Protected Routes**: Granular access control for all application features

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, React hooks for local state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Rich Text Editing**: Tiptap editor
- **Charts & Data Visualization**: Recharts
- **Form Handling**: React Hook Form with Zod validation
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

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings-specific components
│   └── ...             # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## User Roles & Permissions

The application supports five user roles with different access levels:

- **Employee**: Basic access to personal data, evaluations, and projects
- **Team Lead**: Employee access plus team management capabilities
- **HR Manager**: Full HR operations including employee management and settings
- **Finance Manager**: Financial operations including payroll and invoicing
- **CEO**: Full system access to all features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.
