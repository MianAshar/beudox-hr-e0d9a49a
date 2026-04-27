<!--
generated_by: tessera
source_sha: cb35d043356ac9b18d01f9a6b3976b879c5b6c78
generated_at: 2026-04-27T22:24:18.513Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application built for modern businesses. It provides tools for employee management, attendance tracking, leave requests, payroll processing, and organizational settings.

## Features

- **Employee Management**: Maintain detailed employee profiles with personal information, job details, and organizational hierarchy
- **Attendance Tracking**: Upload and manage attendance records from biometric devices, with AI-powered parsing and automated calculations
- **Leave Management**: Handle leave requests, balances, and approvals with configurable leave types
- **Payroll Processing**: Generate payroll reports and manage salary structures
- **Performance Reviews**: Schedule and track employee evaluations and salary reviews
- **Project Management**: Assign employees to projects and track project activities
- **Settings & Configuration**: Customize company settings, departments, roles, and policies

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **State Management**: React Query for server state
- **Routing**: React Router
- **Package Manager**: Bun
- **Testing**: Vitest

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
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. Run database migrations:
   
   The Supabase migrations are included in the `supabase/migrations/` directory. Apply them to your Supabase project.

5. Start the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
bun run build
```

The built files will be in the `dist/` directory.

### Running Tests

```bash
bun run test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── layout/         # App layout components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
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

This project is proprietary software owned by Beudox.