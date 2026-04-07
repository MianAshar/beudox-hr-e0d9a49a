<!--
generated_by: tessera
source_sha: 158feb4bcbe81b9d3ed3b4a958eb8f2112e60653
generated_at: 2026-04-07T22:13:01.498Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete HR solution for managing employees, projects, evaluations, payroll, and organizational policies.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and organizational structure
- **Project Management**: Track projects, assign team members, and monitor project progress
- **Client Management**: Manage client relationships and project associations
- **Invoice Management**: Generate and track invoices for projects and services
- **Payroll Processing**: Automated payroll calculations and payslip generation
- **Loan Management**: Track employee loans and repayment schedules
- **Finance Dashboard**: Comprehensive financial reporting and analytics

### Performance & Evaluation
- **Quarterly Evaluations**: Formal performance reviews with structured feedback
- **Daily Evaluations**: Continuous feedback system for team members
- **Evaluation Timeline**: Historical view of all evaluations for employees

### HR Policies & Compliance
- **HR Policy Management**: Create and maintain company policies with rich text editing
- **Public Holidays**: Manage company-wide holiday schedules
- **Settings Management**: Configure company settings, departments, roles, and evaluation parameters

### User Roles & Access Control
- **CEO**: Full system access
- **HR Manager**: Employee management, evaluations, policies, and settings
- **Finance Manager**: Payroll, invoices, finance, and financial reporting
- **Team Lead**: Project management and team evaluations
- **Employee**: Personal dashboard, evaluations, and basic HR functions

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library built on Radix UI primitives
- **React Query** for efficient server state management
- **React Hook Form** with Zod validation for form handling

### Backend & Database
- **Supabase** for backend-as-a-service (authentication, database, real-time subscriptions)
- **PostgreSQL** database with Row Level Security

### Additional Libraries
- **Tiptap** for rich text editing in HR policies
- **Recharts** for data visualization in dashboards
- **date-fns** for date manipulation
- **Lucide React** for consistent iconography
- **React Image Crop** for avatar management

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
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
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   You can use the Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```
   
   The application will be available at `http://localhost:5173`

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
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings-specific components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Key Components

### Layout Components
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Responsive sidebar with role-based menu items
- **TopBar**: Header with user menu and notifications

### Core Components
- **BeudoxLogo**: Company logo component with variant support
- **SearchableEmployeeSelect**: Employee selection with search and filtering
- **EvaluationTimeline**: Timeline view of employee evaluations
- **RichTextEditor**: WYSIWYG editor for HR policies

## Authentication & Authorization

The application uses Supabase Authentication with custom role-based access control:

- Authentication is handled via Supabase Auth
- User roles are stored in the database and cached in the application
- Route protection is implemented with `ProtectedRoute` component
- Access control logic is centralized in `src/lib/role-access.ts`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing:

```bash
# Unit tests
npm run test

# E2E tests
npx playwright test
```

### Code Quality

- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** integration (via ESLint)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.