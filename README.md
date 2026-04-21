<!--
generated_by: tessera
source_sha: ade94f0920f354b96c0bb030564c387eefe27139
generated_at: 2026-04-21T10:39:57.560Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, attendance tracking, payroll processing, leave management, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and organizational structure
- **Attendance Tracking**: Real-time attendance monitoring with check-in/check-out, overtime calculation, and reporting
- **Leave Management**: Comprehensive leave request system with approval workflows and balance tracking
- **Payroll Processing**: Automated payroll generation with salary calculations, deductions, and payslip generation
- **Performance Evaluations**: Employee evaluation system with periodic reviews and daily feedback mechanisms

### Organizational Tools
- **Project Management**: Project tracking with team assignments, task management, and progress monitoring
- **Client Management**: Client relationship management with project associations and invoicing
- **Invoice Management**: Professional invoice creation, tracking, and PDF generation
- **HR Policies**: Digital policy management with rich text editing and version control
- **Job Descriptions**: Structured job description management for recruitment and role clarity

### Administrative Features
- **Role-Based Access Control**: Granular permissions system ensuring users only access authorized features
- **Settings Management**: Comprehensive system configuration including departments, roles, leave types, and company settings
- **Finance Dashboard**: Financial overview with expense tracking and reporting
- **Loan Management**: Employee loan tracking and repayment management

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with comprehensive type definitions
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **shadcn/ui** - High-quality React components built on Radix UI
- **React Router** - Client-side routing with protected routes
- **React Query** - Powerful data fetching and caching
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### Backend & Infrastructure
- **Supabase** - Open source Firebase alternative providing:
  - PostgreSQL database with real-time subscriptions
  - Authentication with email/password and social providers
  - Edge Functions for serverless compute
  - File storage for documents and assets
  - Auto-generated API with TypeScript types

### Development Tools
- **ESLint** - Code linting and formatting
- **Vitest** - Fast unit testing framework
- **Playwright** - End-to-end testing
- **TypeScript** - Static type checking

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

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
   
   Copy the environment file and configure Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   
   The `.env` file should contain:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
# or
bun run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/ # Employee profile specific components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **Authentication**: Email/password with support for password reset and invitation flows
- **Authorization**: Route-level protection with role-based permissions
- **Session Management**: Automatic token refresh and session persistence

## Database Schema

The application uses a comprehensive PostgreSQL schema managed through Supabase migrations. Key entities include:

- **Employees**: User profiles with roles, departments, and organizational data
- **Attendance Records**: Time tracking with check-in/out times and overtime
- **Leave Requests**: Leave management with approval workflows
- **Payroll Records**: Salary calculations and payment history
- **Projects**: Project management with team assignments
- **Evaluations**: Performance review system
- **Invoices**: Client billing and payment tracking

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project maintains high code quality standards:

- **TypeScript**: Strict type checking enabled
- **ESLint**: Comprehensive linting rules
- **Prettier**: Code formatting (via ESLint)
- **Testing**: Unit tests with Vitest
- **E2E Testing**: Playwright for critical user flows

### Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure TypeScript types are properly defined
4. Test across different screen sizes and browsers
5. Follow commit message conventions

## Deployment

The application is designed to be deployed to modern hosting platforms:

- **Vercel**: Optimized for Vite applications
- **Netlify**: Static hosting with serverless functions
- **Railway**: Full-stack deployment with database
- **Docker**: Containerized deployment

## Support

For support and questions:
- Check the documentation in this README
- Review the code comments and TypeScript types
- Examine the Supabase dashboard for database insights
- Check browser console for client-side errors

## License

This project is proprietary software. All rights reserved.