<!--
generated_by: tessera
source_sha: 7cd56bd223f184273f03b6c7372dbc65d79d4bbd
generated_at: 2026-04-19T21:20:04.480Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, leave tracking, and organizational workflows for businesses.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions for different user roles (HR Manager, CEO, Team Lead, Employee)
- **Profile Management**: Employee profiles with personal information, roles, and organizational data

### Performance & Evaluation
- **Quarterly Evaluations**: Bi-annual performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with filtering by role

### Financial Management
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Finance Dashboard**: Real-time financial metrics and 6-month trend analysis
- **Expense Tracking**: Monthly expense management and reporting
- **Loan Management**: Employee loan tracking and deductions

### Leave & Time Management
- **Leave Management**: Comprehensive leave request and approval system
- **Leave Balances**: Real-time tracking of leave entitlements
- **Public Holidays**: Configurable holiday calendar management

### Project & Client Management
- **Project Management**: Project creation, assignment, and progress tracking
- **Client Management**: Client relationship management with invoicing
- **Task Management**: Individual and team task assignment

### Administrative Features
- **HR Policies**: Rich text policy documents with version control
- **Settings Management**: Company settings, departments, roles, and system configuration
- **Invoice Generation**: Automated invoice creation with PDF export
- **Notification System**: Automated notifications for various HR events

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, Context API for auth
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
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
   
   Copy the environment file and configure Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The project includes Supabase migrations. Run them in your Supabase project:
   ```bash
   # Migrations are located in supabase/migrations/
   # Apply them through Supabase dashboard or CLI
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
# or
bun run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── finance/        # Financial components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for business logic
```

## Authentication & Authorization

The application uses Supabase Auth for user authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint)
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.