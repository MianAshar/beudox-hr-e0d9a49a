<!--
generated_by: tessera
source_sha: 20ef1eb521eec693f7ae1732004ba33e7dca4c1d
generated_at: 2026-04-19T13:01:00.948Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, leave tracking, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Organizational Structure**: Departments, roles, and hierarchical management
- **Profile Management**: Detailed employee profiles with personal and professional information

### Performance & Evaluation
- **Quarterly Evaluations**: Bi-annual performance reviews with structured feedback
- **Daily Evaluations**: Real-time peer and manager feedback system
- **Evaluation Timeline**: Historical view of all performance assessments

### Time & Attendance
- **Leave Management**: Comprehensive leave request and approval system
- **Public Holidays**: Configurable holiday calendar management
- **Attendance Tracking**: Time tracking and attendance monitoring

### Financial Management
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Expense Management**: Business expense tracking and reimbursement
- **Financial Reporting**: Revenue, expense, and payroll analytics with charts
- **Invoice Management**: Client invoicing and payment tracking

### Project Management
- **Project Tracking**: Project lifecycle management with team assignments
- **Client Management**: Client relationship and project association
- **Project Activity Logs**: Detailed activity tracking and reporting

### Administrative
- **HR Policies**: Rich text policy documents with version control
- **Loan Management**: Employee loan tracking and repayment schedules
- **Settings Management**: Configurable system settings and parameters

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI

### Backend & Data
- **Supabase** - PostgreSQL database with real-time subscriptions and authentication
- **TanStack Query** - Powerful data fetching and caching
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### Additional Libraries
- **React Router** - Client-side routing
- **Recharts** - Composable charting library
- **TipTap** - Rich text editor
- **Lucide React** - Beautiful icon library
- **date-fns** - Modern JavaScript date utility library

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
   
   Copy the environment template:
   ```bash
   cp .env .env.local
   ```
   
   Configure your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (sidebar, topbar)
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

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and management
- **Team Lead**: Team management and limited HR access
- **Employee**: Personal profile and basic features

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

```bash
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.