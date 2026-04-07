<!--
generated_by: tessera
source_sha: 7b605e9472f6b8c714de14d5769583c23a81c06a
generated_at: 2026-04-07T21:29:46.483Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, project tracking, client relations, invoicing, policy management, performance evaluations, and payroll processing.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoicing System**: Generate and manage invoices with PDF export
- **HR Policies**: Create and manage company policies with rich text editing
- **Performance Evaluations**: Quarterly and daily evaluation system with detailed feedback
- **Payroll Management**: Automated payroll processing and payslip generation
- **Loan Management**: Track employee loans and repayments
- **Role-Based Access Control**: Secure access based on user roles (CEO, HR Manager, Team Lead, Employee)
- **Responsive Design**: Modern, mobile-friendly interface

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editing**: Tiptap
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

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
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
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
```

### Run Tests

```bash
npm run test
```

### End-to-End Testing

```bash
npx playwright install
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   ├── settings/       # Settings-related components
│   ├── evaluations/    # Evaluation components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **EvaluationTimeline**: Displays evaluation history for employees
- **SearchableEmployeeSelect**: Employee selection component with search
- **RichTextEditor**: WYSIWYG editor for policies and content
- **BeudoxLogo**: Brand logo component with variants

## Authentication & Authorization

The application uses Supabase for authentication and implements role-based access control:

- **CEO**: Full access to all features
- **HR Manager**: Access to HR functions, evaluations, payroll
- **Team Lead**: Limited access to team management and evaluations
- **Employee**: Access to personal data and basic features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is private and proprietary to Beudox.