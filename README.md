<!--
generated_by: tessera
source_sha: 1d5e0dfda21b7bc05d820d1da31b13fc4b2ba0bf
generated_at: 2026-04-30T00:33:23.758Z
action: update
-->

# Beudox HR Portal

A modern, comprehensive HR management system built for small to medium-sized businesses. This frontend application provides a complete suite of HR tools including employee management, attendance tracking, leave management, payroll processing, performance evaluations, and administrative settings.

## Features

- **Employee Management**: Comprehensive employee profiles with personal details, job information, and document storage
- **Attendance Tracking**: Automated attendance import from biometric devices, manual entry, and reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Salary calculations, overtime tracking, and payslip generation
- **Performance Reviews**: Scheduled evaluations, goal setting, and review cycles
- **Project Management**: Team assignments, task tracking, and project activity logs
- **Administrative Tools**: Company settings, department management, role-based access control
- **Notifications**: Automated alerts for reviews, leave requests, and important updates

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library with shadcn/ui foundation
- **State Management**: React hooks and context
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with validation
- **Routing**: React Router
- **Date Handling**: date-fns
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

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Testing

```bash
npm run test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile components
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
- **AttendanceUploadFlow**: Complex component for importing attendance data from Excel files
- **MandatoryPasswordChange**: Password reset modal for new users
- **SearchableEmployeeSelect**: Employee selection component with search functionality
- **NavLink**: Enhanced navigation link component

## Database Schema

The application uses Supabase with a comprehensive database schema including:

- Employees and user authentication
- Attendance records and imports
- Leave requests and balances
- Payroll data and calculations
- Company settings and configurations
- Performance reviews and evaluations

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software owned by Beudox.