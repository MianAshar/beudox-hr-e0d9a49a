<!--
generated_by: tessera
source_sha: f16cc2108c73ed6ffec0d7b9502a7b1476b7f9f1
generated_at: 2026-04-12T18:57:30.220Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, payroll processing, and organizational workflows for businesses.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Payroll Management**: Automated payroll generation, payslip distribution, and financial reporting
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Manage client relationships and project assignments
- **Invoice Management**: Generate and track invoices with PDF export capabilities

### Administrative Tools
- **HR Policies**: Rich text policy documents with full formatting support
- **Loan Management**: Employee loan tracking and management
- **Public Holidays**: Centralized holiday management across the organization
- **Settings**: Comprehensive system configuration including departments, roles, and evaluation parameters

### Security & Access Control
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Secure Authentication**: Supabase-powered authentication with password recovery
- **Data Protection**: Secure data handling with proper authorization checks

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router v6
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editing**: TipTap
- **Charts**: Recharts
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
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
   
   Copy the `.env` file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

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
│   ├── settings/       # Settings-related components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for business logic
└── config.toml         # Supabase project configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## User Roles & Permissions

- **CEO**: Full system access including all features and settings
- **HR Manager**: Employee management, evaluations, payroll, and HR policies
- **Team Lead**: Team member evaluations and project management
- **Employee**: Personal profile, evaluations, and payslips

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.