<!--
generated_by: tessera
source_sha: 5682a75da22c4767737d769a1b570d4bea55ecf0
generated_at: 2026-04-01T00:10:29.480Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete suite of HR tools for managing employees, attendance, payroll, leave, and organizational operations.

## Features

### Core HR Functionality
- **Employee Management**: Add, edit, and manage employee profiles
- **Attendance Tracking**: Monitor employee attendance records
- **Leave Management**: Handle vacation, sick leave, and other time-off requests
- **Payroll Processing**: Manage salary calculations and payments
- **Finance Management**: Track loans, expenses, and financial reports

### Additional Modules
- **Project Management**: Oversee client projects and assignments
- **Performance Evaluations**: Conduct employee assessments
- **HR Policies**: Maintain and distribute company policies
- **Notifications System**: Keep employees informed
- **Settings**: Configure system preferences

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library (inspired by shadcn/ui)
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Icons**: Lucide React
- **Testing**: Vitest + Playwright
- **Code Quality**: ESLint

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
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
   Copy `.env` and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables with your Supabase project details:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open your browser to `http://localhost:5173`

### Database Setup

The application uses Supabase for data storage. Database migrations are included in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref jqhiijbunselslmvhdwe`
3. Run migrations: `supabase db push`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, topbar, etc.)
│   └── ...             # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.