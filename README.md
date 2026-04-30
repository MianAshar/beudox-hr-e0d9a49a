<!--
generated_by: tessera
source_sha: 99bde0343136c5555684a3394152a0ef99c680ed
generated_at: 2026-04-30T11:00:42.316Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, attendance, payroll, leave, evaluations, projects, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Attendance Tracking**: Automated attendance recording with analytics and reporting
- **Leave Management**: Request, approve, and track various types of leave
- **Payroll Processing**: Generate payslips, manage salaries, and handle overtime calculations
- **Performance Evaluations**: Regular and daily evaluations with customizable parameters

### Project & Client Management
- **Project Management**: Create and manage projects with team assignments and task tracking
- **Client Relations**: Maintain client information and project associations
- **Invoice Generation**: Create and manage client invoices with PDF generation

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Job Descriptions**: Define roles and responsibilities
- **Public Holidays**: Configure company-wide holiday schedules
- **Loan Management**: Track employee loans and repayments
- **Finance Overview**: Comprehensive financial reporting and analytics

### User Experience
- **Role-Based Access Control**: Granular permissions based on user roles
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Notifications**: Instant updates and alerts
- **Dark/Light Theme Support**: Customizable user interface

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: ShadCN UI components with Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database with real-time capabilities)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: Tiptap editor
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Prerequisites

- Node.js 18+
- npm or yarn or bun
- Supabase account and project

## Installation

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
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory to set up your database schema.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Authentication & Authorization

The application uses Supabase Auth for user authentication. Upon first login, users are required to change their temporary password. Role-based access control ensures users can only access features appropriate to their permissions.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.