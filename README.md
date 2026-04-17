<!--
generated_by: tessera
source_sha: 93f32a7f8c82f0295378746b3c7db04ca8f6fd37
generated_at: 2026-04-17T14:44:52.090Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built for modern businesses. This system provides tools for employee management, performance evaluations, leave tracking, payroll processing, project management, and more.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Leave Management**: Request, approve, and track various types of leave
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **HR Policies**: Rich text policy documents with version control

### Project & Client Management
- **Project Tracking**: Create and manage projects with team assignments
- **Client Management**: Maintain client relationships and project associations
- **Invoice Generation**: Automated invoice creation and PDF generation

### Administrative Tools
- **Role-Based Access Control**: Granular permissions for different user roles
- **Settings Management**: Company configuration, departments, roles, and system parameters
- **Public Holidays**: Configurable holiday calendars
- **Finance Dashboard**: Financial reporting and analytics

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editing**: TipTap
- **Charts**: Recharts
- **Testing**: Vitest for unit tests, Playwright for E2E tests

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

3. **Environment Configuration**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
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
│   ├── evaluations/    # Evaluation-specific components
│   ├── leave/          # Leave management components
│   ├── settings/       # Settings page components
│   └── hr-policies/    # HR policy components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control. User roles include:
- **Employee**: Basic access to personal data and requests
- **Team Lead**: Additional permissions for team management
- **HR Manager**: Full HR functionality access
- **CEO**: Administrative access to all features

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.