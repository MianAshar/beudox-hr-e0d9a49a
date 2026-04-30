<!--
generated_by: tessera
source_sha: efbbd50b6d210611a4b2ee1cb2e74d971c2debbf
generated_at: 2026-04-30T11:49:18.735Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React-based web application. Beudox HR streamlines employee management, attendance tracking, leave requests, payroll processing, and organizational workflows for businesses.

## Features

### Core HR Functionality
- **Employee Profiles**: Complete employee information management with roles, departments, and organizational hierarchy
- **Attendance Management**: Automated attendance tracking with check-in/out, overtime calculation, and anomaly detection
- **Leave Management**: Comprehensive leave request system with balances, approvals, and policy enforcement
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and deductions
- **Performance Evaluations**: Structured evaluation timelines and salary review processes
- **Project Management**: Team assignment, activity logging, and project tracking

### Administrative Features
- **Company Settings**: Configurable departments, roles, leave types, expense categories, and evaluation parameters
- **User Management**: Role-based access control with granular permissions
- **Notification System**: Automated notifications for HR events and approvals
- **Audit Logs**: Comprehensive login tracking and activity monitoring

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **State Management**: React hooks with Supabase real-time subscriptions
- **Testing**: Vitest for unit testing
- **Deployment**: Configured for modern web hosting platforms

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
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. **Database Setup**
   
   The application uses Supabase migrations for database schema. The migrations are located in `supabase/migrations/` and will be applied automatically when you run the Supabase CLI commands.
   
   If you're setting up locally:
   ```bash
   npx supabase start
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
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── attendance/      # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── leave/           # Leave management components
│   ├── payroll/         # Payroll components
│   ├── settings/        # Admin settings components
│   └── ...
├── pages/               # Page components (routes)
├── lib/                 # Utility functions and configurations
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
└── main.tsx            # Application entry point

supabase/
├── migrations/          # Database schema migrations
├── functions/           # Edge functions for server-side logic
└── config.toml         # Supabase project configuration
```

## Key Components

### Layout & Navigation
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Responsive sidebar with role-based menu items
- **TopBar**: Header with user menu and notifications
- **BeudoxLogo**: Brand logo component with variant support

### Core Features
- **AttendanceSummary**: Comprehensive attendance analytics and reporting
- **MandatoryPasswordChange**: Secure password reset flow for new users
- **SearchableEmployeeSelect**: Employee selection component with search
- **NavLink**: Enhanced navigation link with active state styling

## Authentication & Security

The application uses Supabase Auth for user authentication with the following security features:

- JWT-based authentication
- Role-based access control (RBAC)
- Secure password policies
- Login attempt monitoring
- Session management

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation for API changes
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team or refer to the internal documentation.