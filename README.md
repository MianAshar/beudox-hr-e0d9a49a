<!--
generated_by: tessera
source_sha: eec11b4d7032811604f4f45f4103c46d4f651a70
generated_at: 2026-04-27T12:16:07.535Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern React frontend application. Beudox HR streamlines HR operations including employee management, attendance tracking, leave requests, payroll processing, and performance evaluations.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with personal details, job information, and organizational structure
- **Attendance Tracking**: Automated attendance import from biometric systems, manual entry, and comprehensive reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, personal)
- **Payroll Processing**: Automated payroll calculations with overtime, deductions, and salary history
- **Performance Reviews**: Employee evaluations, salary reviews, and increment proposals
- **Project Management**: Team assignments, project tracking, and activity logging

### Administrative Features
- **Company Settings**: Configure departments, roles, leave types, expense categories
- **User Roles & Permissions**: Granular access control for different user types
- **Notifications**: Automated alerts for reviews, approvals, and system events
- **Audit Logs**: Login tracking and system activity monitoring

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + real-time subscriptions)
- **State Management**: React Query for server state, Zustand for client state
- **Routing**: React Router
- **Forms**: React Hook Form with validation
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
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
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   Alternatively, if using Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── employee-profile/  # Employee detail components
│   ├── attendance/     # Attendance management
│   ├── leave/          # Leave management
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Key Components

### AttendanceUploadFlow
A sophisticated component for importing attendance data from biometric systems. Features:
- Excel file parsing with AI-powered data normalization
- Preview and validation of imported records
- Handling of unmatched employee codes
- Batch processing with progress tracking

### SearchableEmployeeSelect
A searchable dropdown component for employee selection with:
- Real-time filtering by name or designation
- Avatar display and employee details
- Support for "All Employees" option

### Employee Profile Tabs
Comprehensive employee detail views including:
- Personal and job information
- Attendance history with summaries
- Leave balances and requests
- Payroll history and salary reviews
- Document management

## API Integration

The application integrates with Supabase for:
- **Database**: PostgreSQL with real-time subscriptions
- **Authentication**: Supabase Auth for user management
- **Storage**: File uploads for documents and avatars
- **Edge Functions**: Serverless functions for complex operations like attendance parsing

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.