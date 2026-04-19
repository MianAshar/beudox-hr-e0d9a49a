<!--
generated_by: tessera
source_sha: 04fabb8710967b3873944fa4e198aa16555d5eb4
generated_at: 2026-04-19T13:22:44.989Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with powerful tools to manage employees, track performance, handle payroll, and streamline HR operations.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Performance Tracking**: Bi-annual evaluations and daily feedback systems
- **Leave Management**: Comprehensive leave tracking and approval workflows
- **Payroll Processing**: Automated payroll calculations with overtime and deductions

### Financial Management
- **Invoice Management**: Client invoicing and payment tracking
- **Expense Tracking**: Monthly expense monitoring and reporting
- **Financial Analytics**: 6-month trend analysis and financial summaries

### Project & Client Management
- **Project Tracking**: Project lifecycle management with activity logging
- **Client Relations**: Client database and relationship management
- **Time Tracking**: Project-based time and resource allocation

### Administrative Tools
- **HR Policies**: Rich text policy documents and management
- **Settings Management**: Configurable company settings, departments, roles, and parameters
- **Loan Management**: Employee loan tracking and repayment
- **Holiday Management**: Public holiday configuration

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **UI Components**: Radix UI primitives with custom theming
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
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
   
   Copy the environment template:
   ```bash
   cp .env .env.local
   ```
   
   Configure your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
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
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── ...

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase project configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Auth with role-based access control. User roles include:
- **CEO**: Full system access
- **HR Manager**: HR operations and management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and basic access

## Contributing

1. Follow the existing code style and component patterns
2. Use TypeScript for all new code
3. Add tests for new features
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.