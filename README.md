<!--
generated_by: tessera
source_sha: ada1378842aeb381d5e2d6419f96c1d4c5ee29a7
generated_at: 2026-04-13T11:17:09.567Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback
- **Leave Management**: Request, approve, and track various types of leave
- **Payroll Processing**: Automated payroll generation with payslips and financial reporting
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices
- **HR Policies**: Create and maintain company policies with rich text editing
- **Loan Management**: Track employee loans and repayments
- **Finance Dashboard**: Comprehensive financial overview and reporting

### User Experience
- **Role-Based Access Control**: Different permissions for employees, managers, and administrators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Notifications**: Stay updated with important HR events
- **Searchable Interfaces**: Quickly find employees, projects, and records
- **Data Visualization**: Charts and graphs for performance metrics and analytics

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with shadcn/ui component library
- **React Query** for efficient server state management
- **React Hook Form** with Zod validation for form handling

### Backend & Infrastructure
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** database with Row Level Security
- **Supabase Edge Functions** for server-side processing

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **Tailwind Typography** for rich text content

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

5. **Start Development Server**
   ```bash
   npm run dev
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
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for server-side logic
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application uses Supabase Auth with role-based access control:

- **Employee**: Basic access to personal data and requests
- **HR Manager**: Full HR functionality and employee management
- **CEO**: Complete system access including financial data
- **Team Lead**: Team management and evaluations

## API Integration

The frontend communicates with Supabase through:
- **REST API** for CRUD operations
- **Real-time subscriptions** for live updates
- **Edge Functions** for complex business logic (payroll, notifications)

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npx playwright test
```

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.