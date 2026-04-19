<!--
generated_by: tessera
source_sha: ba4b5f89ec15f1a5b48b921ae382c0695f700ac5
generated_at: 2026-04-19T12:49:23.721Z
action: update
-->

# Beudox HR — Workforce Management Platform

A comprehensive, multi-tenant HR and workforce management platform built with modern web technologies. Streamline employee lifecycle management, payroll processing, performance evaluations, and organizational operations.

## 🚀 Features

### Core HR Management
- **Employee Lifecycle**: Complete employee onboarding, profile management, and offboarding
- **Role-Based Access Control**: Granular permissions for HR managers, team leads, CEOs, and employees
- **Multi-Tenant Architecture**: Secure company data isolation with Supabase RLS

### Workforce Operations
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Leave Management**: Comprehensive leave tracking and approval workflows
- **Performance Evaluations**: Bi-annual evaluations and daily feedback systems
- **Project Management**: Project tracking with team assignments and progress monitoring

### Financial Management
- **Invoice Generation**: Automated invoice creation and PDF generation
- **Expense Tracking**: Monthly expense management and reporting
- **Financial Analytics**: 6-month trend analysis with interactive charts
- **Loan Management**: Employee loan tracking and deductions

### Administrative Tools
- **HR Policy Management**: Rich text policy documents with version control
- **Company Settings**: Configurable departments, roles, leave types, and evaluation parameters
- **Public Holidays**: Holiday calendar management
- **Notifications**: Automated email notifications for key events

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, Context API for auth
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: Tiptap editor for policy documents

## 📋 Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
cd beudox-hr-e0d9a49a
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using bun (recommended)
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### 4. Database Setup

The application uses Supabase as the backend. You'll need to:

1. Create a Supabase project
2. Run the migration files in `supabase/migrations/` in order
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers if needed

### 5. Development Server

```bash
# Using npm
npm run dev

# Or using bun
bun run dev
```

The application will be available at `http://localhost:8080`

## 📜 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `build:dev` - Build for development
- `lint` - Run ESLint
- `preview` - Preview production build
- `test` - Run tests with Vitest
- `test:watch` - Run tests in watch mode

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── finance/        # Finance-specific components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## 🔐 Authentication & Authorization

The platform uses Supabase Auth for user authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

## 📊 Key Components

### Dashboard
Central hub showing key metrics, recent activities, and quick actions.

### Employee Management
Complete employee profiles with personal information, employment details, and performance history.

### Payroll System
Automated payroll generation with support for:
- Basic salary
- Overtime (regular and holiday)
- Bonuses
- Loan deductions

### Evaluation System
Dual evaluation framework:
- **Bi-annual Evaluations**: Comprehensive performance reviews
- **Daily Evaluations**: Quick feedback and recognition

### Financial Dashboard
Real-time financial insights with:
- Payroll vs expenses comparison
- 6-month trend analysis
- Interactive charts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support or questions, please contact the development team.