<!--
generated_by: tessera
source_sha: 0e7103b6b34cc39f99b57937277abd5e6d49ab4a
generated_at: 2026-03-27T23:59:07.902Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application built with modern web technologies. It provides organizations with tools to manage employees, attendance, payroll, leave, and other HR-related functions through an intuitive web interface.

## Features

### People Management
- **Employee Management**: Add, view, and edit employee profiles
- **Attendance Tracking**: Monitor employee attendance records
- **Public Holidays**: Manage and display public holiday schedules
- **Leave Management**: Handle employee leave requests and approvals

### Finance & Payroll
- **Payroll Processing**: Calculate and manage employee salaries
- **Finance Sheet**: Overview of financial data and reports
- **Loan Management**: Track employee loans and repayments
- **Office Expenses**: Record and categorize office expenditures
- **Outsourcing**: Manage external contractor relationships

### Work & Projects
- **Project Management**: Track ongoing projects and assignments
- **Employee Evaluations**: Conduct performance reviews
- **HR Policies**: Store and access company policies

### System Administration
- **Notifications**: System-wide notifications and alerts
- **Settings**: Configure application preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Authentication & Database**: Supabase
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   
   Copy the `.env` file and update the Supabase configuration with your project credentials:
   ```bash
   cp .env .env.local
   ```
   
   Edit `.env.local` with your Supabase project ID, URL, and publishable key.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
├── lib/                # Utility functions and configurations
├── pages/              # Page components and routing
└── test/               # Test files
```

## Authentication

The application uses Supabase for authentication. Users can log in, reset passwords, and access protected routes based on their authentication status.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.