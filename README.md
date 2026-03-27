<!--
generated_by: tessera
source_sha: 83e8bca997401ed0d8b90bee0a76544dc0ed2bd8
generated_at: 2026-03-27T23:53:29.765Z
action: update
-->

# Beudox HR Management System

A modern, comprehensive Human Resources management application built with React, TypeScript, and Supabase. This frontend application provides a complete HR solution for managing employees, attendance, payroll, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and personnel records
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests, sick leave, and time-off policies
- **Payroll Processing**: Manage salary calculations, deductions, and payroll runs
- **Finance Management**: Track expenses, loans, and financial reporting
- **Project Management**: Oversee organizational projects and resource allocation
- **Performance Evaluations**: Conduct employee evaluations and reviews
- **HR Policies**: Maintain and distribute company policies and procedures

### System Features
- **Authentication**: Secure login with Supabase authentication
- **Responsive Design**: Mobile-first design with collapsible sidebar navigation
- **Real-time Notifications**: System-wide notification management
- **Settings Management**: Configurable system preferences

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with ShadCN UI components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

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
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/              # Reusable UI components (ShadCN)
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations (Supabase)
├── lib/                 # Utility functions
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Authentication

The application uses Supabase for authentication with support for:
- Email/password login
- Password reset and recovery
- Employee invitation system
- Session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.