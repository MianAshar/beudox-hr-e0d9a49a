<!--
generated_by: tessera
source_sha: b819961984576acb409f137ceb3be5a11f6ae7ea
generated_at: 2026-04-07T22:44:34.430Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, payroll processing, and organizational workflows for businesses.

## Features

### Core HR Management
- **Employee Profiles**: Complete employee information management with avatars, roles, and designations
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Company Settings**: Configure departments, roles, attendance policies, and expense categories

### Performance & Evaluations
- **Quarterly Evaluations**: Formal performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with filtering based on roles

### Financial Management
- **Payroll Processing**: Automated payroll generation with attendance tracking
- **Invoice Management**: Client invoicing with PDF generation
- **Expense Tracking**: Categorize and manage business expenses
- **Loan Management**: Track employee loans and repayments

### Project & Client Management
- **Project Tracking**: Manage projects with team assignments and progress tracking
- **Client Relationships**: Maintain client information and project associations

### Policy & Compliance
- **HR Policies**: Rich text policy documents with formatting capabilities
- **Public Holidays**: Configure and manage company holidays

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editor**: TipTap
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Charts**: Recharts for data visualization
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

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
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase migrations for database schema. The migrations are located in `supabase/migrations/` and will be applied automatically when you set up your Supabase project.

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   ├── settings/       # Settings-specific components
│   └── ...             # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application implements role-based access control with the following roles:
- **CEO**: Full access to all features
- **HR Manager**: Access to HR functions, evaluations, and settings
- **Team Lead**: Limited access to team evaluations and basic HR functions
- **Employee**: Access to personal profile, evaluations, and payslips

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

This project is private and proprietary.