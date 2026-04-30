<!--
generated_by: tessera
source_sha: 06a6990241d9f32e24a556117d0801ffd1c7a9bb
generated_at: 2026-04-30T00:57:50.102Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern businesses. Beudox HR provides tools for employee management, attendance tracking, leave management, payroll processing, and organizational settings.

## Features

- **Employee Management**: Profile management, role-based access control, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording, summary reports, and anomaly detection
- **Leave Management**: Leave request workflows, balance tracking, and approval processes
- **Payroll Processing**: Automated payroll generation with overtime calculations and PDF invoice generation
- **Settings & Configuration**: Company settings, departments, roles, leave types, expense categories, and evaluation parameters
- **Notifications**: Automated notifications for various HR events
- **Reporting**: Comprehensive reports on attendance, payroll, and employee performance

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Build Tools**: Vite, ESLint, TypeScript
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+
- Bun package manager
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
   - Copy `.env` and update the Supabase configuration with your project details
   - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set correctly

4. Run database migrations:
   - The Supabase migrations are included in the `supabase/migrations/` directory
   - Apply them to your Supabase project

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
# Unit tests
bun run test

# E2E tests
bun run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── employee-profile/ # Employee profile components
│   ├── settings/       # Settings components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── main.tsx            # Application entry point

supabase/
├── migrations/         # Database schema migrations
└── config.toml         # Supabase project configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.