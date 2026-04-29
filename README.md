<!--
generated_by: tessera
source_sha: b0085d77cef341f15dbaf18765c135e796bef7aa
generated_at: 2026-04-29T22:48:35.306Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources management web application built for modern businesses. This frontend application provides a complete HR portal for managing employees, attendance, payroll, leave requests, evaluations, and more.

## Features

- **Employee Management**: Complete employee profiles with personal information, documents, salary history, and performance reviews
- **Attendance Tracking**: Automated attendance import from biometric devices, manual entry, and comprehensive reporting
- **Leave Management**: Request, approve, and track leave balances across multiple leave types
- **Payroll Processing**: Automated payroll generation with overtime calculations and salary reviews
- **Performance Reviews**: Scheduled evaluations with customizable parameters and review cycles
- **Finance & Expenses**: Expense tracking and financial summaries
- **Settings Management**: Company-wide settings for attendance rules, departments, roles, and policies
- **Notifications**: Automated alerts for reviews, approvals, and important HR events

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Routing**: React Router
- **State Management**: React hooks with Supabase real-time subscriptions
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: Vitest + Playwright

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

3. Copy environment variables:
   ```bash
   cp .env .env.local
   ```

4. Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── layout/         # App layout and navigation
│   └── ...
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex attendance file upload and processing
- **MandatoryPasswordChange**: Password reset modal for new users
- **SearchableEmployeeSelect**: Employee selection with search functionality
- **BeudoxLogo**: Brand logo component with variant support

## Authentication

The application uses Supabase Auth for user authentication. New users are required to change their temporary password on first login.

## Database Schema

The application uses a PostgreSQL database with the following main entities:
- Companies
- Employees
- Attendance Records
- Leave Requests
- Payroll Records
- Performance Reviews
- Settings and Configurations

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Use the provided UI components from shadcn/ui
3. Ensure proper error handling and loading states
4. Test components with Vitest and e2e tests with Playwright

## License

This project is proprietary software for Beudox HR solutions.