<!--
generated_by: tessera
source_sha: 0272dd04f191ac6be2965248a6a521b628e3cc0f
generated_at: 2026-04-30T22:39:47.836Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, leave requests, payroll, evaluations, and organizational settings.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with personal details, roles, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording, summary reports, and anomaly detection
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Salary calculations, overtime tracking, and payroll generation
- **Performance Evaluations**: Employee reviews, salary reviews, and performance tracking
- **Project Management**: Team assignments, project tracking, and activity logging

### Administrative Features
- **Company Settings**: Configure departments, roles, leave types, expense categories
- **User Authentication**: Secure login with mandatory password changes for new users
- **Notification System**: Automated notifications for HR events and approvals
- **Audit Logs**: Track changes to employee data and system configurations

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router
- **State Management**: React hooks and context
- **Backend**: Supabase (PostgreSQL database + real-time subscriptions)
- **UI Components**: Custom component library with Radix UI primitives
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Code Quality**: ESLint, TypeScript strict mode

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

3. **Environment Setup**
   
   Copy the `.env` file and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   ```bash
   # Using Supabase CLI
   supabase db reset
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

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
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── employee-profile/ # Employee profile sections
│   ├── evaluations/    # Performance evaluation components
│   ├── projects/       # Project management components
│   ├── settings/       # Administrative settings
│   └── ...
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for business logic
└── config.toml         # Supabase project configuration
```

## Key Components

### Layout System
- `AppLayout`: Main application layout with sidebar navigation
- `AppSidebar`: Collapsible sidebar with navigation menu
- `TopBar`: Header with user menu and notifications
- `NotificationBell`: Real-time notification indicator

### Core Features
- `AttendanceSummary`: Comprehensive attendance analytics and reporting
- `MandatoryPasswordChange`: Secure password setup for new users
- `SearchableEmployeeSelect`: Employee selection with search functionality
- `BeudoxLogo`: Brand logo component with multiple variants

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

### Code Quality

The project uses:
- **TypeScript** with strict mode enabled
- **ESLint** for code linting
- **Prettier** for code formatting (via ESLint)
- **Vitest** for unit testing
- **Playwright** for E2E testing

### Database Schema

The application uses a PostgreSQL database with the following main entities:
- `employees` - Employee records
- `attendance_records` - Daily attendance data
- `leave_requests` - Leave applications and approvals
- `payroll_records` - Salary and payroll data
- `projects` - Project information
- `evaluations` - Performance reviews
- `companies` - Company/organization data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.