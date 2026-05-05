<!--
generated_by: tessera
source_sha: 70f6138a6540fbdd6fe2fabcd56b64bf91e36a87
generated_at: 2026-05-05T12:05:39.879Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React application. This portal provides organizations with tools to manage employee attendance, leave requests, payroll, evaluations, and organizational settings.

## Features

### Core HR Modules
- **Employee Management**: Profile management, role-based access control, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording, summary analytics, and anomaly detection
- **Leave Management**: Request processing, balance tracking, and approval workflows
- **Payroll Processing**: Salary calculations, overtime tracking, and payslip generation
- **Performance Evaluations**: Review scheduling, parameter configuration, and timeline tracking
- **Project Management**: Team assignments, activity logging, and task tracking

### Administrative Tools
- **Settings Management**: Company configuration, departments, roles, and policies
- **Reporting**: Comprehensive analytics and export capabilities
- **Notification System**: Automated alerts and communication

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **State Management**: React hooks and context
- **Routing**: React Router
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Configured for modern hosting platforms

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
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
   
   Update the following variables with your Supabase project details:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

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
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Key Components

### Authentication & Security
- **MandatoryPasswordChange**: Forces password reset for new/temporary accounts
- **Role-based Access**: Granular permissions system for different user types

### Data Visualization
- **AttendanceSummary**: Comprehensive analytics with charts and insights
- **PayrollDetailSheet**: Detailed payroll breakdowns
- **EvaluationTimeline**: Performance review tracking

### User Experience
- **SearchableEmployeeSelect**: Advanced employee search with avatars
- **BeudoxLogo**: Responsive logo component with multiple variants
- **NavLink**: Enhanced navigation with active state styling

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.