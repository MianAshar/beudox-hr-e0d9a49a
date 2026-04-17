<!--
generated_by: tessera
source_sha: 7ffb1b86e9cd74132ef738aca1165796264a4de4
generated_at: 2026-04-17T15:16:01.082Z
action: update
-->

# Beudox HR

A comprehensive Human Resources management system built as a modern React application. Beudox HR provides tools for managing employees, leave requests, performance evaluations, HR policies, company settings, and more.

## Features

- **Employee Management**: Add, update, and manage employee profiles with roles and departments
- **Leave Management**: Request, approve, and track leave balances and requests
- **Performance Evaluations**: Quarterly and daily evaluations with timeline tracking
- **HR Policies**: Create and manage company policies with rich text editing
- **Company Settings**: Configure departments, roles, attendance rules, expense categories, and notifications
- **Dashboard**: Overview of key HR metrics and recent activities

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Rich Text Editing**: Tiptap
- **Icons**: Lucide React
- **Testing**: Vitest with Playwright for E2E

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
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
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   ```

4. Run database migrations:
   
   The Supabase migrations are included in the `supabase/migrations/` directory. Apply them to your Supabase project.

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── leave/          # Leave management components
│   ├── evaluations/    # Evaluation components
│   ├── settings/       # Settings components
│   └── hr-policies/    # HR policies components
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

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is private and proprietary.