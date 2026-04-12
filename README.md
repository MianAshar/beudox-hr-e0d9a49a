<!--
generated_by: tessera
source_sha: 49578b573e25d88fc3ae0c98825cf24c1b2dc383
generated_at: 2026-04-12T19:55:08.983Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies, designed to streamline HR operations for small to medium-sized businesses.

## Overview

Beudox HR is a full-featured HR management platform that handles employee lifecycle management, performance evaluations, payroll processing, leave management, and more. The system supports role-based access control with different permission levels for employees, managers, and executives.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly reviews and daily feedback system
- **Leave Management**: Request, approval, and tracking of various leave types
- **Payroll Processing**: Automated payroll generation with payslips
- **Attendance Tracking**: Time tracking and attendance management

### Business Operations
- **Project Management**: Project creation, assignment, and tracking
- **Client Management**: Client profiles and relationship management
- **Invoice Management**: Invoice creation, tracking, and PDF generation
- **Finance Management**: Financial reporting and expense tracking

### Administrative Features
- **HR Policies**: Rich text policy documents with formatting
- **Loan Management**: Employee loan requests and approvals
- **Notifications**: Automated notifications and alerts
- **Settings**: Configurable company settings and parameters

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router v6** for client-side routing with protected routes
- **Tailwind CSS** for utility-first styling
- **Radix UI** components via shadcn/ui for accessible UI primitives
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling

### Backend & Infrastructure
- **Supabase** (PostgreSQL database, authentication, storage, edge functions)
- **Supabase Auth** for user authentication and authorization
- **Supabase Storage** for file uploads (avatars, documents)
- **Supabase Edge Functions** for server-side processing (payroll, invoices)

### Development Tools
- **ESLint** for code linting
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **TypeScript** for type safety

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
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
   yarn install
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
│   ├── layout/         # Layout components (sidebar, topbar)
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── ...
```

## User Roles & Permissions

The system implements role-based access control with the following roles:

- **CEO**: Full access to all features
- **HR Manager**: Employee management, evaluations, policies, settings
- **Finance Manager**: Payroll, invoices, finance, expenses
- **Team Lead**: Project management, team evaluations, basic HR features
- **Employee**: Personal dashboard, leave requests, evaluations

## Key Components

### Authentication Flow
- Login with email/password
- Password reset functionality
- Role-based route protection
- Automatic session management

### Data Management
- Real-time data synchronization with Supabase
- Optimistic updates with React Query
- Type-safe database operations

### UI/UX Features
- Responsive design for mobile and desktop
- Dark/light theme support
- Accessible components with Radix UI
- Toast notifications for user feedback

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses ESLint for code linting and follows TypeScript best practices. All components are built with accessibility in mind using Radix UI primitives.

### Testing

Unit tests are written with Vitest and React Testing Library. End-to-end tests use Playwright.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.