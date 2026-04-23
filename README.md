<!--
generated_by: tessera
source_sha: 7b117f53775774b46de6ca00329ecf9e5cbb7248
generated_at: 2026-04-23T11:34:32.893Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This system provides organizations with tools to manage employees, track attendance, handle payroll, manage leave requests, conduct evaluations, and maintain HR policies.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Attendance Tracking**: Daily attendance records with check-in/check-out times, overtime tracking, and absence management
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and deductions
- **Performance Evaluations**: Regular and daily employee evaluations with customizable parameters

### Project & Client Management
- **Project Management**: Create and manage projects with team assignments and activity tracking
- **Client Management**: Maintain client relationships and project associations
- **Task Management**: Assign and track tasks within projects

### Financial Management
- **Invoice Management**: Generate and manage client invoices
- **Finance Dashboard**: Overview of financial metrics and reports
- **Loan Management**: Track employee loans and repayments

### Administrative Features
- **HR Policies**: Create and manage company policies with rich text editing
- **Job Descriptions**: Maintain detailed job descriptions and requirements
- **Settings Management**: Configure departments, roles, leave types, expense categories, and company information
- **Public Holidays**: Manage company-wide holiday schedules

### User Experience
- **Role-based Access Control**: Secure access based on user roles and permissions
- **Responsive Design**: Mobile-friendly interface built with modern UI components
- **Real-time Notifications**: Toast notifications and activity feeds
- **Search & Filtering**: Advanced search and filtering across all modules

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data fetching and caching

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Open source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication & authorization
  - Edge functions for serverless computing
  - File storage

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing
- **React Hook Form** - Form management
- **Zod** - Schema validation

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using bun
   bun install
   ```

3. **Environment Setup**
   
   The `.env` file is already configured with Supabase credentials. If you need to use different Supabase credentials, update the following variables:
   ```env
   VITE_SUPABASE_PROJECT_ID=your-project-id
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The Supabase migrations are included in the `supabase/migrations/` directory. To apply them:
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref jqhiijbunselslmvhdwe
   
   # Apply migrations
   supabase db push
   ```

5. **Start the development server**
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
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
│   ├── utils.ts        # General utilities
│   ├── role-access.ts  # Role-based access control
│   ├── format-date.ts  # Date formatting utilities
│   └── ...
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **Authentication**: Email/password authentication with password reset
- **Authorization**: Role-based permissions checked on route access
- **Session Management**: Automatic session handling and refresh

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.