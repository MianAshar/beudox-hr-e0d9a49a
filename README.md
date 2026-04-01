<!--
generated_by: tessera
source_sha: 944a3134d3c54f804be4b9d4aeac2cb46b0060dd
generated_at: 2026-04-01T09:58:26.190Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built for modern businesses. Beudox HR provides tools for employee management, attendance tracking, payroll processing, project management, and more.

## Features

### Core HR Functions
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests, sick leave, and time-off policies
- **Payroll Processing**: Calculate salaries, bonuses, and deductions
- **Performance Evaluations**: Track employee performance and reviews

### Project & Client Management
- **Project Tracking**: Manage project timelines, resources, and deliverables
- **Client Relations**: Maintain client information and project associations
- **HR Policies**: Store and manage company policies and procedures

### Administrative Features
- **Role-Based Access Control**: Secure access based on employee roles
- **Notifications System**: Keep employees informed of important updates
- **Settings Management**: Configure system preferences and company information

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

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
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

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
3. Configure authentication and RLS policies
4. Set up Supabase Edge Functions for employee management operations

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
│   └── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application uses Supabase Auth for authentication with role-based access control. Employee roles determine access to different sections of the application.

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is private and proprietary to Beudox.