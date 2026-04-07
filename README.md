<!--
generated_by: tessera
source_sha: 04bf34358f62c15a2e8a35b5c958fb2d0653011a
generated_at: 2026-04-07T21:56:10.548Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built for modern businesses. Beudox HR streamlines employee management, performance evaluations, payroll processing, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and organizational structure
- **Role-Based Access Control**: Granular permissions system with predefined roles (CEO, HR Manager, Finance Manager, Team Lead, Employee)
- **Multi-Company Support**: Multi-tenant architecture supporting multiple companies with data isolation

### Performance & Evaluations
- **Quarterly Evaluations**: Structured performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous performance tracking
- **Evaluation Timeline**: Historical view of all evaluations with role-based visibility

### Financial Management
- **Payroll Processing**: Automated payroll generation with attendance tracking and overtime calculations
- **Invoice Management**: Client invoicing with PDF generation and email delivery
- **Expense Tracking**: Monthly expense management with categorized line items
- **Finance Dashboard**: Comprehensive financial overview and reporting

### Organizational Tools
- **Project Management**: Project tracking with team assignments and progress monitoring
- **Client Management**: Client relationship management with detailed profiles
- **HR Policies**: Rich text policy documents with version control
- **Public Holidays**: Configurable holiday calendar management
- **Loan Management**: Employee loan tracking and management

### Administrative Features
- **Settings Management**: Configurable system settings including departments, roles, expense categories, and evaluation parameters
- **Attendance Tracking**: Employee attendance monitoring and reporting
- **Document Management**: Secure document storage and access

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library for consistent UI
- **React Query** for server state management
- **React Hook Form** with Zod validation

### Backend & Infrastructure
- **Supabase** for backend-as-a-service (Database, Auth, Storage, Edge Functions)
- **PostgreSQL** database with Row Level Security (RLS)
- **Supabase Auth** for user authentication and authorization
- **Supabase Storage** for file uploads
- **Supabase Edge Functions** for server-side processing (payroll, invoices, notifications)

### Development Tools
- **ESLint** for code linting
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **TypeScript** for type checking

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
   
   Copy the environment template:
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
   
   The application uses Supabase migrations. If setting up a new project:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-id
   
   # Apply migrations
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

## Usage

### First Time Setup
1. Access the application at `http://localhost:8080`
2. Create your company profile through the setup wizard
3. Invite employees and assign roles
4. Configure departments, roles, and system settings

### User Roles & Permissions

- **CEO**: Full system access including all financial and HR operations
- **HR Manager**: Employee management, evaluations, policies, and settings
- **Finance Manager**: Payroll, invoices, expenses, and financial reporting
- **Team Lead**: Team member evaluations and project management
- **Employee**: Personal profile, evaluations, payslips, and basic company information

### Key Workflows

#### Employee Onboarding
1. HR Manager creates employee profile
2. System sends invitation email
3. Employee sets password and completes profile
4. Assign roles and departments

#### Performance Reviews
1. HR Manager or Team Lead initiates evaluation
2. Evaluator completes assessment with scoring
3. Employee receives feedback
4. Historical evaluations tracked in timeline

#### Payroll Processing
1. System calculates based on attendance and salary data
2. Finance Manager reviews and approves
3. Payslips generated and distributed
4. Automated PDF generation and email delivery

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for server-side logic
```

## Testing

### Unit Tests
```bash
npm run test
```

### End-to-End Tests
```bash
npx playwright test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.