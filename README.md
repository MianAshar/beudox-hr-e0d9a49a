<!--
generated_by: tessera
source_sha: 366f3d035e3342d1bfe9e7bb78b06c3658b9a978
generated_at: 2026-04-19T12:55:38.506Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern React application. Beudox HR provides organizations with tools to manage employees, payroll, evaluations, leave requests, projects, clients, invoices, and more.

## Features

- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Payroll Processing**: Automated payroll calculations with overtime, bonuses, and deductions
- **Performance Evaluations**: Both quarterly formal evaluations and daily feedback systems
- **Leave Management**: Request, approve, and track various types of leave
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices
- **HR Policies**: Create and maintain company policies with rich text editing
- **Finance Dashboard**: Real-time financial insights and reporting
- **Role-Based Access Control**: Secure access based on user roles (CEO, HR Manager, Team Lead, Employee)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Shadcn/UI components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database with real-time subscriptions)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Rich Text Editing**: Tiptap
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Form Handling**: React Hook Form with Zod validation

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
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

This application requires a Supabase project with the database schema set up. The SQL migrations are located in the `supabase/migrations/` directory.

To set up the database:

1. Create a new Supabase project
2. Run the migrations in order:
   ```bash
   supabase db push
   ```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/UI base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── finance/        # Finance-related components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── settings/       # Settings components
├── pages/              # Page components (routes)
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
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.