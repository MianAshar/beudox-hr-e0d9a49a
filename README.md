<!--
generated_by: tessera
source_sha: f63f9a4c4df73e5a5f950ac60a182985cba7140d
generated_at: 2026-04-20T20:13:29.420Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, leave tracking, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Profile Management**: Detailed employee profiles with personal information, job details, and history

### Performance & Evaluation
- **Quarterly Evaluations**: Bi-annual performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with visibility controls

### Financial Management
- **Payroll Processing**: Automated payroll calculations with overtime, bonuses, and deductions
- **Expense Tracking**: Monthly expense management and reporting
- **Finance Dashboard**: Visual analytics with 6-month trend charts
- **Loan Management**: Employee loan tracking and repayment schedules

### Leave & Time Management
- **Leave Management**: Comprehensive leave request system with approval workflows
- **Leave Balances**: Real-time tracking of leave entitlements
- **Public Holidays**: Configurable holiday calendar management

### Project Management
- **Project Tracking**: Project lifecycle management with team assignments
- **Client Management**: Client relationship and invoice tracking
- **Task Management**: Individual and team task assignment and progress tracking

### Organizational Tools
- **HR Policies**: Rich text policy documents with version control
- **Job Descriptions**: Structured job posting and description management
- **Settings Management**: Configurable company settings, departments, roles, and parameters

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data fetching and caching

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library

### Backend & Database
- **Supabase** - Open source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Edge functions

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing
- **TypeScript** - Type checking

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
   
   The application uses Supabase migrations. If setting up a new project:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-id
   
   # Run migrations
   supabase db push
   ```

5. **Start Development Server**
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

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   ├── finance/        # Finance-related components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.