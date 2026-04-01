<!--
generated_by: tessera
source_sha: f8e63aff55b9832c02ca51ce745bf1116d15709e
generated_at: 2026-04-01T10:57:34.610Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application built as a modern web frontend. It provides tools for managing employees, attendance, payroll, leave management, and other HR-related functionalities.

## Features

- **Dashboard**: Overview of HR metrics and activities
- **Employee Management**: Add, edit, and manage employee profiles
- **Attendance Tracking**: Monitor employee attendance
- **Leave Management**: Handle vacation and leave requests
- **Payroll Processing**: Manage salaries and payroll
- **Finance Management**: Track invoices, loans, expenses, and financial sheets
- **Project Management**: Oversee projects and client relationships
- **HR Policies**: Maintain and access HR documentation
- **Notifications**: System notifications and alerts
- **Settings**: Application configuration

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Routing**: React Router
- **Backend/Database**: Supabase
- **Testing**: Playwright for end-to-end tests, Vitest for unit tests
- **Package Manager**: Bun (based on lock files)

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Environment Configuration**:
   - Copy `.env` to `.env.local` if needed
   - Ensure Supabase credentials are set (project ID, URL, and publishable key)

4. **Run the development server**:
   ```bash
   bun run dev
   ```

5. **Build for production**:
   ```bash
   bun run build
   ```

## Project Structure

- `src/components/`: Reusable UI components, including layouts and shadcn/ui components
- `src/pages/`: Page components for routing
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utility functions and configurations
- `src/integrations/`: Supabase client and types
- `supabase/`: Database migrations and edge functions
- `public/`: Static assets

## Contributing

1. Follow the existing code style and structure
2. Run tests before submitting changes
3. Update documentation as needed

## License

This project is proprietary to Beudox.