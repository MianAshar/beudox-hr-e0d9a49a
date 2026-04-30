<!--
generated_by: tessera
source_sha: 39461efdd6e63a02592c9bdc33af9092ef731151
generated_at: 2026-04-30T22:51:02.383Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React frontend application. This portal provides companies with tools to manage employee data, attendance tracking, leave requests, payroll processing, performance evaluations, and organizational settings.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with personal details, roles, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording with analytics, overtime calculations, and anomaly detection
- **Leave Management**: Request and approval system for various leave types with balance tracking
- **Payroll Processing**: Automated payroll generation with overtime calculations and salary history
- **Performance Evaluations**: Scheduled reviews, salary increment proposals, and evaluation timelines
- **Project Management**: Team assignments, project tracking, and activity logging

### Administrative Features
- **Company Settings**: Configure departments, roles, leave types, expense categories, and evaluation parameters
- **User Management**: Role-based access control with login tracking and audit logs
- **Finance Integration**: Invoice generation and financial summary reporting
- **Notification System**: Automated notifications for HR events and approvals

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database with real-time subscriptions)
- **Authentication**: Supabase Auth with role-based permissions
- **State Management**: React hooks and context
- **Routing**: React Router
- **Testing**: Vitest for unit testing, Playwright for E2E testing
- **Code Quality**: ESLint configuration

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
   
   The application uses Supabase migrations. If setting up a new project:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref jqhiijbunselslmvhdwe
   
   # Apply migrations
   supabase db push
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

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── main.tsx           # Application entry point

supabase/
├── migrations/         # Database schema migrations
└── config.toml        # Supabase project configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Authentication & Security

The application uses Supabase Auth for user authentication with the following features:
- Email/password authentication
- Temporary password system for new users
- Mandatory password change on first login
- Role-based access control
- Login tracking and audit logs

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