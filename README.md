<!--
generated_by: tessera
source_sha: 295c28ea6912fcf6433508a91523a7a71029d19b
generated_at: 2026-03-31T22:48:02.657Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built for companies to manage their workforce efficiently. This frontend application provides a modern, role-based interface for handling employee data, attendance, payroll, and organizational workflows.

## Features

- **Employee Management**: Add, view, edit, and manage employee profiles
- **Role-Based Access Control**: Different permissions based on user roles
- **Dashboard**: Overview of key HR metrics and activities
- **Public Holidays Management**: Configure and manage company holidays
- **Settings**: System configuration and preferences
- **Authentication**: Secure login with password recovery and invite system

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (authentication, database, edge functions)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or bun package manager

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
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Architecture

The application follows a component-based architecture with:

- **Authentication Flow**: Supabase handles user authentication with role-based access control
- **Data Fetching**: TanStack Query manages server state and caching
- **Form Handling**: React Hook Form with Zod schemas for validation
- **UI Components**: shadcn/ui provides consistent, accessible components
- **Routing**: Protected routes with role-based permissions

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is private and proprietary.