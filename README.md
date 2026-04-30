<!--
generated_by: tessera
source_sha: 99bde0343136c5555684a3394152a0ef99c680ed
generated_at: 2026-04-30T11:02:43.238Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, leave requests, payroll, and organizational settings.

## Features

- **Employee Management**: Profile management, onboarding, and organizational structure
- **Attendance Tracking**: Daily attendance records, overtime calculation, and analytics
- **Leave Management**: Leave requests, balances, and approval workflows
- **Payroll Processing**: Salary calculations, allowances, and payslip generation
- **Performance Reviews**: Employee evaluations and salary reviews
- **Company Settings**: Departments, roles, expense categories, and policies
- **Notifications**: Automated alerts for HR events and deadlines

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Icons**: Lucide React
- **Build Tools**: Vite, ESLint, TypeScript
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
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
   
   Update the following variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key

4. Run database migrations:
   The SQL migrations are located in `supabase/migrations/`. Apply them to your Supabase project.

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Testing

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── settings/       # Settings components
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.