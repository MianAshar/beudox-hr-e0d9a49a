<!--
generated_by: tessera
source_sha: 9e9fdba262d8de866eda2107f15b952bbe7d1e69
generated_at: 2026-04-27T12:16:57.382Z
action: update
-->

# Beudox HR Management System

A comprehensive HR management application built with React, TypeScript, and Supabase. This frontend application provides tools for managing employee attendance, leave requests, payroll, evaluations, and more.

## Features

- **Employee Management**: Profile management, search, and organization
- **Attendance Tracking**: Upload and manage attendance records with AI-powered parsing
- **Leave Management**: Apply for leave, track balances, and manage requests
- **Payroll Processing**: Generate and view payroll summaries
- **Performance Evaluations**: Schedule and conduct employee reviews
- **Finance & Expenses**: Track company finances and expense categories
- **Settings**: Configure company policies, roles, departments, and more

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library with shadcn/ui
- **Routing**: React Router
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Deployment**: Configured for modern web deployment

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or bun
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
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   Copy `.env` and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   Edit `.env.local` with your Supabase project details.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

- `src/components/`: Reusable UI components
  - `ui/`: Base UI components (buttons, forms, etc.)
  - `layout/`: Layout components (sidebar, topbar, etc.)
  - `attendance/`: Attendance-related components
  - `employee-profile/`: Employee profile tabs
  - `leave/`: Leave management components
  - `payroll/`: Payroll components
  - `settings/`: Admin settings components
- `src/pages/`: Page components
- `src/lib/`: Utility functions and configurations
- `src/integrations/supabase/`: Supabase client and types
- `supabase/`: Database migrations and edge functions

## Contributing

1. Follow the existing code style and TypeScript conventions.
2. Write tests for new features.
3. Update documentation as needed.

## License

This project is proprietary. See LICENSE file for details.