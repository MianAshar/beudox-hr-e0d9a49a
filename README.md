<!--
generated_by: tessera
source_sha: b171fa629096f96f6d3b5bfe71f324dc5fa3d8d8
generated_at: 2026-04-30T11:26:02.275Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources Management System designed for companies to efficiently manage their workforce. It provides a modern, web-based interface for handling employee profiles, attendance tracking, leave management, payroll processing, project assignments, evaluations, and organizational settings.

## Features

- **Employee Management**: Complete employee profiles with personal details, roles, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording with analytics, overtime calculations, and anomaly detection
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Generate detailed payroll sheets with overtime, allowances, and deductions
- **Project Management**: Assign employees to projects and track project activities
- **Performance Evaluations**: Schedule and conduct employee reviews with customizable parameters
- **Company Settings**: Configure departments, roles, expense categories, and public holidays
- **Notifications**: Automated notifications for important HR events

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database with real-time capabilities)
- **UI Components**: Custom component library with shadcn/ui foundation
- **State Management**: React hooks and context
- **Testing**: Vitest for unit tests

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
   
   Copy `.env` and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key

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
- Projects and tasks
- Company settings and configurations
- Public holidays

Database migrations are managed through Supabase and are included in the `supabase/migrations/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, topbar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── employee-profile/ # Employee profile tabs
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components (routes)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Code Quality

The project uses ESLint for code linting and follows TypeScript strict mode for type safety. UI components follow a consistent design system with Tailwind CSS.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.