<!--
generated_by: tessera
source_sha: 1f572027641ba7a2e81e6936f07e1584f6c2c100
generated_at: 2026-04-23T10:25:48.386Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies to streamline HR operations, employee management, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and offboarding
- **Attendance Tracking**: Real-time check-in/check-out, overtime tracking, and attendance analytics
- **Leave Management**: Leave requests, approvals, balance tracking, and policy enforcement
- **Payroll Processing**: Automated payroll generation, payslip distribution, and salary management
- **Performance Evaluations**: Regular and daily performance reviews with structured feedback

### Business Operations
- **Project Management**: Project tracking, team assignments, and resource allocation (with v2 interface)
- **Client Management**: Client relationship management and project associations
- **Invoice Generation**: Automated invoice creation and PDF generation
- **Finance Management**: Financial reporting and expense tracking
- **Loan Management**: Employee loan processing and tracking

### Administrative Tools
- **HR Policies**: Rich text policy documents with version control
- **Job Descriptions**: Structured job posting and role definitions
- **Settings Management**: Company configuration, departments, roles, and system settings
- **Public Holidays**: Holiday calendar management

### User Experience
- **Role-Based Access Control**: Granular permissions system for different user types
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Real-time Notifications**: Instant updates and alerts
- **Dashboard Analytics**: Comprehensive reporting and insights

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components built on Radix UI

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - Authentication and authorization
- **Row Level Security** - Database-level access control

### State Management & Data
- **React Query** - Server state management and caching
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Additional Libraries
- **Recharts** - Data visualization and charts
- **Tiptap** - Rich text editing
- **date-fns** - Date manipulation and formatting
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager

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
   
   Copy the environment file and configure your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase project details:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start Development Server**
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

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (sidebar, topbar)
│   ├── employee-profile/  # Employee profile tabs
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Auth with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Manager**: Team and project management
- **Employee**: Personal profile and tasks

## Database Schema

The application uses a PostgreSQL database with the following main entities:
- Companies, Employees, Roles
- Attendance Records, Leave Requests
- Projects, Tasks, Clients
- Invoices, Payroll Records
- Evaluations, HR Policies

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Use TypeScript for type safety

## License

This project is proprietary software. All rights reserved.