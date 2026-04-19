<!--
generated_by: tessera
source_sha: f87bebdf9a6729bb6c4fd93b276bccf813582fd5
generated_at: 2026-04-19T14:27:41.859Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines HR operations for companies, providing tools for employee management, payroll, evaluations, leave tracking, project management, and financial oversight.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions based on user roles (CEO, HR Manager, Team Lead, Employee)
- **Profile Management**: Detailed employee profiles with personal information, roles, and history

### Performance & Evaluations
- **Quarterly Evaluations**: Bi-annual performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with filtering by role

### Time & Attendance
- **Leave Management**: Request, approve, and track various leave types
- **Attendance Tracking**: Monitor employee attendance patterns
- **Public Holidays**: Company-wide holiday management

### Financial Management
- **Payroll Processing**: Automated payroll calculations with overtime and bonuses
- **Expense Tracking**: Monitor and approve employee expenses
- **Invoice Management**: Generate and manage client invoices
- **Financial Dashboard**: Real-time financial insights and trends

### Project Management
- **Project Tracking**: Create and manage projects with team assignments
- **Task Management**: Assign and track tasks within projects
- **Client Management**: Maintain client relationships and project associations

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Loan Management**: Track employee loans and deductions
- **Settings Management**: Configure departments, roles, leave types, and evaluation parameters

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** with custom design system (Syne + DM Sans fonts)
- **ShadCN/UI** component library with Radix UI primitives
- **React Query** for server state management
- **React Hook Form** with Zod validation
- **Recharts** for data visualization
- **TipTap** for rich text editing

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)
- **Row Level Security (RLS)** for data access control
- **Real-time subscriptions** for live updates

### Development Tools
- **ESLint** for code linting
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
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
   
   Run the Supabase migrations to set up the database schema:
   ```bash
   # If using Supabase CLI
   supabase db reset
   ```
   
   The migrations are located in `supabase/migrations/` and include:
   - Employee and company tables
   - Role and permission system
   - Payroll and financial tables
   - Project and task management
   - Evaluation and leave systems

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
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN/UI components
│   ├── layout/         # App layout components
│   ├── finance/        # Financial components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for serverless operations
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application uses Supabase Auth for user authentication with email/password. Role-based access control is implemented with the following roles:

- **CEO**: Full access to all features
- **HR Manager**: Access to HR functions, employee management, payroll
- **Team Lead**: Access to team management, evaluations, projects
- **Employee**: Limited access to personal data and basic functions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npx playwright test
```

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.