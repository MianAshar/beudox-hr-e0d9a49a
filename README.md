<!--
generated_by: tessera
source_sha: 532445a0e6591cf342df6eb72db8d288205b7fe5
generated_at: 2026-04-18T01:00:48.803Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with powerful tools to manage employees, payroll, evaluations, leave requests, projects, clients, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Role-Based Access Control**: Granular permissions system with roles like HR Manager, CEO, Team Lead, and Employee
- **Authentication & Security**: Secure login with password recovery and invite-based onboarding

### Performance & Evaluation
- **Quarterly Evaluations**: Bi-annual performance reviews with detailed feedback and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous performance tracking
- **Evaluation Timeline**: Comprehensive history view of all evaluations with role-based visibility

### Financial Management
- **Payroll Processing**: Automated payroll calculations with detailed payslips
- **Finance Dashboard**: Real-time financial metrics with 6-month trend analysis
- **Expense Tracking**: Monthly expense management and reporting
- **Invoice Management**: Client invoicing with PDF generation and email delivery

### Leave & Time Management
- **Leave Requests**: Comprehensive leave management system with approval workflows
- **Leave Balances**: Real-time tracking of leave entitlements and usage
- **Public Holidays**: Configurable holiday calendar management

### Project & Client Management
- **Project Tracking**: Full project lifecycle management with team assignments
- **Client Management**: Client relationship management with detailed profiles
- **Project Activity Logs**: Timeline tracking of project activities and milestones

### Policy & Compliance
- **HR Policies**: Rich text policy documents with version control
- **Loan Management**: Employee loan tracking and management
- **Settings Management**: Configurable system settings for departments, roles, leave types, etc.

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast development
- **UI Framework**: ShadCN/UI with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: Tiptap editor
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
   
   Update the following variables:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

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
# or
bun run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN/UI components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── finance/        # Finance-specific components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Key Components

### Layout System
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Responsive sidebar with role-based menu items
- **TopBar**: Header with notifications and user menu

### Core Components
- **SearchableEmployeeSelect**: Employee selection with search and avatar display
- **EvaluationTimeline**: Performance evaluation history with filtering
- **FinanceSummary**: Financial dashboard with trend charts
- **RichTextEditor**: Policy document editor with formatting

## Authentication & Authorization

The application uses Supabase Auth with custom role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and requests

## Database Schema

The application uses PostgreSQL with the following main tables:
- `employees` - Employee profiles and information
- `evaluations` - Quarterly performance reviews
- `daily_evaluations` - Daily feedback entries
- `leave_requests` - Leave management
- `payroll_records` - Payroll processing
- `projects` - Project management
- `invoices` - Client invoicing
- `hr_policies` - Policy documents

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the linter: `npm run lint`
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.