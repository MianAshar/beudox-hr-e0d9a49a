<!--
generated_by: tessera
source_sha: e7eb9c4fe814411313df354e07ee4942f3f60d53
generated_at: 2026-04-01T10:51:15.170Z
action: update
-->

# Beudox HR Management System

Beudox HR is a comprehensive human resources management application designed to streamline employee management, payroll, project tracking, and organizational operations for companies. Built as a modern web application, it provides role-based access to various HR functions including employee profiles, attendance tracking, leave management, payroll processing, invoicing, and more.

## Features

### Core Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and organizational structure
- **Attendance & Leave**: Track attendance, manage public holidays, and handle leave requests
- **Payroll & Finance**: Process payroll, manage invoices, track loans, and monitor office expenses
- **Project Management**: Create and manage projects, assign team members, and track client relationships
- **HR Operations**: Handle evaluations, maintain HR policies, and manage notifications

### User Roles & Access Control
The application implements role-based access control where different user roles have varying levels of access to features:
- Dashboard access for all authenticated users
- Employee management for HR/admin roles
- Finance features for accounting roles
- Project management for project managers

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest with Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
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
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── settings/       # Settings-specific components
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Database Schema

The application uses Supabase with PostgreSQL. Key tables include:
- Employees and user profiles
- Projects and project assignments
- Clients and client relationships
- Invoices and financial records
- Attendance and leave records
- Company settings and configurations

Database migrations are located in `supabase/migrations/`.

## Authentication

Authentication is handled through Supabase Auth with support for:
- Email/password login
- Password reset and recovery
- Invite-based user registration
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is private and proprietary to Beudox.