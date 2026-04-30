<!--
generated_by: tessera
source_sha: fad51c4fbe8557906fcec285001b095723101a65
generated_at: 2026-04-30T22:44:29.250Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources management application built as a modern React frontend with Supabase backend integration.

## Overview

Beudox HR Portal is a full-featured HR management system designed to streamline employee lifecycle management, attendance tracking, leave administration, payroll processing, and organizational settings. The application provides a user-friendly interface for HR administrators, managers, and employees to manage various aspects of workforce operations.

## Features

### Core HR Functionality
- **Employee Management**: Comprehensive employee profiles with personal details, roles, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording with analytics, overtime calculations, and anomaly detection
- **Leave Management**: Request, approval, and tracking of various leave types with balance management
- **Payroll Processing**: Salary calculations, overtime compensation, and detailed payroll sheets
- **Performance Reviews**: Employee evaluations with scheduled reviews and salary increment proposals

### Administrative Tools
- **Company Settings**: Configure company information, departments, roles, and policies
- **HR Policies**: Rich text editor for creating and managing company policies
- **Expense Management**: Track and categorize employee expenses
- **Project Management**: Assign employees to projects and track team activities
- **Evaluation Parameters**: Configure performance evaluation criteria

### Analytics & Reporting
- **Attendance Analytics**: Detailed insights including attendance rates, punctuality metrics, and overtime trends
- **Leave Analytics**: Balance tracking and leave utilization reports
- **Payroll Summaries**: Comprehensive payroll data with overtime breakdowns

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library for consistent UI components
- **Lucide React** for icons
- **React Hook Form** for form management
- **Sonner** for toast notifications

### Backend & Database
- **Supabase** for backend-as-a-service including:
  - PostgreSQL database
  - Authentication (Auth)
  - Real-time subscriptions
  - File storage
  - Edge functions for server-side logic

### Development Tools
- **ESLint** for code linting
- **TypeScript** for static type checking
- **Playwright** for end-to-end testing
- **Vitest** for unit testing

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
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
   yarn install
   # or
   pnpm install
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
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order to set up the database schema.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

### Testing

- **Unit Tests**: `npm run test`
- **E2E Tests**: `npm run test:e2e` (requires Playwright setup)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for server-side logic
└── config.toml         # Supabase project configuration
```

## Key Components

### Layout Components
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Navigation sidebar with role-based menu items
- **TopBar**: Header with user menu and notifications

### Feature Components
- **AttendanceSummary**: Comprehensive attendance analytics dashboard
- **MandatoryPasswordChange**: First-time login password setup modal
- **SearchableEmployeeSelect**: Employee selection dropdown with search
- **BeudoxLogo**: Responsive logo component with variants

## Authentication & Authorization

The application uses Supabase Auth for user authentication with role-based access control. Users are assigned roles (admin, manager, employee) that determine their access to different features and data.

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.