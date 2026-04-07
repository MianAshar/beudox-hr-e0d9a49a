<!--
generated_by: tessera
source_sha: 8e11b5d7fe7d65cb4672bc4879a4a7d4c01dc9e0
generated_at: 2026-04-07T22:35:22.870Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides tools for employee management, performance evaluations, HR policy management, and organizational administration.

## Features

- **Employee Management**: Searchable employee selection, profile management, and organizational hierarchy
- **Performance Evaluations**: Quarterly and daily evaluation system with timeline tracking
- **HR Policies**: Rich text editor for creating and managing company policies
- **Settings Management**: Configure attendance rules, departments, roles, expense categories, and company information
- **Role-based Access Control**: Different permission levels for HR managers, team leads, and employees
- **Responsive Design**: Modern UI built with shadcn/ui components

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: TanStack Query for server state
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Rich Text Editor**: Tiptap
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Icons**: Lucide React
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or bun package manager
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
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for backend services. The database schema includes tables for:

- Employees
- Evaluations (quarterly and daily)
- HR Policies
- Departments
- Roles
- Attendance records
- Expense categories

Run the SQL migrations in the `supabase/migrations/` directory to set up the database schema.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── ...
supabase/
├── migrations/         # Database migrations
└── functions/          # Edge functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.