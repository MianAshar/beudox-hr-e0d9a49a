<!--
generated_by: tessera
source_sha: 25225680b7caec66aa1060dd843b361d1669e911
generated_at: 2026-04-17T22:50:22.248Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, project tracking, financial operations, and organizational workflows in a single, intuitive platform.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Leave Management**: Automated leave request and approval workflows with balance tracking
- **Performance Evaluations**: Quarterly and daily evaluation systems with structured feedback
- **HR Policies**: Rich text policy documents with version control

### Project & Client Management
- **Project Tracking**: Full project lifecycle management with team assignments
- **Client Relations**: Client database with contact management and project associations
- **Resource Allocation**: Team member assignment and workload management

### Financial Operations
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **Invoice Management**: Client invoicing with PDF generation and email delivery
- **Expense Tracking**: Expense category management and approval workflows
- **Loan Management**: Employee loan tracking and repayment schedules

### Administrative Tools
- **Settings Management**: Company-wide configuration for departments, roles, and policies
- **Public Holidays**: Configurable holiday calendars
- **Notifications**: Automated notification system for important events
- **Role-Based Access Control**: Granular permissions for different user types

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC compiler
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query for server state, Context API for auth
- **Routing**: React Router v6 with protected routes
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Rich Text Editing**: TipTap editor
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest with React Testing Library
- **Deployment**: Configured for modern hosting platforms

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
   
   The application uses Supabase as its backend. You'll need to:
   - Create a Supabase project
   - Run the database migrations located in `supabase/migrations/`
   - Configure Row Level Security (RLS) policies
   - Set up authentication providers if needed

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
# or
bun run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for business logic
└── config.toml         # Supabase project configuration
```

## User Roles & Permissions

The application implements role-based access control with the following roles:

- **CEO**: Full access to all features
- **HR Manager**: Employee management, evaluations, policies, settings
- **Finance Manager**: Payroll, invoices, finance, expenses
- **Team Lead**: Project management, team evaluations, basic HR access
- **Employee**: Personal dashboard, leave requests, evaluations, payslips

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses:
- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** for code formatting (via ESLint)
- **Vitest** for unit testing
- **Playwright** for end-to-end testing

### Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## Deployment

The application is configured for deployment on modern hosting platforms:

- **Vercel**: Optimized for Vercel with proper build configuration
- **Netlify**: Static deployment with proper redirects
- **Railway**: Full-stack deployment with database
- **Docker**: Containerized deployment available

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team or create an issue in the repository.