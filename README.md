<!--
generated_by: tessera
source_sha: 194e50701c272bdb1768378aa2c36357cf2a6060
generated_at: 2026-04-18T00:25:38.484Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with React, TypeScript, and Supabase. This frontend application provides a modern, intuitive interface for managing employees, evaluations, leave requests, projects, and HR policies.

## Features

- **Employee Management**: Comprehensive employee profiles with role-based access control
- **Performance Evaluations**: Bi-annual evaluations and daily feedback system
- **Leave Management**: Request, approve, and track leave balances
- **Project Management**: Track project activities and assignments
- **HR Policies**: Rich text policy documents with formatting
- **Settings Management**: Configure departments, roles, leave types, and company settings
- **Notifications**: Real-time notifications for HR events
- **Payroll & Invoicing**: Integration with backend payroll generation and invoice creation

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Rich Text Editing**: Tiptap editor
- **Testing**: Vitest, Playwright for E2E testing
- **Package Manager**: Bun

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
   # or
   npm install
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

4. Start the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase as its backend. The database schema is managed through migrations located in `supabase/migrations/`. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
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
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── evaluations/    # Evaluation-related components
│   ├── leave/          # Leave management components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings/configuration components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── functions/          # Edge functions for backend logic
└── migrations/         # Database schema migrations
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **EvaluationTimeline**: Displays evaluation history for employees
- **SearchableEmployeeSelect**: Employee selection dropdown with search
- **RichTextEditor**: WYSIWYG editor for HR policies
- **BeudoxLogo**: Application logo component with variants

## Authentication & Authorization

The application uses Supabase authentication with role-based access control. User roles include:
- CEO
- HR Manager
- Team Lead
- Employee

Access permissions are managed through the `role-access.ts` utility.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software owned by Beudox.