<!--
generated_by: tessera
source_sha: 0ff6efb7fea87440925f59f47bae0d72be9a80ea
generated_at: 2026-04-01T11:12:52.385Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll, project tracking, invoicing, and HR policy administration for businesses.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and role-based access control
- **Attendance Tracking**: Monitor employee attendance and public holidays
- **Leave Management**: Handle vacation requests and approvals
- **Payroll Processing**: Generate payslips and manage salary information

### Financial Management
- **Invoice Generation**: Create and send professional invoices with PDF generation
- **Expense Tracking**: Monitor office expenses and outsourcing costs
- **Financial Reporting**: Comprehensive finance sheets and analytics
- **Loan Management**: Track employee loans and repayments

### Project & Client Management
- **Project Tracking**: Manage projects, assign team members, and track progress
- **Client Relations**: Maintain client profiles and project associations
- **Evaluations**: Performance reviews and employee assessments

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Notifications**: System-wide notification management
- **Settings**: Company configuration and user preferences

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui (Radix UI primitives), Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query for server state, Context API for auth
- **Authentication**: Supabase Auth with role-based access control
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest for unit tests, Playwright for E2E tests

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

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
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Set up the database:
   
   Run the Supabase migrations in order:
   ```bash
   supabase db reset
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

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
│   ├── layout/         # App layout components
│   ├── hr-policies/    # HR-specific components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── test/               # Test files

supabase/
├── functions/          # Edge functions
├── migrations/         # Database migrations
└── config.toml         # Supabase configuration
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Testing

Unit tests use Vitest and React Testing Library. E2E tests use Playwright.

Run tests:
```bash
npm run test
```

Run E2E tests:
```bash
npx playwright test
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is private and proprietary to Beudox.