<!--
generated_by: tessera
source_sha: a2940cae9a854a2964f99c10b35c874bad43b2a0
generated_at: 2026-04-30T00:33:37.549Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React frontend application. Beudox HR provides organizations with tools to manage employee data, attendance tracking, leave requests, payroll processing, performance evaluations, and company settings.

## Features

- **Employee Management**: Profile management, document storage, and employee search
- **Attendance Tracking**: Upload and process attendance data from biometric systems with AI-powered parsing
- **Leave Management**: Request, approve, and track leave balances
- **Payroll Processing**: Generate payroll reports and manage salary structures
- **Performance Reviews**: Schedule and conduct employee evaluations
- **Company Settings**: Configure departments, roles, leave types, and company policies
- **Dashboard**: Real-time insights and notifications

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library with shadcn/ui
- **Routing**: React Router
- **State Management**: React hooks and context
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Testing**: Vitest

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
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for data storage. The database schema is managed through migrations located in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Settings components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── main.tsx           # Application entry point

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for serverless operations
└── config.toml        # Supabase configuration
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex component for processing attendance data uploads
- **MandatoryPasswordChange**: Security component for password policy enforcement
- **SearchableEmployeeSelect**: Reusable employee selection component

## Contributing

1. Follow the existing code style and component patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure TypeScript types are properly defined

## License

This project is proprietary software. All rights reserved.