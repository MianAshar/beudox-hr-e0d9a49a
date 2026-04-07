<!--
generated_by: tessera
source_sha: c987c6b27d379c55b62aa248e56c96dd8eef51f1
generated_at: 2026-04-07T21:14:26.399Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, project tracking, client relations, invoicing, policy management, performance evaluations, and payroll processing.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoicing System**: Generate and manage invoices with PDF export
- **HR Policies**: Create and manage company policies with rich text editing
- **Performance Evaluations**: Quarterly and daily evaluation systems with timeline tracking
- **Payroll Management**: Automated payroll generation and payslip distribution
- **Loan Management**: Track employee loans and repayments
- **Role-Based Access Control**: Secure access based on user roles (HR Manager, CEO, Team Lead, Employee)

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui (Radix UI components)
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest, Playwright
- **Build Tools**: Vite, ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

### Run E2E Tests

```bash
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings-related components
│   └── ...             # Feature-specific components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Database Schema

The application uses Supabase with the following main tables:
- `employees` - Employee information and profiles
- `companies` - Company/organization data
- `projects` - Project management
- `clients` - Client information
- `invoices` - Invoice management
- `evaluations` - Quarterly performance evaluations
- `daily_evaluations` - Daily feedback system
- `hr_policies` - Company policies
- `payroll` - Payroll records
- `loans` - Employee loans

## Authentication & Authorization

- **Authentication**: Supabase Auth with email/password
- **Roles**: hr_manager, ceo, team_lead, employee
- **Access Control**: Route-level protection with role-based permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.