<!--
generated_by: tessera
source_sha: ababcb6b892634bddcc01677394a2a62f7e2451c
generated_at: 2026-04-17T22:59:35.467Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies, designed to streamline HR operations for businesses of all sizes.

## Overview

Beudox HR is a full-featured HR management platform that provides organizations with tools to manage employees, projects, payroll, evaluations, leave requests, and more. The system features a multi-tenant architecture supporting multiple companies, role-based access control, and a rich user interface.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profile management, and offboarding
- **Organization Structure**: Department and role management with customizable permissions
- **Attendance Tracking**: Automated attendance recording with overtime calculations
- **Leave Management**: Comprehensive leave request and approval system with balance tracking

### Performance & Evaluation
- **Quarterly Evaluations**: Formal performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Parameters**: Customizable evaluation criteria and scoring systems

### Financial Management
- **Payroll Processing**: Automated payroll calculations with overtime, bonuses, and deductions
- **Loan Management**: Employee loan tracking and monthly deduction processing
- **Expense Management**: Office and employee expense tracking with approval workflows
- **Invoicing**: Client invoicing with payment tracking and PDF generation

### Project Management
- **Project Tracking**: Project lifecycle management with client assignments
- **Resource Allocation**: Employee assignment to projects with time tracking
- **Client Management**: Client relationship management with billing information

### Administrative Features
- **HR Policies**: Document management system for company policies and procedures
- **Notifications**: Automated notification system for important events
- **Reporting**: Comprehensive reporting and analytics
- **Settings**: Company-wide configuration and customization

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **React Query (TanStack Query)** for server state management
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom design system
- **TipTap** rich text editor for policy documents
- **React Hook Form** with Zod validation for form management

### Backend & Database
- **Supabase** (PostgreSQL) for backend services and real-time features
- **Row Level Security (RLS)** for multi-tenant data isolation
- **Supabase Auth** for user authentication and authorization
- **Supabase Storage** for file uploads (avatars, receipts, documents)

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** for code quality
- **TypeScript** for type safety

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
   
   Update the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The database schema is automatically managed through Supabase migrations. The system includes 23 migration files that set up all necessary tables, relationships, and policies.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
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
│   ├── employees/      # Employee-related components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   ├── settings/       # Settings components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── test/               # Test files
```

## Authentication & Authorization

The system uses Supabase Auth for user authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and basic operations

## API Architecture

The application follows a modern React architecture:

- **Data Fetching**: React Query for caching and synchronization
- **State Management**: React hooks with local component state
- **Form Handling**: React Hook Form with Zod schema validation
- **Real-time Updates**: Supabase real-time subscriptions
- **Error Handling**: Comprehensive error boundaries and user feedback

## Database Schema

The system uses a PostgreSQL database with 40+ tables organized around:

- **Core Entities**: companies, employees, roles
- **HR Operations**: evaluations, leave_requests, payroll_records
- **Business Operations**: projects, clients, invoices
- **Financial**: expenses, loans, salary_history
- **System**: notifications, settings, audit logs

All tables include proper foreign key relationships and Row Level Security policies for multi-tenant data isolation.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

### Code Quality

The project maintains high code quality standards:
- TypeScript for type safety
- ESLint for code consistency
- Prettier for code formatting
- Comprehensive test coverage

## Deployment

The application is designed to be deployed on modern hosting platforms:

- **Frontend**: Vercel, Netlify, or any static hosting service
- **Backend**: Supabase handles all backend services
- **Database**: Supabase PostgreSQL with automatic scaling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.