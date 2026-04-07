<!--
generated_by: tessera
source_sha: e4666b393eb5ebe6bd89896a1cb544c156007f6a
generated_at: 2026-04-07T11:10:51.223Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management platform designed to streamline employee evaluations, policy management, and organizational settings. Built as a modern web application, it provides tools for conducting quarterly and daily performance evaluations, managing HR policies with rich text editing, and configuring company-wide settings including departments, roles, and attendance policies.

## Features

- **Employee Evaluations**: Conduct quarterly performance reviews and daily feedback sessions with role-based visibility controls
- **HR Policies**: Create and manage company policies using a rich text editor with formatting options
- **Organizational Settings**: Configure company information, departments, roles, evaluation parameters, and attendance rules
- **User Management**: Role-based access control for HR managers, CEOs, team leads, and employees
- **Dashboard**: Centralized interface with sidebar navigation and responsive design

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database with real-time capabilities)
- **Authentication**: Supabase Auth
- **Package Manager**: Bun
- **Testing**: Vitest and Playwright
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
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

4. Run database migrations (if using local Supabase):
   ```bash
   supabase db reset
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
bun run build
```

### Running Tests

```bash
bun run test
```

### Running E2E Tests

```bash
bun run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── evaluations/    # Evaluation-related components
│   ├── hr-policies/    # Policy management components
│   └── settings/       # Settings configuration components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
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