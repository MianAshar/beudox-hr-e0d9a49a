<!--
generated_by: tessera
source_sha: 2bd74d6b990f769987716ab8fe2672421a86d47b
generated_at: 2026-04-17T23:49:23.782Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Leave Management**: Automated leave request processing with balance tracking
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **HR Policies**: Rich text policy management and documentation

### Business Operations
- **Project Management**: Project tracking with client associations
- **Invoice Management**: Client invoicing and financial tracking
- **Loan Management**: Employee loan processing and tracking
- **Finance Dashboard**: Comprehensive financial reporting

### Administrative Tools
- **Role-Based Access Control**: Granular permissions for different user roles
- **Settings Management**: Configurable company settings, departments, and parameters
- **Public Holidays**: Holiday calendar management
- **Notifications**: Automated email notifications for key events

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL, Authentication, Edge Functions)
- **Rich Text Editing**: TipTap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest, Playwright (E2E)

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
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
# or
bun run build
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── evaluations/    # Evaluation-specific components
│   ├── leave/          # Leave management components
│   ├── settings/       # Settings components
│   └── hr-policies/    # HR policy components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control. User roles include:
- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Limited access to personal data

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.