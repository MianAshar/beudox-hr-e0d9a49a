<!--
generated_by: tessera
source_sha: c1c40e15f1e1daac85f89e13ea51aa0cf458c7b2
generated_at: 2026-03-31T23:42:39.951Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources Management System built as a modern web application. It provides tools for managing employees, attendance, payroll, projects, clients, and various HR operations in a role-based, secure environment.

## Features

### Core HR Management
- **Employee Management**: Add, edit, and view employee profiles with detailed information
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation, sick leave, and other time-off requests
- **Payroll Processing**: Manage salary calculations and payroll operations
- **Finance Management**: Track expenses, loans, and financial sheets

### Project & Client Management
- **Project Tracking**: Create and manage projects with detailed information
- **Client Relations**: Maintain client database and relationships
- **Evaluations**: Performance evaluation and review system

### Administrative Features
- **Public Holidays**: Manage company-wide holiday schedules
- **HR Policies**: Document and maintain HR policies
- **Notifications**: System-wide notification management
- **Settings**: Configure system preferences and settings

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Radix UI components with Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts

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
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Testing

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
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application uses Supabase for authentication and implements role-based access control. Different user roles have varying levels of access to different sections of the application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.