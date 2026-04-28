<!--
generated_by: tessera
source_sha: 62881d9cc8787b8872224454873d20f09c2c5334
generated_at: 2026-04-28T22:24:56.171Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React frontend application. This portal provides employee self-service features including attendance tracking, leave management, payroll viewing, performance evaluations, and more.

## Features

- **Employee Dashboard**: Centralized access to personal HR information
- **Attendance Management**: Upload and view attendance records with AI-powered parsing
- **Leave Management**: Apply for leave, track balances, and manage requests
- **Payroll Access**: View salary history, increments, and payroll summaries
- **Performance Reviews**: Schedule and track employee evaluations
- **Document Management**: Store and access employee documents
- **Project Management**: Manage team assignments and project activities
- **Settings Administration**: Company-wide configuration for HR policies, departments, roles, etc.

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **State Management**: React hooks with Supabase client
- **UI Components**: Radix UI primitives via shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form (implied from component usage)
- **Notifications**: Sonner for toast notifications

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Configure environment variables:
   
   Copy `.env` and update the Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase for data storage. Database migrations are included in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-id`
3. Run migrations: `supabase db push`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── employee-profile/  # Employee-specific features
│   ├── attendance/     # Attendance management
│   ├── leave/          # Leave management
│   ├── payroll/        # Payroll components
│   ├── evaluations/    # Performance reviews
│   ├── finance/        # Financial summaries
│   ├── hr-policies/    # Policy management
│   ├── projects/       # Project management
│   └── settings/       # Admin settings
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
supabase/
├── functions/          # Edge Functions for server-side logic
└── migrations/         # Database schema migrations
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **MandatoryPasswordChange**: Forces password reset on first login
- **AttendanceUploadFlow**: Handles Excel file uploads with AI parsing
- **SearchableEmployeeSelect**: Employee selection dropdown with search
- **BeudoxLogo**: Application logo component with variants

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Code Quality

The project uses ESLint for code linting and follows TypeScript strict mode. UI components follow the shadcn/ui design system for consistency.

## Contributing

1. Follow the existing code style and component patterns
2. Use TypeScript for all new code
3. Test components thoroughly
4. Update documentation as needed

## License

This project is proprietary software for Beudox HR systems.