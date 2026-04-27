<!--
generated_by: tessera
source_sha: d4a221d7bd8190e95061645738ff4e1e39415d4c
generated_at: 2026-04-27T21:45:43.875Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, leave, payroll, and organizational workflows.

## Features

- **Employee Management**: Complete employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance import from biometric devices, manual entry, and comprehensive reporting
- **Leave Management**: Request, approve, and track various types of leave with balance calculations
- **Payroll Processing**: Automated payroll generation with overtime calculations and salary history
- **Performance Reviews**: Employee evaluations, salary reviews, and increment proposals
- **Project Management**: Team assignments, project tracking, and activity logging
- **HR Policies**: Rich text editor for company policies and documentation
- **Finance Integration**: Expense tracking and financial summaries
- **Notifications**: Automated alerts for reviews, approvals, and important events
- **Settings Management**: Company configuration, departments, roles, and system preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **UI Components**: Custom component library with Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **State Management**: React Query for server state, custom hooks for local state
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Forms**: React Hook Form with validation

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

The application uses Supabase as its backend. The database schema includes tables for:

- Employees and user authentication
- Attendance records and imports
- Leave requests and balances
- Payroll data and salary history
- Company settings and configurations
- Projects and team assignments
- HR policies and evaluations

Database migrations are managed through Supabase and should be applied automatically when setting up the project.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── employee-profile/ # Employee-specific components
│   ├── attendance/     # Attendance management components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components (Next.js Pages Router style)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations (Supabase)
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex component for importing attendance data from Excel files with AI parsing
- **SearchableEmployeeSelect**: Reusable component for employee selection with search functionality
- **Employee Profile Tabs**: Modular tabs for different aspects of employee data

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Code Quality

The project uses:
- ESLint for code linting
- TypeScript for type safety
- Prettier for code formatting (via ESLint)

### Testing

Unit tests are written with Vitest. Run tests with:

```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software owned by Beudox.