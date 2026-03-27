<!--
generated_by: tessera
source_sha: e1711f0f1ddc744b527fc6ce31797ff645acf0c1
generated_at: 2026-03-27T03:06:58.056Z
action: update
-->

# Beudox HR

A modern, comprehensive Human Resources Management System built with React, TypeScript, and Supabase.

## Overview

Beudox HR is a web-based application designed to streamline HR operations for organizations. It provides a centralized platform for managing employees, attendance, payroll, leave management, and other HR-related functions.

This application is currently in its foundation phase (Sprint A0), featuring:
- User authentication and authorization
- Responsive dashboard
- Modular navigation structure
- Modern UI design system

## Features

### Current Features (Sprint A0)
- **Authentication**: Secure login with email/password, forgot password, and password reset
- **Dashboard**: Welcome screen with user information
- **App Shell**: Collapsible sidebar navigation and top bar with page titles
- **Design System**: Consistent UI components using shadcn/ui and custom Beudox branding

### Planned Features
- Employee management
- Attendance tracking
- Payroll processing
- Leave management
- Public holidays management
- Financial reporting
- Project management
- Evaluations
- HR policies
- Notifications
- System settings

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design tokens
- **Backend**: Supabase (PostgreSQL database + Auth)
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
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
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application requires specific database tables and Row Level Security (RLS) policies. Refer to the `.lovable/plan.md` file for the complete database schema and RLS setup requirements.

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # App layout components
│   │   ├── AppLayout.tsx
│   │   ├── AppSidebar.tsx
│   │   └── TopBar.tsx
│   ├── ui/              # shadcn/ui components
│   └── BeudoxLogo.tsx   # Logo component
├── hooks/
│   └── useAuth.tsx      # Authentication hook
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   └── NotFound.tsx
├── integrations/
│   └── supabase/         # Supabase client and types
├── lib/
│   └── utils.ts         # Utility functions
└── App.tsx              # Main app component
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Contributing

1. Follow the existing code style and architecture patterns
2. Use TypeScript for all new code
3. Implement proper error handling and loading states
4. Add tests for new features
5. Update documentation as needed

## License

This project is private and proprietary.