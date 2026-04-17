<!--
generated_by: tessera
source_sha: 9b015f7d1356b6bc02b6c37f3169549a066083dd
generated_at: 2026-04-17T23:18:01.555Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern companies. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Leave Management**: Automated leave request and approval workflows with balance tracking
- **Payroll Processing**: Automated payroll generation with overtime calculations and PDF payslips
- **HR Policies**: Rich text policy documents with version control

### Business Operations
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices with PDF export
- **Finance Dashboard**: Comprehensive financial overview and reporting

### Administrative Tools
- **Role-Based Access Control**: Granular permissions system with predefined roles
- **Company Settings**: Configure departments, leave types, expense categories, and notifications
- **Public Holidays**: Manage company-wide holiday schedules
- **Loan Management**: Track employee loans and repayments

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **UI Framework**: ShadCN UI (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Authentication**: Supabase Auth with Row Level Security
- **Database**: Supabase PostgreSQL
- **Rich Text Editing**: TipTap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
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
   
   Copy the environment file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Ensure your Supabase project has the required tables and RLS policies set up. The migration files are located in `supabase/migrations/`.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── layout/         # App layout components
│   ├── evaluations/    # Evaluation-specific components
│   ├── leave/          # Leave management components
│   ├── hr-policies/    # Policy management components
│   └── settings/       # Settings components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Key Components

### Authentication Flow
- Email/password authentication with Supabase
- Password reset and invite flows
- Role-based route protection
- Automatic session management

### Data Architecture
- Supabase PostgreSQL with Row Level Security
- Real-time subscriptions for live updates
- Optimized queries with TanStack Query
- Type-safe database operations

### UI/UX Design
- Custom Beudox design system
- Responsive layout with collapsible sidebar
- Dark/light theme support
- Accessible components with Radix UI

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.