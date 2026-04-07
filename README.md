<!--
generated_by: tessera
source_sha: 1cec2ce393d8f182112788746e7935917c082ccd
generated_at: 2026-04-07T21:17:57.033Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive human resources management application built for modern companies. It provides tools for employee management, performance evaluations, HR policy administration, payroll processing, and organizational settings.

## Features

- **Employee Management**: Searchable employee selection, profile management, and organizational hierarchy
- **Performance Evaluations**: Quarterly and daily evaluation system with timeline tracking
- **HR Policies**: Rich text editor for creating and managing company policies
- **Settings Management**: Configure company details, departments, roles, attendance rules, expense categories, and more
- **Payroll & Invoicing**: Automated payroll generation and invoice PDF creation
- **User Roles & Permissions**: Role-based access control (CEO, HR Manager, Team Lead, Employee)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL database, Edge Functions)
- **Authentication**: Supabase Auth
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+
- Bun package manager
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. Run database migrations:
   
   The SQL migrations are located in `supabase/migrations/`. Apply them to your Supabase database.

5. Start the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
bun run build
```

The built files will be in the `dist` directory.

### Running Tests

- Unit tests: `bun run test`
- E2E tests: `bun run test:e2e`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   ├── settings/       # Settings tab components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── ...
supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge Functions for server-side logic
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting a pull request

## License

This project is private and proprietary to Beudox.