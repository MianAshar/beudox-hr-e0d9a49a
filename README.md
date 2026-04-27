<!--
generated_by: tessera
source_sha: 67591e8333a4b6f04ebb4ea01e67b436a5bfd499
generated_at: 2026-04-27T10:07:11.644Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with React, TypeScript, and Supabase. Streamlines employee management, attendance tracking, leave requests, payroll processing, and organizational workflows.

## Features

- **Employee Management**: Complete employee profiles with personal information, job details, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording with check-in/out times, overtime calculation, and monthly summaries
- **Leave Management**: Request and approve leave with balance tracking and policy enforcement
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and deductions
- **Performance Reviews**: Scheduled evaluations with increment proposals and salary reviews
- **Project Management**: Team assignments, task tracking, and project activity logging
- **Finance & Expenses**: Expense tracking and invoice generation
- **HR Policies**: Rich text policy documents and organizational guidelines
- **Settings Management**: Company configuration, departments, roles, and system parameters

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router
- **State Management**: React Query for server state, Zustand for local state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Build Tools**: Vite, ESLint, TypeScript
- **Testing**: Vitest, Playwright for E2E testing

## Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## Installation

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
   
   Copy the `.env` file and configure your Supabase credentials:
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
   
   The application uses Supabase migrations. Run the migrations in your Supabase project:
   ```bash
   # The migrations are located in supabase/migrations/
   # Apply them through the Supabase dashboard or CLI
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── employee-profile/  # Employee detail components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Beudox.