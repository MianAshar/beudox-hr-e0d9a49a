<!--
generated_by: tessera
source_sha: c2ab40057cf926796021430a2c0c3cd05baa1e26
generated_at: 2026-04-16T22:52:04.663Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management platform built with modern web technologies. Beudox HR streamlines employee management, payroll processing, leave tracking, performance evaluations, and organizational workflows for businesses.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Attendance Tracking**: Automated time tracking with import capabilities and overtime calculations
- **Leave Management**: Flexible leave types, balance tracking, and approval workflows
- **Payroll Processing**: Automated salary calculations, deductions, and payment processing

### Performance & Development
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Project Management**: Project tracking, resource allocation, and client management
- **HR Policies**: Rich text policy documents with version control

### Financial Management
- **Invoicing**: Client invoicing with PDF generation and payment tracking
- **Expense Management**: Office expenses, monthly budgeting, and approval workflows
- **Loan Management**: Employee loan tracking and monthly deductions

### Administrative Features
- **Role-Based Access Control**: Granular permissions and feature flags
- **Notifications**: Automated email and in-app notifications
- **Multi-Company Support**: Separate data isolation for multiple companies
- **Audit Logging**: Comprehensive activity tracking

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **Supabase** for backend services and real-time features

### UI/UX
- **Radix UI** components for accessible, customizable interfaces
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent design system
- **Lucide React** for icons
- **TipTap** for rich text editing

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Vitest** and **Playwright** for testing
- **PostCSS** and **Autoprefixer** for CSS processing

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
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
   
   Copy the environment file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings page components
│   ├── evaluations/    # Evaluation-related components
│   ├── leave/          # Leave management components
│   └── hr-policies/    # Policy document components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── test/               # Test files
```

## Key Components

### Authentication & Authorization
- Role-based access control with granular permissions
- Protected routes with automatic redirects
- Password reset and invite flows

### Data Management
- Real-time subscriptions for live updates
- Optimistic updates for better UX
- Comprehensive error handling

### Business Logic
- Complex payroll calculations with overtime and deductions
- Leave balance management with carry-over rules
- Evaluation scoring with customizable parameters

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.
