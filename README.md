<!--
generated_by: tessera
source_sha: d555f419dd478f04f76a7eee67dfc80145106d69
generated_at: 2026-04-13T11:02:03.589Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback
- **Leave Management**: Request, approval, and tracking of various leave types
- **Payroll Processing**: Automated payroll generation with payslips and financial reporting
- **Project Management**: Client and project tracking with invoice generation

### Administrative Tools
- **HR Policies**: Rich text policy documents with full formatting support
- **Company Settings**: Configurable departments, roles, leave types, and expense categories
- **Notifications**: Automated notifications for HR events and approvals
- **Public Holidays**: Company-wide holiday management

### Security & Access
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Secure Authentication**: Supabase-powered authentication with password reset
- **Data Protection**: Row Level Security (RLS) policies on all database tables

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent, accessible UI components
- **TanStack Query** for efficient server state management

### Backend & Infrastructure
- **Supabase** for database, authentication, and edge functions
- **PostgreSQL** with Row Level Security
- **Edge Functions** for server-side processing (payroll, invoices, notifications)

### Development Tools
- **ESLint** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **TypeScript** for type safety

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
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
   
   Update the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Run the Supabase migrations to set up the database schema:
   ```bash
   # Assuming you have Supabase CLI installed
   supabase db reset
   ```

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
│   ├── layout/         # App layout components
│   ├── evaluations/    # Evaluation-specific components
│   ├── leave/          # Leave management components
│   ├── settings/       # Settings page components
│   └── hr-policies/    # HR policy components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase project configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.
