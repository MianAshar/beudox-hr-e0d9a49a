<!--
generated_by: tessera
source_sha: c3e902ca7c83c3a40cc023715da0b21491c70e45
generated_at: 2026-04-17T23:56:39.967Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources Management System designed to streamline employee management, performance evaluations, leave tracking, project management, and financial operations for companies. Built with modern web technologies, it provides a user-friendly interface for HR managers, team leads, and employees to manage various aspects of workforce administration.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluations with feedback and recommendations
- **Leave Management**: Request, approve, and track employee leave balances
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Manage client relationships and project associations
- **Financial Management**: Invoice generation, payroll processing, and expense tracking
- **HR Policies**: Create and manage company policies with rich text editing
- **Settings**: Configure company settings, departments, roles, and system parameters
- **Role-Based Access Control**: Secure access based on user roles (CEO, HR Manager, Team Lead, Employee)

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui (Radix UI components), Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest, Playwright
- **Build Tools**: Vite, ESLint, TypeScript

## Prerequisites

- Node.js 18+
- npm or bun
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
   bun install
   ```

3. **Environment Configuration**
   
   Copy the `.env` file and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── evaluations/    # Evaluation-related components
│   ├── leave/          # Leave management components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Architecture Overview

The application follows a component-based architecture with:

- **React Router** for client-side routing
- **Protected Routes** with role-based access control
- **Supabase** for backend services (auth, database, real-time)
- **React Query** for efficient data fetching and caching
- **Modular component structure** organized by feature

## Contributing

1. Follow the existing code style and structure
2. Use TypeScript for type safety
3. Write tests for new features
4. Update documentation as needed

## License

This project is private and proprietary.