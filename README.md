<!--
generated_by: tessera
source_sha: a3b53f4ff60380120caff324d8091f3e845272bd
generated_at: 2026-04-29T22:59:58.863Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources management system built as a modern React application. This portal enables companies to manage employee data, attendance, leave requests, payroll, evaluations, and more through an intuitive web interface.

## Features

- **Employee Management**: Comprehensive employee profiles with attendance, leave, payroll, and salary history
- **Attendance Tracking**: Upload and parse attendance files from biometric systems (ZKTeco-style), with AI-powered data normalization
- **Leave Management**: Apply for leave, track balances, and manage requests
- **Payroll Processing**: Generate payroll summaries and manage salary reviews
- **Performance Evaluations**: Schedule and track employee evaluations
- **Project Management**: Manage teams and track project activities
- **Company Settings**: Configure departments, roles, leave types, expense categories, and more
- **Notifications**: Automated alerts for reviews, leave approvals, and other HR events

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **Authentication**: Supabase Auth
- **State Management**: React hooks and context
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: Vitest + Playwright

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

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   VITE_SUPABASE_PROJECT_ID=your-project-id
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase for backend services. Database migrations are located in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Testing

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex flow for uploading and parsing attendance data
- **MandatoryPasswordChange**: Password reset modal for new users
- **SearchableEmployeeSelect**: Employee selection dropdown with search
- **BeudoxLogo**: Logo component with multiple variants

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commits for commit messages

## License

This project is proprietary software owned by Beudox.