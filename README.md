<!--
generated_by: tessera
source_sha: 84730b592bff08963ab922338ed5d22181c3cf2b
generated_at: 2026-04-30T20:25:09.615Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application for companies to manage their workforce efficiently.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Attendance Tracking**: Automated attendance recording with analytics and reporting
- **Leave Management**: Request, approve, and track various types of leave
- **Payroll Processing**: Automated payroll generation with payslips and salary history
- **Performance Evaluations**: Regular and daily evaluations with customizable parameters
- **Project Management**: Track projects, assign team members, and monitor progress
- **Finance Management**: Invoice generation, expense tracking, and financial reporting
- **HR Policies**: Create and manage company policies with rich text editing
- **Job Descriptions**: Maintain detailed job descriptions and requirements
- **Loan Management**: Track employee loans and repayments
- **Settings & Configuration**: Company-wide settings, roles, departments, and more

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage, Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text**: Tiptap for policy editing
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Prerequisites

- Node.js 18+
- npm or yarn or bun
- Supabase account and project

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Configuration**
   
   Copy the `.env` file and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase as the backend. The database schema is managed through migrations in the `supabase/migrations/` directory. Ensure your Supabase project has these migrations applied.

5. **Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

6. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Authentication for user management. Upon first login, users are required to change their temporary password. Role-based access control is implemented throughout the application, with different permissions for various user roles.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is proprietary software owned by Beudox.