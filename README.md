<!--
generated_by: tessera
source_sha: c85664e8a405e7b31d00ee8299ac77107e6d5b1b
generated_at: 2026-04-27T09:57:37.603Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with powerful tools to manage employees, track attendance, handle payroll, manage projects, and streamline HR operations.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal details, roles, and organizational structure
- **Attendance Tracking**: Automated attendance recording with check-in/out times, overtime calculation, and reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and payslip generation

### Performance & Evaluation
- **Employee Evaluations**: Scheduled performance reviews with customizable parameters
- **Daily Evaluations**: Real-time feedback and performance tracking
- **Salary Reviews**: Increment proposals and salary history tracking

### Project Management
- **Project Tracking**: Create and manage projects with team assignments
- **Client Management**: Maintain client relationships and project associations
- **Task Management**: Assign and track project tasks

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Job Descriptions**: Define roles and responsibilities
- **Settings Management**: Configure departments, roles, leave types, and system parameters
- **Finance Overview**: Track expenses, invoices, and financial summaries

### Security & Access
- **Role-Based Access Control**: Granular permissions for different user roles
- **Secure Authentication**: Supabase-powered authentication with password recovery
- **Audit Logging**: Track user activities and login history

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text**: Tiptap
- **Testing**: Vitest + Playwright

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

3. Create environment file:
   ```bash
   cp .env .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:8080](http://localhost:8080) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── employee-profile/  # Employee profile tabs
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Database Schema

The application uses Supabase with PostgreSQL. Key tables include:

- `employees` - Employee information and profiles
- `attendance_records` - Daily attendance data
- `leave_requests` - Leave applications and approvals
- `payroll_records` - Salary and payroll data
- `projects` - Project information and assignments
- `evaluations` - Performance review data
- `hr_policies` - Company policies and documents

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.
