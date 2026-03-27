<!--
generated_by: tessera
source_sha: a12f4af3a3b61abfdd6ba2a6eb203bab1d084315
generated_at: 2026-03-27T22:17:04.938Z
action: update
-->

# Beudox HR Management System

A modern, responsive HR management application built with React, TypeScript, and Supabase. This frontend application provides a comprehensive dashboard for managing employees, attendance, payroll, and other HR functions.

## Features

- **Employee Management**: Manage employee profiles and information
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation and leave requests
- **Payroll Processing**: Manage salary calculations and payments
- **Finance Management**: Track expenses, loans, and financial reports
- **Project Management**: Oversee projects and evaluations
- **HR Policies**: Maintain and distribute company policies
- **Notifications**: In-app notification system
- **Settings**: System configuration and user preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI (shadcn/ui)
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

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
   
   Copy `.env` and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/              # Reusable UI components (shadcn/ui)
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations (Supabase)
├── lib/                 # Utility functions
├── pages/               # Page components
└── types/               # TypeScript type definitions
```

## Authentication

The application uses Supabase for authentication. Users can log in, reset passwords, and manage their accounts through the auth system.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is private and proprietary.