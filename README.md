<!--
generated_by: tessera
source_sha: 99a40ba569414f43251b340331e742906aca530b
generated_at: 2026-05-06T15:49:16.492Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, payroll, leave requests, and organizational settings.

## Features

- **Employee Management**: Profile management, onboarding, and organizational structure
- **Attendance Tracking**: Automated attendance recording, analytics, and reporting
- **Payroll Processing**: Salary calculations, payslips, and financial summaries
- **Leave Management**: Request processing, balance tracking, and approval workflows
- **Performance Reviews**: Evaluation timelines, salary reviews, and increment proposals
- **Project Management**: Team assignments, activity logging, and task tracking
- **HR Policies**: Rich text policy documents and compliance management
- **Settings & Configuration**: Company settings, departments, roles, and system parameters

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router (Pages Router pattern)
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **Authentication**: Supabase Auth
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Configured for modern web hosting

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
   - Copy `.env` and update with your Supabase credentials
   - Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

4. Run database migrations:
   ```bash
   # Using Supabase CLI
   supabase db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Route components (Pages Router)
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions and business logic
├── hooks/              # Custom React hooks
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
└── config.toml        # Supabase project configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Contributing

1. Follow the existing code style and component patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.