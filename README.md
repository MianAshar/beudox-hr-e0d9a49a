<!--
generated_by: tessera
source_sha: a21eaed3fbaa310c431e31116dbe60fe3b48348c
generated_at: 2026-04-07T22:40:55.098Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, payroll processing, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback
- **Payroll Management**: Automated payroll processing and payslip generation
- **Project Management**: Client projects, resource allocation, and time tracking
- **Financial Management**: Invoice generation, expense tracking, and financial reporting
- **HR Policies**: Rich text policy documents with version control
- **Loan Management**: Employee loan tracking and management

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Settings Management**: Company settings, departments, roles, attendance policies, and expense categories
- **Public Holidays**: Configurable holiday calendar
- **Client Management**: Client profiles and relationship management

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library built on Radix UI primitives

### Backend & Data
- **Supabase** for backend-as-a-service (authentication, database, real-time subscriptions)
- **PostgreSQL** database with comprehensive schema
- **TanStack Query** for efficient server state management

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **Tiptap** for rich text editing
- **React Hook Form** with Zod validation

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
   
   Copy the `.env` file and configure your Supabase credentials:
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

   The application will be available at `http://localhost:5173`

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
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal data and limited access

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure TypeScript types are properly defined
4. Run linting and tests before submitting

## License

This project is proprietary software. All rights reserved.