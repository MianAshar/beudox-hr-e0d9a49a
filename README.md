<!--
generated_by: tessera
source_sha: c146e39c807c2d7590e3e1eb1fcb10f3b06bbef7
generated_at: 2026-04-07T11:18:49.166Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application built as a modern React frontend. It provides tools for employee evaluations, HR policy management, organizational settings, and more.

## Features

- **Employee Evaluations**: Quarterly and daily performance evaluations with role-based visibility
- **HR Policies**: Rich text editor for creating and managing company policies
- **Organizational Management**: Settings for departments, roles, attendance, and company information
- **User Interface**: Modern UI built with shadcn/ui components and Tailwind CSS
- **Authentication**: Integrated with Supabase for user management and data storage

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query for server state
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Rich Text Editing**: Tiptap
- **Testing**: Vitest and Playwright

## Getting Started

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

3. Set up environment variables:
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase migrations for database schema. Run migrations in your Supabase project dashboard or using the Supabase CLI.

### Testing

Run unit tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── settings/       # Settings-related components
│   └── ...
├── pages/              # Page components
├── integrations/       # External service integrations
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── ...
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is private and proprietary.