<!--
generated_by: tessera
source_sha: 05edf419b373dcd66367c68c70f2f45ed63615f7
generated_at: 2026-04-28T22:00:13.131Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built with React, TypeScript, and Supabase. This frontend application provides a modern, intuitive interface for managing employee data, attendance, leave requests, payroll, evaluations, and more.

## Features

- **Employee Management**: Profile management, salary reviews, and increment proposals
- **Attendance Tracking**: Upload and manage attendance records with AI-powered parsing
- **Leave Management**: Apply for leave, track balances, and manage requests
- **Payroll Processing**: Generate payroll summaries and handle overtime calculations
- **Performance Evaluations**: Timeline-based evaluation tracking and scheduling
- **Finance Management**: Expense categories and financial summaries
- **HR Policies**: Rich text editor for policy management
- **Settings**: Company configuration, departments, roles, and system settings
- **Notifications**: Customizable notification preferences
- **Project Management**: Team management and activity logging

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication, Edge Functions)
- **Routing**: React Router
- **State Management**: React hooks and context
- **Testing**: Vitest and Playwright

## Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Configuration**
   
   Copy the `.env` file and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. **Database Setup**
   
   The application uses Supabase migrations. Ensure your Supabase project has the required tables and functions set up. The migrations are located in the `supabase/migrations/` directory.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── evaluations/    # Evaluation components
│   ├── finance/        # Finance components
│   ├── hr-policies/    # HR policy components
│   ├── projects/       # Project management components
│   ├── profile/        # Profile settings
│   └── settings/       # System settings components
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex component for uploading and parsing attendance Excel files
- **MandatoryPasswordChange**: Modal for initial password setup
- **SearchableEmployeeSelect**: Reusable employee selection component
- **BeudoxLogo**: Logo component with variant support

## Authentication

The application uses Supabase Authentication. New users are required to change their temporary password on first login through the `MandatoryPasswordChange` component.

## Deployment

Build the application for production:
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Contributing

1. Follow the existing code style and component patterns
2. Write tests for new features
3. Update documentation as needed
4. Use TypeScript strictly

## License

This project is proprietary software for Beudox HR systems.