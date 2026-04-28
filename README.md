<!--
generated_by: tessera
source_sha: c654fd2968a904bbbba2819fed2fab547b920d59
generated_at: 2026-04-28T22:13:43.871Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React frontend application. This portal enables HR teams and employees to manage attendance, payroll, leave requests, employee profiles, and various HR operations through an intuitive web interface.

## Features

- **Employee Management**: Comprehensive employee profiles with attendance, documents, leave, payroll, and salary history
- **Attendance Tracking**: Upload and manage attendance records from biometric systems with AI-powered parsing
- **Payroll Processing**: Generate and manage payroll summaries and salary reviews
- **Leave Management**: Apply for leave, track balances, and manage leave requests
- **Project Management**: Manage teams, track project activities, and assign tasks
- **HR Policies**: Rich text editor for creating and managing company policies
- **Finance Overview**: Summary of financial data and expense categories
- **Settings Management**: Configure company settings, departments, roles, and evaluation parameters
- **Notification System**: Customizable notification preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **Backend Integration**: Supabase (PostgreSQL database, authentication, edge functions)
- **State Management**: React hooks and context
- **Testing**: Vitest for unit tests, Playwright for E2E tests
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
   
   Copy `.env` and update the Supabase configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

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

The built files will be in the `dist` directory.

### Testing

Run unit tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── finance/        # Financial components
│   ├── hr-policies/    # Policy management
│   ├── layout/         # App layout components
│   ├── leave/          # Leave management
│   ├── payroll/        # Payroll components
│   ├── profile/        # User profile
│   ├── projects/       # Project management
│   └── settings/       # Settings panels
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── test/               # Test files
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex flow for uploading and parsing attendance files
- **MandatoryPasswordChange**: Password reset modal for new users
- **SearchableEmployeeSelect**: Employee selection component with search
- **BeudoxLogo**: Logo component with multiple variants

## Contributing

1. Follow the existing code style and component patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure TypeScript types are properly defined

## License

This project is proprietary software for Beudox HR solutions.