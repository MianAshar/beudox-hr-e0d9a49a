<!--
generated_by: tessera
source_sha: 03509de5f6208160253b996346e7b1f70041c3ca
generated_at: 2026-05-07T05:56:03.917Z
action: update
-->

# Beudox HR

A comprehensive Human Resources management application built for companies to streamline employee management, attendance tracking, leave requests, payroll processing, and performance evaluations.

## Features

- **Employee Management**: Profile management, role-based access control, and employee directory
- **Attendance Tracking**: Automated attendance recording, summary reports, and anomaly detection
- **Leave Management**: Leave request workflows, balance tracking, and approval processes
- **Payroll Processing**: Salary calculations, payslips, and overtime tracking
- **Performance Evaluations**: Review scheduling, evaluation forms, and salary reviews
- **Finance & Projects**: Expense tracking, project management, and team assignments
- **Settings**: Company configuration, departments, roles, and HR policies

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Routing**: React Router
- **State Management**: React hooks and context
- **Testing**: Vitest for unit tests, Playwright for end-to-end tests
- **Deployment**: Configured for modern web deployment

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
   ```bash
   cp .env .env.local
   ```
   Update the values with your Supabase project details.

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase migrations for database schema. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref jqhiijbunselslmvhdwe`
3. Run migrations: `supabase db push`

### Testing

- Run unit tests: `npm run test`
- Run e2e tests: `npm run test:e2e`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.