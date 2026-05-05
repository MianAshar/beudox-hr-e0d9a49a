<!--
generated_by: tessera
source_sha: be6ab27a68b9f587a21c61b36d4381527ac5fdd7
generated_at: 2026-05-05T15:22:02.913Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, leave requests, payroll, evaluations, and organizational settings.

## Features

- **Employee Management**: Complete employee profiles with personal details, documents, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording, summary reports, and anomaly detection
- **Leave Management**: Request, approve, and track leave balances across multiple leave types
- **Payroll Processing**: Generate payroll sheets, track salary history, and manage increments
- **Performance Evaluations**: Schedule and conduct employee evaluations with customizable parameters
- **Project Management**: Assign employees to projects and track project activities
- **Finance Overview**: Monitor company financial summaries and expense categories
- **HR Policies**: Rich text editor for creating and managing company policies
- **Settings Management**: Configure company details, departments, roles, leave types, and more

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **State Management**: React hooks and context
- **Testing**: Vitest + Playwright for E2E testing
- **Code Quality**: ESLint configuration

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

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase as its backend. The database schema includes tables for:

- Employees and user authentication
- Attendance records
- Leave requests and balances
- Payroll data
- Company settings and configurations
- Projects and evaluations

Database migrations are managed through Supabase and should be applied automatically when setting up the project.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

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
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code quality. Please ensure all code follows the established patterns and runs without linting errors.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.