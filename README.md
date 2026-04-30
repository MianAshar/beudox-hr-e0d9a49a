<!--
generated_by: tessera
source_sha: efbbd50b6d210611a4b2ee1cb2e74d971c2debbf
generated_at: 2026-04-30T11:45:27.985Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React application. This portal provides companies with tools to manage employees, track attendance, handle payroll, manage leave requests, conduct evaluations, and more.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Attendance Tracking**: Automated attendance recording with analytics and reporting
- **Leave Management**: Request, approve, and track leave balances
- **Payroll Processing**: Generate payslips and manage salary structures
- **Performance Evaluations**: Regular and daily evaluations with customizable parameters
- **Project Management**: Track projects, teams, and client relationships
- **Finance Management**: Invoice generation and financial reporting
- **HR Policies**: Rich text policy documents and job descriptions
- **Role-Based Access Control**: Secure access based on user roles and permissions

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: TanStack Query for server state
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text Editor**: Tiptap for policy documents
- **Testing**: Vitest + Playwright for E2E testing

## Prerequisites

- Node.js 18+
- npm or bun package manager
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
   
   Copy the `.env` file and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_URL`: Your Supabase project URL

4. **Database Setup**
   
   The application uses Supabase migrations. If setting up a new Supabase project:
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Apply migrations
   supabase db push
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
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
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix-based)
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication Flow

The application uses Supabase Auth with role-based access control:

1. Users log in with email/password
2. New users are prompted to change their temporary password
3. Access to routes is controlled based on user roles
4. JWT tokens are managed automatically by Supabase

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Use the provided UI components from `src/components/ui/`
3. Write tests for new features
4. Ensure all code passes linting

## License

This project is proprietary software for Beudox HR solutions.