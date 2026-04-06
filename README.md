<!--
generated_by: tessera
source_sha: 247b426bc652ef09d0fac2ecae34326e693019cd
generated_at: 2026-04-06T21:29:47.445Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with React, TypeScript, and Supabase. Beudox HR provides organizations with tools to manage employees, payroll, projects, clients, and HR policies in a modern, user-friendly interface.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and personnel records
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests, sick leave, and time-off policies
- **Payroll Processing**: Calculate salaries, manage payroll cycles, and generate payslips

### Financial Management
- **Invoice Management**: Create, send, and track invoices for clients
- **Expense Tracking**: Monitor office expenses and outsourcing costs
- **Loan Management**: Handle employee loans and repayments
- **Financial Reporting**: Comprehensive finance sheets and analytics

### Project & Client Management
- **Project Tracking**: Manage project lifecycle from initiation to completion
- **Client Relations**: Maintain client information and project associations
- **Evaluations**: Performance reviews and employee assessments

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Public Holidays**: Configure and manage holiday calendars
- **Settings**: Company configuration, departments, roles, and system preferences
- **Notifications**: System-wide notification management

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6 with protected routes
- **State Management**: TanStack Query for server state
- **Authentication**: Supabase Auth with role-based access control
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editing**: Tiptap editor
- **Charts & Analytics**: Recharts
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
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
   
   Copy the `.env` file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start the development server**
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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   ├── settings/       # Settings-specific components
│   └── hr-policies/    # HR policy components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application uses role-based access control with the following roles:
- **Admin**: Full system access
- **Manager**: Department and team management
- **Employee**: Limited access to personal data and assigned tasks

Routes are protected based on user roles, with automatic redirection for unauthorized access.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.
