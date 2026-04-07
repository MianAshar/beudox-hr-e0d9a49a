<!--
generated_by: tessera
source_sha: 968c0cc3d2eee22677435e6183fdf693ec2e03c3
generated_at: 2026-04-07T20:49:36.107Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, project tracking, client relations, invoicing, policy administration, performance evaluations, and payroll processing for organizations.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Role-Based Access Control**: Secure access with different permission levels (CEO, HR Manager, Team Lead, Employee)
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback
- **Payroll Management**: Automated payroll generation with payslip distribution
- **Loan Management**: Employee loan tracking and management

### Business Operations
- **Project Management**: Project creation, assignment, and progress tracking
- **Client Management**: Client profiles and relationship management
- **Invoice Management**: Professional invoice generation and tracking
- **HR Policies**: Rich text policy documents with version control
- **Public Holidays**: Configurable holiday management

### Administrative Tools
- **Settings Management**: Company settings, departments, roles, and evaluation parameters
- **Expense Categories**: Configurable expense tracking categories
- **Attendance Tracking**: Employee attendance monitoring

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Vitest, Playwright

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

3. Configure environment variables:
   
   Copy `.env` and update the Supabase configuration:
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

The application uses Supabase for backend services. Database migrations are located in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-id`
3. Run migrations: `supabase db push`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   └── [feature]/      # Feature-specific components
├── pages/              # Page components and routing
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application implements role-based access control with the following roles:
- **CEO**: Full system access
- **HR Manager**: HR operations and management access
- **Team Lead**: Team management and evaluation access
- **Employee**: Limited access to personal data and basic features

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and run tests: `npm run test`
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Submit a pull request

## License

This project is private and proprietary to Beudox.