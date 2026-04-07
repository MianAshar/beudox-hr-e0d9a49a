<!--
generated_by: tessera
source_sha: 22fa1c17bfe3173b442f8fe4a0a5481ab1484547
generated_at: 2026-04-07T12:52:20.707Z
action: update
-->

# Beudox HR

A comprehensive HR management system built with React, TypeScript, and Supabase. This application provides tools for employee management, performance evaluations, policy management, and organizational settings.

## Features

- **Employee Management**: Searchable employee selection, profile management, and organizational hierarchy
- **Performance Evaluations**: Quarterly and daily evaluations with timeline tracking
- **HR Policies**: Rich text editor for creating and managing company policies
- **Settings Management**: Configure departments, roles, attendance, expense categories, and company information
- **Role-Based Access**: Different permissions for employees, team leads, HR managers, and CEOs
- **Responsive UI**: Modern interface built with shadcn/ui components

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Rich Text Editing**: Tiptap
- **State Management**: React Query for server state
- **Testing**: Vitest, Playwright
- **Build Tools**: Vite, ESLint, TypeScript

## Setup

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

3. **Environment variables**
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Run database migrations**
   
   The Supabase migrations are included in the `supabase/migrations/` directory. Apply them to your Supabase project.

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── settings/       # Settings tabs
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
├── integrations/       # External service integrations
└── ...
supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions
```

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs