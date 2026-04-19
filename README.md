<!--
generated_by: tessera
source_sha: c3170ac3be14d8a64f3396e1e79f905f52fb9f93
generated_at: 2026-04-19T14:19:37.064Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, leave tracking, and organizational workflows.

## Features

### Core HR Functions
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Payroll Processing**: Automated payroll calculations with overtime, bonuses, and deductions
- **Performance Evaluations**: Quarterly and daily evaluation systems with role-based visibility
- **Leave Management**: Comprehensive leave tracking with balances and approvals
- **Project Management**: Project creation, task assignment, and progress tracking

### Financial Management
- **Invoice Management**: Client invoicing with PDF generation
- **Expense Tracking**: Monthly expense recording and reporting
- **Financial Dashboard**: Real-time financial metrics and trend analysis
- **Loan Management**: Employee loan tracking and deductions

### Administrative Tools
- **HR Policies**: Rich text policy documents with version control
- **Company Settings**: Configurable departments, roles, leave types, and evaluation parameters
- **Notifications**: Automated email notifications for key events
- **Public Holidays**: Configurable holiday calendar management

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **State Management**: TanStack Query for server state, React Context for auth
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text**: Tiptap editor for policies
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
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
   
   Copy the environment file and configure Supabase:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   Key tables include:
   - `companies`, `employees`, `roles`
   - `payroll_records`, `monthly_expenses`
   - `evaluations`, `daily_evaluations`
   - `leave_requests`, `leave_balances`
   - `projects`, `tasks`, `clients`, `invoices`

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
│   ├── layout/         # App layout components
│   ├── finance/        # Financial dashboard components
│   ├── evaluations/    # Evaluation-related components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for automation
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application uses Supabase Auth for user authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

## Key Components

### Layout System
- `AppLayout`: Main application wrapper with sidebar and topbar
- `AppSidebar`: Collapsible navigation sidebar
- `TopBar`: Page header with breadcrumbs

### Core Components
- `BeudoxLogo`: Brand logo component with variants
- `SearchableEmployeeSelect`: Employee selection with search
- `EvaluationTimeline`: Performance evaluation history
- `FinanceSummary`: Financial metrics dashboard

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Testing

The application includes both unit tests (Vitest) and end-to-end tests (Playwright).

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure type safety with TypeScript

## License

This project is proprietary software for Beudox HR.