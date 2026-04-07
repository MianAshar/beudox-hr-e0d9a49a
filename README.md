<!--
generated_by: tessera
source_sha: ce193b4ca013f8f4ac615198980c51c5f1e9368c
generated_at: 2026-04-07T21:36:50.752Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. This application provides a complete suite of HR tools for managing employees, projects, clients, evaluations, payroll, and organizational policies.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Role-Based Access Control**: Granular permissions system with roles like HR Manager, CEO, Team Lead, and Employee
- **Authentication & Security**: Secure login with password recovery and invite-based employee onboarding

### Performance & Evaluation
- **Quarterly Evaluations**: Formal performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with filtering based on user roles

### Project & Client Management
- **Project Tracking**: Create and manage projects with team assignments
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and track invoices with PDF export capabilities

### Financial & Payroll
- **Payroll Processing**: Automated payroll generation with allowances and deductions
- **Payslip Generation**: Employee access to personal payslips
- **Finance Dashboard**: Comprehensive financial overview and reporting

### Organizational Tools
- **HR Policies**: Rich text policy documents with full formatting support
- **Public Holidays**: Company-wide holiday management
- **Loan Management**: Employee loan tracking and management
- **Settings Management**: Configurable company settings, departments, roles, and evaluation parameters

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library built on Radix UI primitives

### State Management & Data
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling
- **Supabase** as the backend-as-a-service platform

### Rich Text & UI Enhancements
- **TipTap** rich text editor for policy documents
- **Recharts** for data visualization
- **Lucide React** for consistent iconography
- **Date-fns** for date manipulation

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** with TypeScript support for code quality

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
│   ├── settings/       # Settings-specific components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for server-side logic
└── config.toml         # Supabase project configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application implements a comprehensive role-based access control system:

- **CEO**: Full access to all features
- **HR Manager**: Access to HR functions, evaluations, and settings
- **Team Lead**: Limited access to team management and evaluations
- **Employee**: Access to personal data and basic features

Routes are protected with authentication checks and role-based permissions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.