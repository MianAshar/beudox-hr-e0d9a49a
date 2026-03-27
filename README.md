<!--
generated_by: tessera
source_sha: ea60fa1f955ce83642e70153b29070707da198b7
generated_at: 2026-03-27T02:43:15.226Z
action: update
-->

# Beudox HR Frontend Application

A modern, comprehensive Human Resources Management System built with React, TypeScript, and Supabase. This frontend application provides a user-friendly interface for managing employee data, attendance, payroll, leave requests, projects, and more.

## Features

- **Employee Management**: Complete employee profiles with personal details, roles, and assignments
- **Attendance Tracking**: Daily attendance records with check-in/out times, overtime calculations
- **Payroll Processing**: Automated payroll calculations including salary, allowances, bonuses, and deductions
- **Leave Management**: Leave requests, approvals, and balance tracking
- **Project Management**: Project assignments, client management, and invoicing
- **Performance Evaluations**: Daily and periodic employee evaluations
- **Office Expenses**: Expense tracking and approval workflows
- **Loan Management**: Employee loan processing and monthly deductions
- **Notifications**: In-app notifications and email alerts

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with Testing Library
- **Linting**: ESLint

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

3. Create environment variables:
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

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
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   └── NavLink.tsx  # Custom navigation component
├── pages/
│   ├── Index.tsx    # Home page (placeholder)
│   └── NotFound.tsx # 404 error page
├── integrations/
│   └── supabase/    # Supabase client and types
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── main.tsx         # Application entry point
```

## Database Schema

The application uses a comprehensive PostgreSQL database with the following main entities:

- **Companies**: Multi-tenant company management
- **Employees**: Employee profiles and information
- **Attendance Records**: Daily attendance tracking
- **Payroll Records**: Salary processing and payments
- **Leave Management**: Leave requests and balances
- **Projects & Clients**: Project management and client relationships
- **Invoices**: Billing and payment tracking
- **Evaluations**: Performance reviews and scoring

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is private and proprietary to Beudox HR.