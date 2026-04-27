<!--
generated_by: tessera
source_sha: f1c7b24aebbcb16f64ce0b6e0fd35cd6b35dec13
generated_at: 2026-04-27T12:05:40.623Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, leave, payroll, and organizational workflows.

## Features

- **Employee Management**: Complete employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance import from Excel files, time tracking, overtime calculation, and reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Salary management, increment proposals, payroll summaries, and financial reporting
- **HR Policies**: Rich text editor for creating and managing company policies
- **Project Management**: Team assignments, project tracking, and activity logging
- **Settings & Administration**: Company settings, department management, role-based access control
- **Notifications**: Automated alerts for reviews, approvals, and important HR events

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library with shadcn/ui foundation
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **State Management**: React Query for server state, custom hooks for local state
- **Routing**: React Router
- **Forms**: React Hook Form with validation
- **Charts**: Custom chart components
- **File Processing**: SheetJS for Excel file handling
- **Date Handling**: date-fns

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
   
   Copy `.env` and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. Run database migrations:
   
   The SQL migrations are located in `supabase/migrations/`. Apply them to your Supabase database.

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components (Next.js Pages Router style)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for server-side logic
└── config.toml         # Supabase configuration
```

## Key Components

### Core Components

- **AppLayout**: Main application layout with sidebar navigation
- **BeudoxLogo**: Company logo component with variant support
- **NavLink**: Enhanced navigation link with active state styling
- **SearchableEmployeeSelect**: Employee selection component with search functionality

### Feature Components

- **AttendanceUploadFlow**: Complex workflow for importing attendance data from Excel files
- **AttendanceTab**: Employee attendance history and summary view
- **LeaveBalancesTab**: Leave balance management
- **PayrollSummary**: Payroll data visualization
- **EvaluationTimeline**: Performance evaluation tracking

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Testing

The project includes unit tests using Vitest. Run tests with:

```bash
npm run test
```

### Code Quality

- ESLint for code linting
- TypeScript for type safety
- Prettier for code formatting (via ESLint)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.