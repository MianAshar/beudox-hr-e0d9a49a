<!--
generated_by: tessera
source_sha: 6e3133e8531ac7a3f5865ccc31db25f1b96f2e4d
generated_at: 2026-04-19T21:46:52.676Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies.

## Overview

Beudox HR is a full-featured HR management application that provides organizations with tools to manage employees, projects, evaluations, payroll, leave, and more. The system includes role-based access control and supports various HR workflows including employee onboarding, performance evaluations, leave management, and financial tracking.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and directory
- **Project Management**: Project creation, team assignment, and progress tracking
- **Performance Evaluations**: Quarterly and daily evaluation systems
- **Leave Management**: Leave requests, approvals, and balance tracking
- **Payroll & Finance**: Payroll processing, expense tracking, and financial reporting
- **HR Policies**: Policy creation and management with rich text editing
- **Job Descriptions**: Structured job description management
- **Client & Invoice Management**: Client relationships and invoice generation
- **Settings**: Comprehensive system configuration
- **Role-based Access Control**: Granular permissions based on user roles

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text**: Tiptap
- **Icons**: Lucide React
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
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

### Available Scripts

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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Page components and routing
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
├── test/               # Test files
└── main.tsx           # Application entry point
```

## Authentication & Authorization

The application uses Supabase for authentication and implements role-based access control. User roles include:
- CEO
- HR Manager
- Team Lead
- Employee

Access to different sections of the application is controlled based on user roles.

## Database

The application uses Supabase with PostgreSQL. Database migrations are located in the `supabase/migrations/` directory and include tables for:
- Employees and user management
- Projects and project assignments
- Evaluations (quarterly and daily)
- Leave management
- Payroll and financial data
- HR policies and job descriptions
- Clients and invoices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is private and proprietary.