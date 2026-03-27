<!--
generated_by: tessera
source_sha: 4507847a31943b1e146942fce5377c9e1baf985e
generated_at: 2026-03-27T02:49:42.299Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies.

## Overview

Beudox HR is a full-featured HR management application designed to streamline employee management, attendance tracking, payroll processing, and organizational workflows. The system provides a clean, intuitive interface for HR professionals and employees to manage various aspects of workforce administration.

## Features

### Core HR Modules
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Attendance Tracking**: Daily attendance monitoring and public holiday management
- **Leave Management**: Comprehensive leave request and approval system
- **Payroll Processing**: Salary calculations, finance sheets, and payroll management
- **Financial Management**: Loan processing, office expense tracking, and outsourcing management
- **Project Management**: Project tracking and evaluation systems
- **HR Policies**: Centralized policy documentation and management
- **Notifications**: System-wide notification management
- **Settings**: Configurable system preferences

### Technical Features
- **Authentication**: Secure login with Supabase authentication
- **Responsive Design**: Mobile-first design with collapsible sidebar navigation
- **Real-time Updates**: Live data synchronization with Supabase
- **Form Validation**: Robust form handling with React Hook Form and Zod
- **Toast Notifications**: User feedback with Sonner and custom toast components
- **Theme Support**: Dark/light theme compatibility

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest, Playwright (E2E)
- **Build Tools**: Vite, ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or bun
- Supabase account and project

### Installation

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
   
   The application uses Supabase for data storage. The database schema includes:
   - Employees with company and role relationships
   - Companies and organizational structure
   - Roles and permissions
   - Row Level Security (RLS) policies for data access control
   
   Run the migration files in the `supabase/migrations/` directory to set up the database schema.

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` to access the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (AppLayout, Sidebar, TopBar)
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   └── ...             # Feature-specific components
├── pages/             # Route components
├── hooks/             # Custom React hooks
├── integrations/      # External service integrations
│   └── supabase/      # Supabase client and types
├── lib/               # Utility functions
└── ...
```

## Authentication

The application uses Supabase Authentication for user management. Users must be associated with employee records in the database to access the system. The authentication flow includes:

- Login/Logout functionality
- Password reset capabilities
- Session persistence
- Protected routes with automatic redirects

## Database Schema

Key entities include:
- **employees**: Employee profiles with auth integration
- **companies**: Organizational companies
- **roles**: User roles and permissions
- **employee_roles**: Many-to-many relationship between employees and roles

All tables use Row Level Security (RLS) to ensure users can only access data relevant to their company and role.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.