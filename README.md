<!--
generated_by: tessera
source_sha: 91a7ddffb5c8bb2e9463683161eacd0d041403f9
generated_at: 2026-04-12T19:31:32.730Z
action: update
-->

# Beudox HR Management System

A comprehensive HR management platform built with modern web technologies, designed to streamline employee management, project tracking, evaluations, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Leave Management**: Request, approve, and track leave balances across different leave types
- **Performance Evaluations**: Quarterly evaluations and daily feedback system
- **HR Policies**: Rich text policy documents with full formatting support

### Project & Client Management
- **Project Tracking**: Create and manage projects with team assignments
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and track invoices for projects

### Financial Management
- **Payroll Processing**: Automated payroll generation with attendance tracking
- **Expense Management**: Track and approve employee expenses
- **Loan Management**: Handle employee loan requests and repayments
- **Financial Reporting**: Comprehensive finance sheets and analytics

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles
- **Company Settings**: Configure departments, roles, leave types, and evaluation parameters
- **Notifications**: Automated notifications for important HR events
- **Public Holidays**: Manage company-wide holiday schedules

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **Radix UI** components for accessible, unstyled UI primitives
- **shadcn/ui** for pre-built, customizable components

### Backend & Data
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** database with complex relationships
- **TanStack Query** for server state management and caching

### Development Tools
- **ESLint** for code linting
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **TypeScript** for type checking

### Key Libraries
- **React Hook Form** + **Zod** for form validation
- **Tiptap** for rich text editing
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **Lucide React** for icons

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
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
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
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── ...
```

## User Roles & Permissions

The system implements role-based access control with the following roles:

- **CEO**: Full access to all features
- **HR Manager**: Employee management, evaluations, leave, policies, settings
- **Finance Manager**: Payroll, invoices, finance, expenses
- **Team Lead**: Project management, evaluations, team oversight
- **Employee**: Basic features like dashboard, evaluations, leave requests

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses ESLint for code linting and follows TypeScript strict mode for type safety. All components are built with accessibility in mind using Radix UI primitives.

### Testing

Unit tests are written with Vitest and React Testing Library. E2E tests use Playwright.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.