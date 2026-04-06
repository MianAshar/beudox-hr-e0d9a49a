<!--
generated_by: tessera
source_sha: c8f41d5b3c5a74051ee2071aa7a7abec741ccc38
generated_at: 2026-04-06T20:46:46.898Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern companies. Beudox HR streamlines employee management, payroll processing, project tracking, client relationships, and organizational policies in a single, intuitive web application.

## Features

### People Management
- **Employee Profiles**: Complete employee information management including personal details, roles, and organizational hierarchy
- **Attendance Tracking**: Monitor employee attendance and work hours
- **Leave Management**: Handle vacation requests, sick leave, and other time-off policies
- **Public Holidays**: Configure and manage company-wide holiday schedules

### Finance & Payroll
- **Payroll Processing**: Automated salary calculations and payroll management
- **Invoice Management**: Create, send, and track client invoices
- **Financial Reporting**: Comprehensive finance sheets and expense tracking
- **Loan Management**: Handle employee loans and repayments
- **Office Expenses**: Track and categorize business expenses
- **Outsourcing**: Manage external vendor relationships and contracts

### Project & Client Management
- **Project Tracking**: Create and manage projects with timelines and milestones
- **Client Relationships**: Maintain detailed client profiles and interaction history
- **Evaluations**: Performance reviews and employee assessments

### HR Operations
- **HR Policies**: Create and manage company policies with rich text formatting
- **Notifications**: System-wide notification management
- **Settings**: Company configuration and system preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Framework**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editor**: Tiptap
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Prerequisites

- Node.js 18+
- npm or bun package manager

## Installation

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

3. Create environment file:
   ```bash
   cp .env .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

The application will be available at `http://localhost:5173`

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
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── hr-policies/    # Domain-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application uses Supabase for authentication with role-based access control. Different user roles have varying levels of access to features and data.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is proprietary software owned by Beudox.