<!--
generated_by: tessera
source_sha: abdbe793ebe62c3fab483db4067d78884a95eb48
generated_at: 2026-04-30T00:39:05.076Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, leave requests, payroll, evaluations, and company settings.

## Features

- **Employee Management**: Complete employee profiles with personal details, documents, and organizational information
- **Attendance Tracking**: Automated attendance recording, summary analytics, and anomaly detection
- **Leave Management**: Request, approve, and track leave balances across different leave types
- **Payroll Processing**: Automated payroll generation with overtime calculations and salary history
- **Performance Evaluations**: Structured evaluation processes with timelines and salary reviews
- **Project Management**: Team assignment, activity logging, and project categorization
- **Finance & Expenses**: Expense tracking and financial summaries
- **HR Policies**: Rich text policy management
- **Company Settings**: Comprehensive configuration for departments, roles, holidays, and more

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **Authentication**: Supabase Auth
- **State Management**: React hooks and context
- **Testing**: Vitest and Playwright
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
   ```

3. Set up environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase as its backend. The database schema includes tables for:

- Employees and user authentication
- Attendance records
- Leave requests and balances
- Payroll data
- Company settings and configurations
- Projects and evaluations

Database migrations are located in `supabase/migrations/` and should be applied to your Supabase project.

### Building for Production

```bash
bun run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Settings panels
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceSummary**: Comprehensive attendance analytics dashboard
- **MandatoryPasswordChange**: Secure password setup for new users
- **SearchableEmployeeSelect**: Employee selection with search functionality
- **BeudoxLogo**: Brand logo component with multiple variants

## Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run test` - Run tests with Vitest
- `bun run test:e2e` - Run end-to-end tests with Playwright
- `bun run lint` - Run ESLint

### Testing

The project includes both unit tests (Vitest) and end-to-end tests (Playwright). Tests are located in:

- Unit tests: `src/test/`
- E2E tests: `playwright/` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.