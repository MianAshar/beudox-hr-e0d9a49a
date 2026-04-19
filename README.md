<!--
generated_by: tessera
source_sha: 9a92da7b5db4512a9fc5da058ea3cbe63095d858
generated_at: 2026-04-19T13:45:48.087Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track performance, handle payroll, manage leave requests, and maintain HR policies.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and offboarding
- **Performance Tracking**: Quarterly and daily evaluations with customizable parameters
- **Leave Management**: Request, approve, and track various types of leave
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Finance Dashboard**: Real-time financial insights and expense tracking

### Project & Client Management
- **Project Tracking**: Manage projects, assign team members, and track progress
- **Client Relations**: Maintain client information and project associations
- **Invoice Generation**: Create and manage client invoices with PDF export

### Administrative Tools
- **HR Policies**: Rich text policy documents with version control
- **Loan Management**: Track employee loans and deductions
- **Public Holidays**: Configure company-wide holiday schedules
- **Settings Management**: Configure departments, roles, leave types, and more

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text Editor**: Tiptap
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
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
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   You can apply them using the Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Access the application**
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

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
│   ├── [feature]/      # Feature-specific components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
├── test/               # Test files
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Auth for authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Limited access to personal data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.