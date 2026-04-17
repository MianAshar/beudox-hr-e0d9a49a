<!--
generated_by: tessera
source_sha: 704ece94b7bb7bbc46344b522fa862ae8a7dd3f4
generated_at: 2026-04-17T23:46:42.284Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides a complete suite of HR tools including employee management, leave tracking, evaluations, payroll, project management, and more.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Leave Management**: Request, approve, and track leave balances and requests
- **Performance Evaluations**: Quarterly and daily evaluations with detailed feedback
- **Payroll Management**: Automated payroll processing and payslip generation
- **Project Management**: Track projects, clients, and resource allocation
- **HR Policies**: Rich text policy documents with full formatting support
- **Finance & Invoicing**: Invoice generation, expense tracking, and financial reporting
- **Settings & Configuration**: Company settings, roles, departments, and system configuration

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Radix UI components with Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query for server state, Context API for auth
- **Backend**: Supabase (PostgreSQL database, Authentication, Edge Functions)
- **Rich Text Editor**: Tiptap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest, Playwright for E2E

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
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
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
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

The application uses Supabase as the backend. The database schema includes migrations in the `supabase/migrations/` directory. To set up the database:

1. Create a new Supabase project
2. Run the migrations in order:
   ```bash
   supabase db push
   ```
3. Configure Row Level Security (RLS) policies as needed

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (sidebar, topbar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── BeudoxLogo.tsx  # Logo component
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Authentication

The application uses Supabase Authentication with email/password login. Role-based access control is implemented with different permission levels:

- CEO
- HR Manager
- Team Lead
- Employee

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.