<!--
generated_by: tessera
source_sha: d6aa191ce5a29b200404c4a91890e483881cf642
generated_at: 2026-04-07T21:26:46.034Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with React, TypeScript, and Supabase. This system provides organizations with tools to manage employees, track attendance, handle payroll, conduct evaluations, and maintain HR policies.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal details, salary information, and organizational structure
- **Attendance Tracking**: Automated attendance recording with overtime calculations and holiday management
- **Payroll Processing**: Comprehensive payroll system with salary calculations, deductions, and payment tracking
- **Leave Management**: Flexible leave request system with approval workflows and balance tracking

### Performance & Evaluation
- **Quarterly Evaluations**: Formal performance reviews with customizable parameters
- **Daily Evaluations**: Real-time feedback system for continuous performance monitoring
- **Evaluation Parameters**: Configurable scoring systems for different evaluation types

### Project & Client Management
- **Project Management**: Project tracking with team assignments, deadlines, and status monitoring
- **Client Management**: Client database with billing information and project associations
- **Invoice Generation**: Automated invoice creation with PDF generation and payment tracking

### Financial Management
- **Expense Tracking**: Office expense management with approval workflows
- **Loan Management**: Employee loan tracking with monthly deductions
- **Salary History**: Complete audit trail of salary changes and adjustments

### HR Administration
- **HR Policies**: Rich text policy documents with version control
- **Public Holidays**: Configurable holiday calendar management
- **Notifications**: Automated notification system for important events

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editor**: Tiptap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest with Playwright for E2E

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

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
   
   Copy `.env` and update the values:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase as its backend. The database schema includes 40+ tables covering all aspects of HR management. The schema is automatically generated from the Supabase project and includes:

- User authentication and authorization
- Multi-tenant company structure
- Comprehensive employee data
- Attendance and payroll systems
- Evaluation frameworks
- Project and client management
- Financial tracking

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Application Architecture

### Routing Structure

The application uses React Router with role-based access control. Key routes include:

- `/` - Root redirect (to login or dashboard)
- `/login` - Authentication
- `/dashboard` - Main dashboard
- `/employees` - Employee management
- `/projects` - Project management
- `/clients` - Client management
- `/invoices` - Invoice management
- `/evaluations` - Performance evaluations
- `/payroll` - Payroll processing
- `/settings` - System configuration

### Role-Based Access Control

The system supports five user roles with different permission levels:

- **CEO**: Full access to all features
- **HR Manager**: Employee management, evaluations, policies
- **Finance Manager**: Payroll, invoices, financial reports
- **Team Lead**: Project management, team evaluations
- **Employee**: Personal data, evaluations, leave requests

### Component Architecture

The application uses a modular component structure:

- **Layout Components**: `AppLayout`, `AppSidebar`, `TopBar`
- **UI Components**: shadcn/ui component library (40+ components)
- **Feature Components**: Domain-specific components (evaluations, policies, etc.)
- **Form Components**: Reusable form inputs and validation

### State Management

- **Server State**: React Query for API data fetching and caching
- **Local State**: React hooks for component state
- **Form State**: React Hook Form for complex forms
- **Global State**: Context providers for auth and theme

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

### Key Components

- **BeudoxLogo**: Brand logo component with variant support
- **NavLink**: Enhanced navigation link with active state
- **SearchableEmployeeSelect**: Employee selection with search
- **EvaluationTimeline**: Performance evaluation history
- **RichTextEditor**: WYSIWYG editor for policies
- **AppLayout**: Main application layout with sidebar

### Testing

The application includes both unit and end-to-end testing:

- **Unit Tests**: Vitest for component and utility testing
- **E2E Tests**: Playwright for user workflow testing
- **Test Coverage**: Component and hook testing

## Deployment

### Build Process

1. Build the application:
   ```bash
   npm run build
   ```

2. The build artifacts will be stored in the `dist/` directory

3. Deploy the `dist/` directory to your hosting provider

### Environment Configuration

Ensure the following environment variables are set in production:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.