<!--
generated_by: tessera
source_sha: 4195ffbc987c849572bca7fd3274e8f51d6dcf74
generated_at: 2026-03-27T22:42:30.194Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. This application provides organizations with tools to manage employees, attendance, payroll, leave management, projects, and financial operations.

## Features

### People Management
- **Employee Management**: Complete employee profiles with personal details, employment information, and role assignments
- **Attendance Tracking**: Automated attendance recording with check-in/out times, overtime calculations, and import capabilities
- **Leave Management**: Request, approve, and track various types of leave with balance management
- **Public Holidays**: Manage company-wide holidays and recurring events

### Finance & Payroll
- **Payroll Processing**: Automated payroll calculations including basic salary, allowances, overtime, and deductions
- **Loan Management**: Employee loan tracking with monthly deductions and balance monitoring
- **Office Expenses**: Expense tracking and approval workflows
- **Outsourcing**: Track external service providers and fees

### Project Management
- **Project Tracking**: Manage client projects with deadlines, budgets, and team assignments
- **Client Management**: Maintain client relationships and billing information
- **Invoicing**: Generate and manage client invoices with payment tracking

### System Features
- **User Authentication**: Secure login with role-based access control
- **Notifications**: In-app and email notifications for important events
- **HR Documents**: Version-controlled policy and procedure documents
- **Evaluations**: Employee performance evaluations and daily feedback
- **Settings**: Company-wide configuration and feature flags

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest with Playwright for E2E

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager

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
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── test/               # Test files
```

## Database Schema

The application uses a PostgreSQL database with the following main entities:

- **companies**: Organization/company information
- **employees**: Employee profiles and details
- **attendance_records**: Daily attendance data
- **payroll_records**: Monthly payroll information
- **leave_requests**: Employee leave applications
- **projects**: Client project management
- **clients**: Client relationship data
- **invoices**: Billing and invoicing

See `src/integrations/supabase/types.ts` for the complete database schema.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and run tests: `npm run test`
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Submit a pull request

## License

This project is private and proprietary.