<!--
generated_by: tessera
source_sha: 412f930907229c36dc63ebfb2ed140f03d17899b
generated_at: 2026-04-19T14:14:09.311Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll, evaluations, leave tracking, and more for organizations.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Role-Based Access Control**: Granular permissions for different user roles (HR Manager, CEO, Team Lead, Employee)
- **Company Settings**: Configure departments, roles, leave types, expense categories, and evaluation parameters

### Performance & Evaluations
- **Quarterly Evaluations**: Bi-annual performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with filtering by role permissions

### Payroll & Finance
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Finance Dashboard**: Real-time financial summaries with 6-month trend analysis
- **Expense Tracking**: Monthly expense management and reporting
- **Loan Management**: Employee loan tracking and deductions

### Leave Management
- **Leave Requests**: Employee leave applications with approval workflows
- **Leave Balances**: Real-time tracking of leave entitlements
- **Leave Types**: Configurable leave categories (vacation, sick, personal, etc.)

### Project Management
- **Project Tracking**: Project creation, assignment, and progress monitoring
- **Task Management**: Individual and team task assignment
- **Project Activity Log**: Timeline of project updates and milestones
- **Client Management**: Client profiles and project associations

### Additional Features
- **Invoice Management**: Client invoicing with PDF generation
- **HR Policies**: Document management for company policies
- **Public Holidays**: Holiday calendar management
- **Notifications**: Automated notifications for important events
- **Settings**: Comprehensive system configuration

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **React Router** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library built on Radix UI
- **React Hook Form** with Zod validation
- **TanStack Query** for server state management
- **Recharts** for data visualization
- **TipTap** rich text editor
- **Lucide React** for icons

### Backend & Infrastructure
- **Supabase** (PostgreSQL database + Auth + Edge Functions)
- **Row Level Security (RLS)** for data access control
- **Supabase Auth** for user authentication and authorization

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** for code linting
- **TypeScript** for type safety

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
   
   Copy the environment file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   Key tables include:
   - `companies` - Company information
   - `employees` - Employee records
   - `roles` - User roles and permissions
   - `evaluations` - Performance evaluations
   - `payroll_records` - Payroll data
   - `leave_requests` - Leave management
   - `projects` - Project tracking
   - And many more...

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── evaluations/    # Evaluation-specific components
│   ├── finance/        # Finance dashboard components
│   ├── leave/          # Leave management components
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

The application uses Supabase Auth for user management with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses ESLint for code linting and follows TypeScript strict mode for type safety. All components are built with accessibility in mind using Radix UI primitives.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.
