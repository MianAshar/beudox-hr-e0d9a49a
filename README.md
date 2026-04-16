<!--
generated_by: tessera
source_sha: 92611a51c56234256b71584661527317e866f551
generated_at: 2026-04-16T22:40:31.677Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built for modern businesses. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Leave Management**: Automated leave requests, approvals, and balance tracking
- **Payroll Processing**: Automated payroll generation with payslips and financial reporting
- **HR Policies**: Rich text policy documents with version control

### Business Operations
- **Project Management**: Project tracking, client assignments, and resource allocation
- **Client Management**: Client profiles and relationship management
- **Invoice Management**: Automated invoice generation and tracking
- **Loan Management**: Employee loan processing and tracking
- **Finance Dashboard**: Comprehensive financial reporting and analytics

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Settings Management**: Configurable company settings, departments, leave types, and evaluation parameters
- **Notifications System**: Automated notifications for approvals and updates
- **Public Holidays**: Configurable holiday calendar management

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast development
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React Context for auth
- **Routing**: React Router v6 with protected routes
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Rich Text Editing**: TipTap editor for HR policies
- **Charts & Analytics**: Recharts for financial and performance visualizations
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
   
   Alternatively, if using Supabase CLI:
   ```bash
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
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for business logic
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal data and requests

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.