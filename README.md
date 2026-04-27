<!--
generated_by: tessera
source_sha: 38926575f05423a02dbd6595514277fe24903388
generated_at: 2026-04-27T23:15:14.902Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React frontend application. This portal provides HR professionals and employees with tools to manage attendance, leave requests, payroll, evaluations, and organizational settings.

## Features

### Core HR Functionality
- **Employee Management**: Profile management, job descriptions, and organizational hierarchy
- **Attendance Tracking**: Upload and process attendance data from biometric systems, track working hours, overtime, and late arrivals
- **Leave Management**: Request, approve, and track leave balances across different leave types
- **Payroll Processing**: Generate payroll reports, track salary history, and manage increments
- **Performance Evaluations**: Schedule and conduct employee evaluations with customizable parameters
- **Finance Management**: Track expenses, manage categories, and generate financial summaries

### Administrative Tools
- **Company Settings**: Configure departments, roles, leave types, and evaluation parameters
- **User Management**: Role-based access control with granular permissions
- **Reporting**: Comprehensive dashboards and export capabilities
- **Notifications**: Automated alerts for reviews, approvals, and important HR events

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Custom component library based on shadcn/ui
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **Authentication**: Supabase Auth
- **State Management**: React hooks and context
- **File Processing**: SheetJS for Excel file parsing
- **Testing**: Vitest

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
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

3. Configure environment variables:
   
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

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase for data storage. Database migrations are included in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-id`
3. Run migrations: `supabase db push`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── employee-profile/ # Employee profile sections
│   └── settings/       # Administrative settings
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
supabase/
├── functions/          # Edge Functions for server-side logic
└── migrations/         # Database schema migrations
```

## Key Components

### Layout System
- `AppLayout`: Main application layout with sidebar navigation
- `AppSidebar`: Navigation sidebar with role-based menu items
- `TopBar`: Header with user menu and notifications

### Core Features
- `AttendanceUploadFlow`: Excel file upload and processing for attendance data
- `MandatoryPasswordChange`: Password reset modal for new users
- `SearchableEmployeeSelect`: Employee selection component with search
- `BeudoxLogo`: Brand logo component with theme variants

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Code Quality

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

## Deployment

The application can be deployed to any static hosting service. Build the project and deploy the `dist` directory:

```bash
npm run build
```

Recommended deployment platforms:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Supabase Edge Functions for backend logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.