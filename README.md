<!--
generated_by: tessera
source_sha: 6ece2b095b24768cb19717bed5bd748ec1e0597c
generated_at: 2026-03-27T23:48:30.608Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete HR suite including employee management, attendance tracking, payroll processing, leave management, and more.

## Features

### Core HR Modules
- **Employee Management**: Add, edit, and manage employee profiles
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests and leave policies
- **Payroll Processing**: Manage salaries, bonuses, and payroll calculations
- **Finance Management**: Track expenses, loans, and financial reports
- **Project Management**: Oversee projects and employee assignments
- **Performance Evaluations**: Conduct and track employee evaluations
- **HR Policies**: Maintain and distribute company policies

### System Features
- **Notifications**: Real-time notifications for important updates
- **Settings**: Configurable system preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or bun package manager

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
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

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
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ...              # Feature-specific components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── integrations/        # External service integrations (Supabase)
└── ...
```

## Architecture

### Frontend Architecture
- **Component Structure**: Modular component architecture with clear separation of concerns
- **Routing**: Client-side routing with React Router
- **State Management**: Server state managed with TanStack Query, local state with React hooks
- **Form Handling**: Declarative forms with React Hook Form and Zod validation
- **UI Design System**: Consistent design system using shadcn/ui components

### Backend Integration
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth for user management
- **Real-time**: Supabase real-time subscriptions for live updates
- **API**: RESTful API endpoints through Supabase client

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the test suite: `npm run test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## License

This project is private and proprietary.