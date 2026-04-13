<!--
generated_by: tessera
source_sha: 46dfb6ac3a974a552a857eb52d0e4225e2601dd1
generated_at: 2026-04-13T10:30:57.976Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application built with modern web technologies. It provides tools for employee evaluations, leave management, expense tracking, notifications, and administrative settings.

## Features

- **Employee Evaluations**: Quarterly and daily performance evaluations with timeline tracking
- **Leave Management**: Request, approve, and track leave balances
- **Expense Management**: Submit and manage expense reports
- **Notifications**: Automated notifications for HR events
- **Settings Management**: Configure company settings, departments, roles, and policies
- **Rich Text Editor**: For creating and editing HR policies and documents

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Rich Text Editing**: Tiptap
- **Testing**: Vitest and Playwright
- **Package Manager**: npm/bun

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
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for the backend. The database schema is managed through migrations in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref <your-project-ref>`
3. Run migrations: `supabase db push`

### Testing

Run unit tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── evaluations/    # Evaluation-related components
│   ├── leave/          # Leave management components
│   ├── settings/       # Settings/configuration components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components
├── integrations/       # External service integrations (Supabase)
├── lib/                # Utility functions and helpers
├── hooks/              # Custom React hooks
└── test/               # Test files

supabase/
├── migrations/         # Database migrations
└── functions/          # Edge functions
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting a PR

## License

This project is proprietary software owned by Beudox.