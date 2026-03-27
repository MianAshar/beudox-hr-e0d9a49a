<!--
generated_by: tessera
source_sha: 07e420fea14e26a0448c9adcbd3864945f2ef897
generated_at: 2026-03-27T23:39:37.002Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern web application. Beudox HR provides tools for managing employees, attendance, payroll, leave, and other HR functions in a user-friendly interface.

## Features

- **Employee Management**: Add, view, and edit employee profiles
- **Attendance Tracking**: Monitor employee attendance and public holidays
- **Leave Management**: Handle employee leave requests and approvals
- **Payroll Processing**: Manage salary calculations and payroll
- **Finance Management**: Track office expenses, loans, and financial sheets
- **Project Management**: Oversee projects and employee evaluations
- **HR Policies**: Maintain and access HR documentation
- **Notifications**: Stay updated with system notifications
- **Settings**: Configure system preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest and Playwright

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn or bun

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
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   Copy `.env` and update the Supabase configuration if needed.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
└── test/               # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.