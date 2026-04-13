<!--
generated_by: tessera
source_sha: 46dfb6ac3a974a552a857eb52d0e4225e2601dd1
generated_at: 2026-04-13T10:29:40.143Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox provides tools for employee management, leave tracking, performance evaluations, and organizational settings.

## Features

- **Employee Management**: Searchable employee directory with profiles and avatars
- **Leave Management**: Apply for leave, track balances, and manage requests
- **Performance Evaluations**: Quarterly and daily evaluations with timeline view
- **HR Policies**: Rich text editor for creating and managing company policies
- **Settings Management**: Configure departments, roles, leave types, expense categories, and notifications
- **Notifications**: Automated notifications for HR events
- **Payroll & Invoicing**: Generate payroll reports and invoices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Rich Text Editing**: Tiptap
- **Testing**: Vitest + Playwright
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+
- Bun package manager
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

4. Start the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for the backend. The database schema is managed through migrations located in the `supabase/migrations/` directory.

To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref jqhiijbunselslmvhdwe`
3. Run migrations: `supabase db push`

### Testing

Run unit tests:
```bash
bun run test
```

Run E2E tests:
```bash
bun run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── leave/          # Leave management components
│   ├── evaluations/    # Evaluation components
│   ├── settings/       # Settings components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software owned by Beudox.