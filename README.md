<!--
generated_by: tessera
source_sha: 78cff6f3879bb425833e882c1fe18dfe70233b60
generated_at: 2026-04-20T20:24:47.422Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. This application provides a complete suite of HR tools for managing employees, payroll, evaluations, leave, projects, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Role-Based Access Control**: Granular permissions system with multiple user roles
- **Organization Settings**: Configure departments, roles, leave types, and company policies

### Performance & Evaluation
- **Quarterly Evaluations**: Bi-annual performance reviews with detailed feedback
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with ratings and comments

### Payroll & Finance
- **Payroll Processing**: Automated payroll calculations with overtime and bonuses
- **Expense Tracking**: Monthly expense management and reporting
- **Finance Dashboard**: Visual analytics with 6-month trend charts
- **Invoice Management**: Client invoicing with PDF generation

### Leave & Time Management
- **Leave Management**: Request, approve, and track various leave types
- **Attendance Tracking**: Daily attendance monitoring
- **Public Holidays**: Configurable holiday calendar

### Project Management
- **Project Tracking**: Two versions of project management (legacy and v2)
- **Team Management**: Assign team members and track project progress
- **Client Management**: Maintain client relationships and project assignments

### Additional Features
- **HR Policies**: Rich text policy documents with version control
- **Job Descriptions**: Structured job posting and description management
- **Loan Management**: Employee loan tracking and deductions
- **Task Management**: Personal task tracking for employees

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text**: Tiptap for policy editing
- **Testing**: Vitest + Playwright for E2E

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

5. **Development Server**
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
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for backend logic
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Auth for authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is private and proprietary to Beudox.