<!--
generated_by: tessera
source_sha: 5e4a18f110db4bae2453574e26f1f49156607870
generated_at: 2026-04-23T21:59:04.278Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, attendance, payroll, leave, evaluations, projects, and more.

## Features

- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Attendance Tracking**: Automated attendance recording with overtime calculations
- **Leave Management**: Comprehensive leave request and approval system
- **Payroll Processing**: Automated payroll generation with payslip management
- **Performance Evaluations**: Regular and daily evaluation systems
- **Project Management**: Project tracking with team assignments and activity logs
- **Finance Management**: Invoice generation and financial reporting
- **HR Policies**: Digital policy management and documentation
- **Role-Based Access Control**: Granular permissions system

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui (Radix UI primitives), Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL, Authentication, Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text Editor**: Tiptap
- **Testing**: Vitest, Playwright
- **Build Tools**: Vite, ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for backend services. Database migrations are located in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

### Building for Production

```bash
npm run build
```

### Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee profile tabs
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **ProtectedRoute**: Route wrapper with authentication and role-based access control
- **AuthProvider**: Authentication context provider
- **EmployeeProfile**: Comprehensive employee profile with multiple tabs (Attendance, Leave, Payroll, etc.)
- **SearchableEmployeeSelect**: Reusable employee selection component

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.