<!--
generated_by: tessera
source_sha: 55444638bc53a18285b920d64c478cdcc2ed710c
generated_at: 2026-04-17T23:30:49.218Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with a complete suite of tools to manage employees, payroll, evaluations, leave requests, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Attendance Tracking**: Monitor employee attendance and working hours
- **Payroll Processing**: Automated payroll generation with payslips and salary management

### Performance & Development
- **Quarterly Evaluations**: Bi-annual performance reviews with detailed feedback
- **Daily Evaluations**: Real-time peer and manager feedback system
- **HR Policies**: Centralized policy management with rich text editing

### Financial Management
- **Invoice Management**: Create, send, and track client invoices
- **Expense Tracking**: Monitor and approve employee expenses
- **Loan Management**: Handle employee loan requests and repayments
- **Financial Reporting**: Comprehensive finance sheets and analytics

### Project & Client Management
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project assignments

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles
- **Settings Management**: Configure company settings, departments, roles, and parameters
- **Notifications**: Automated notifications for important HR events
- **Public Holidays**: Manage company-wide holiday schedules

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Backend**: Supabase (Database, Authentication, Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Testing**: Vitest, Playwright

## User Roles

- **CEO**: Full access to all system features
- **HR Manager**: Employee management, evaluations, leave, settings
- **Finance Manager**: Payroll, invoices, finance, expenses
- **Team Lead**: Team management, evaluations, projects
- **Employee**: Personal dashboard, requests, evaluations

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
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for business logic
└── config.toml         # Supabase configuration
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

### Code Quality

- ESLint for code linting
- TypeScript for type checking
- Prettier for code formatting (via ESLint)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.