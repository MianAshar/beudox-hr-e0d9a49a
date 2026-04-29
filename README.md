<!--
generated_by: tessera
source_sha: 7fe05c9655c0eed167a47ea11644c29b5fb2eb7d
generated_at: 2026-04-29T23:29:13.746Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources management system built as a modern web application for managing employee data, attendance, leave requests, payroll, and organizational settings.

## Features

- **Employee Management**: Complete employee profiles with personal information, documents, and organizational details
- **Attendance Tracking**: Automated attendance upload with AI-powered parsing, time tracking, overtime calculations, and reporting
- **Leave Management**: Leave request system with balances, approvals, and policy enforcement
- **Payroll Processing**: Salary calculations, increment proposals, payroll summaries, and financial reporting
- **Performance Reviews**: Employee evaluation timelines, salary reviews, and performance tracking
- **Organizational Settings**: Company configuration, departments, roles, expense categories, and HR policies
- **Notifications**: Real-time notifications for important HR events and approvals

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui with Tailwind CSS
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **State Management**: React hooks and context
- **Styling**: Tailwind CSS with custom design system
- **Testing**: Vitest for unit testing
- **Deployment**: Modern web standards

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

The application uses Supabase as its backend. The database schema is managed through SQL migrations located in the `supabase/migrations/` directory. These migrations set up tables for:

- Employees and user authentication
- Attendance records and imports
- Leave requests and balances
- Payroll data and salary history
- Company settings and organizational structure
- Notifications and audit logs

To set up the database:

1. Create a new Supabase project
2. Run the migrations in order (they are timestamped)
3. Configure authentication providers as needed
4. Set up edge functions for AI-powered features (like attendance parsing)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Testing

Run the test suite:

```bash
npm run test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── layout/         # App layout and navigation
│   └── settings/       # Admin settings components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── test/               # Test files
supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex component for uploading and parsing attendance data
- **EmployeeProfile**: Multi-tab interface for employee information
- **MandatoryPasswordChange**: Security component for password management
- **SearchableEmployeeSelect**: Reusable employee selection component

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all components are properly typed

## License

This project is proprietary software. All rights reserved.