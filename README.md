<!--
generated_by: tessera
source_sha: 2a5c73b7410b4f31f0e5cbdb984e455472353acd
generated_at: 2026-03-27T03:34:15.713Z
action: update
-->

# Beudox HR

A comprehensive workforce management system designed for teams in Pakistan. Manage attendance, payroll, evaluations, projects, and HR policies all in one place.

## Features

- **Employee Management**: Track and manage employee information
- **Attendance Tracking**: Monitor employee attendance and public holidays
- **Leave Management**: Handle employee leave requests and approvals
- **Payroll Processing**: Calculate and manage employee salaries
- **Finance Management**: Track company expenses and financial data
- **Project Management**: Organize and track project progress
- **Performance Evaluations**: Conduct employee evaluations
- **HR Policies**: Maintain and distribute company policies
- **Notifications**: Stay updated with system notifications
- **Settings**: Configure system preferences

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

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
   
   Copy `.env` and update the Supabase configuration if needed.

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   └── BeudoxLogo.tsx  # Logo component
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── App.tsx             # Main app component
```

## Authentication

The application uses Supabase Authentication for user management. Users can sign in with email and password.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.