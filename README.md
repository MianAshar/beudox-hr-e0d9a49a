<!--
generated_by: tessera
source_sha: 34ed6905e2c8ad286ba7d5831009dd122904a9d4
generated_at: 2026-04-07T21:13:44.718Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, projects, clients, evaluations, payroll, and HR policies in a unified platform.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Role-Based Access Control**: Secure access with different permission levels (CEO, HR Manager, Team Lead, Employee)
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations

### Performance & Evaluation
- **Quarterly Evaluations**: Comprehensive performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback and performance tracking
- **Evaluation Timeline**: Historical view of all evaluations for employees

### Financial Management
- **Payroll Processing**: Automated payroll generation with attendance tracking
- **Invoice Management**: Create and manage client invoices
- **Loan Management**: Track employee loans and repayments
- **Payslip Generation**: Automated payslip creation and distribution

### HR Operations
- **HR Policies**: Rich text policy documents with full formatting support
- **Public Holidays**: Company-wide holiday management
- **Settings Management**: Configurable company settings, departments, roles, and parameters

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router DOM
- **UI Components**: Shadcn/ui (Radix UI primitives), Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

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

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase as its backend. You'll need to:

1. Create a Supabase project
2. Run the database migrations located in `supabase/migrations/`
3. Configure authentication settings
4. Set up storage buckets if needed

## Available Scripts

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
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings-specific components
│   └── [feature]/      # Feature-specific components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Architecture

### Frontend Architecture
- **Single Page Application** with client-side routing
- **Component-based architecture** using React functional components
- **Custom hooks** for business logic separation
- **Type-safe** development with TypeScript

### Data Flow
- **TanStack Query** for server state management
- **Supabase client** for database operations
- **Real-time subscriptions** for live updates
- **Optimistic updates** for better UX

### Authentication & Authorization
- **Supabase Auth** for user authentication
- **Role-based access control** with route protection
- **Session management** with automatic token refresh

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the linter: `npm run lint`
5. Run tests: `npm run test`
6. Commit your changes: `git commit -am 'Add your feature'`
7. Push to the branch: `git push origin feature/your-feature`
8. Submit a pull request

## License

This project is private and proprietary to Beudox.