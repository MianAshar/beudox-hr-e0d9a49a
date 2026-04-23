<!--
generated_by: tessera
source_sha: cec2c0bd582903894009724e053f5c5d8068492c
generated_at: 2026-04-23T10:23:54.368Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies.

## Overview

Beudox HR is a full-featured HR management application that streamlines employee lifecycle management, from onboarding to offboarding. The system provides tools for managing employee data, attendance tracking, leave management, payroll processing, performance evaluations, and more.

## Features

### Core HR Functions
- **Employee Management**: Complete employee profiles with personal information, job details, and organizational structure
- **Attendance Tracking**: Daily attendance records with check-in/check-out times, overtime calculation, and absence management
- **Leave Management**: Comprehensive leave request and approval system with multiple leave types
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and deductions
- **Performance Evaluations**: Regular and daily performance reviews with customizable evaluation parameters

### Additional Modules
- **Project Management**: Project tracking with team assignments and activity logging
- **Client Management**: Client relationship management with project associations
- **Invoice Management**: Invoice creation and management for billing
- **HR Policies**: Rich text policy documents with version control
- **Job Descriptions**: Structured job description management
- **Finance Dashboard**: Financial summaries and reporting
- **Loan Management**: Employee loan tracking and management

### Administrative Features
- **Role-Based Access Control**: Granular permissions system for different user roles
- **Settings Management**: Configurable system settings including departments, roles, leave types, and evaluation parameters
- **Public Holiday Management**: Configurable holiday calendar
- **Notification System**: Automated notifications for various HR events

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library built on Radix UI primitives
- **React Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling

### Backend & Infrastructure
- **Supabase** (PostgreSQL database + Authentication + Real-time subscriptions + Storage)
- **Supabase Edge Functions** for server-side logic and API endpoints

### Development Tools
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** for code linting
- **TypeScript** for type checking

### Additional Libraries
- **Tiptap** for rich text editing
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **Lucide React** for icons
- **Sonner** for toast notifications

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr
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
   # or
   bun run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser

### Build for Production

```bash
npm run build
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee profile specific components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and business logic
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control. User roles determine access to different features and pages. The system supports:

- Employee self-service (limited access)
- Manager access (team management)
- HR/Admin access (full system access)

## Database Schema

The application uses a PostgreSQL database managed through Supabase. Key tables include:

- `employees` - Employee master data
- `attendance_records` - Daily attendance entries
- `leave_requests` - Leave applications and approvals
- `payroll_records` - Payroll processing data
- `evaluations` - Performance review data
- `projects` - Project information
- `invoices` - Billing and invoicing data

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure TypeScript types are properly defined
4. Use the established component patterns

## License

This project is proprietary software owned by Beudox.