<!--
generated_by: tessera
source_sha: 0a172969861a69e82328e38f016abf24d251a3c7
generated_at: 2026-03-27T22:22:26.611Z
action: update
-->

# Beudox HR

A modern HR management system built with React, TypeScript, and Supabase. This application provides a comprehensive platform for managing employees, attendance, payroll, projects, and other HR-related tasks.

## Features

- **Employee Management**: Track and manage employee information
- **Attendance Tracking**: Monitor and import attendance data
- **Payroll Management**: Handle payroll processing and approvals
- **Project Management**: Oversee active projects and assignments
- **Role-Based Access**: Different permissions for HR managers, finance managers, and CEOs
- **Secure Authentication**: Supabase-powered authentication with password reset

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and update the Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
├── lib/                # Utility functions
├── pages/              # Page components
└── test/               # Test files
```

## Authentication

The application uses Supabase Auth for user authentication. Users can:
- Sign in with email and password
- Reset their password via email
- Access features based on their role (hr_manager, finance_manager, ceo)

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is private and proprietary to Beudox.