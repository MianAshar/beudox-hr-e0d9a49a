<!--
generated_by: tessera
source_sha: 3ec6744ead84afc356ca43d3b9becba3c32d942f
generated_at: 2026-04-06T21:16:19.831Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, projects, clients, invoices, HR policies, and more through an intuitive web interface.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and personnel tracking
- **Attendance Tracking**: Monitor employee attendance and time management
- **Leave Management**: Handle vacation requests, sick leave, and time-off policies
- **Payroll Processing**: Calculate salaries, manage payroll cycles, and generate payslips

### Project & Client Management
- **Project Tracking**: Create and manage projects with team assignments and timelines
- **Client Relations**: Maintain client information and project associations
- **Project Evaluations**: Performance tracking and project assessments

### Financial Management
- **Invoice Generation**: Create and manage client invoices with PDF generation
- **Expense Tracking**: Monitor office expenses and outsourcing costs
- **Loan Management**: Handle employee loans and repayments
- **Financial Reporting**: Comprehensive finance sheets and analytics

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Public Holidays**: Configure and manage holiday calendars
- **Settings Management**: Company settings, departments, roles, and system configuration
- **Notifications**: System-wide notification management

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui (Radix UI primitives), Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL, Authentication, Edge Functions)
- **Testing**: Vitest, Playwright
- **Build Tools**: Vite, ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or bun package manager
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
   yarn install
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
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   ├── settings/       # Settings-related components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for serverless operations
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control. User roles determine access to different sections of the application:

- **Admin**: Full access to all features
- **Manager**: Access to team management and project features
- **Employee**: Limited access to personal information and assigned tasks

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Beudox.