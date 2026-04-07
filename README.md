<!--
generated_by: tessera
source_sha: 515930ff3a33e7977abd9ba55d1f7267034c26cd
generated_at: 2026-04-07T11:38:47.773Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track performance through evaluations, maintain HR policies, handle projects and clients, and manage invoicing.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and personnel tracking
- **Role-Based Access Control**: Hierarchical permissions for HR managers, CEOs, team leads, and employees
- **Company Settings**: Configure departments, roles, attendance policies, and company information

### Performance & Evaluations
- **Quarterly Evaluations**: Formal performance reviews with scoring, comments, and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous performance tracking
- **Evaluation Timeline**: Comprehensive view of all evaluations with role-based visibility controls

### HR Policies & Documentation
- **Rich Text Policy Editor**: Create and manage HR policies with full formatting support
- **Policy Management**: Organize and maintain company policies and procedures

### Project & Client Management
- **Project Tracking**: Manage project lifecycle, assignments, and progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and track invoices with PDF export capabilities

### Additional Features
- **Public Holidays**: Configure and manage company holiday schedules
- **Loan Management**: Track employee loans and repayments
- **Dashboard**: Centralized overview of key HR metrics and activities

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editing**: TipTap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
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
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   ├── evaluations/    # Evaluation-specific components
│   ├── hr-policies/    # HR policy components
│   └── settings/       # Settings components
├── pages/              # Page components and routing
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.