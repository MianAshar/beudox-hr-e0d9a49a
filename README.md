<!--
generated_by: tessera
source_sha: 01ca8389405584c0035ceeac29cfba01918b60be
generated_at: 2026-04-17T22:53:33.214Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, project tracking, client relationships, payroll processing, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Leave Management**: Request, approve, and track employee leave balances
- **Performance Evaluations**: Quarterly and daily evaluation systems with feedback
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **HR Policies**: Rich text policy documents with version control

### Project & Client Management
- **Project Tracking**: Create and manage projects with team assignments
- **Client Relationships**: Maintain client information and project associations
- **Invoice Management**: Generate and track invoices with PDF export

### Administrative Tools
- **Role-Based Access Control**: Granular permissions for different user roles
- **Settings Management**: Configure company settings, departments, leave types, etc.
- **Finance Dashboard**: Overview of financial metrics and reports
- **Loan Management**: Track employee loans and repayments

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Shadcn/ui (Radix UI primitives) + Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form + Zod validation
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Testing**: Vitest + Playwright
- **Build Tools**: Vite + SWC

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
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
   
   Copy the environment file:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run them in your Supabase project:
   ```bash
   # Migrations are located in supabase/migrations/
   # Apply them through Supabase dashboard or CLI
   ```

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
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and business logic
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase configuration
```

## User Roles & Permissions

- **CEO**: Full access to all features
- **HR Manager**: Employee management, evaluations, settings
- **Team Lead**: Team member management, evaluations
- **Employee**: Limited access to personal data and requests

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

### Testing

The project includes both unit tests (Vitest) and end-to-end tests (Playwright).

```bash
# Run unit tests
npm run test

# Run e2e tests
npx playwright test
```

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.