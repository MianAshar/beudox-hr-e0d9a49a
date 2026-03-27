<!--
generated_by: tessera
source_sha: cca09339d0c7a9fb1cd417083d37be70b1dab6b4
generated_at: 2026-03-27T21:55:39.873Z
action: update
-->

# Beudox HR Management System

A modern, comprehensive Human Resources management application built with React, TypeScript, and Supabase. This frontend application provides a complete HR dashboard for managing employees, attendance, payroll, finance, projects, and more.

## Features

### Core HR Modules
- **Dashboard**: Overview of key HR metrics and activities
- **Employee Management**: Complete employee lifecycle management
- **Attendance Tracking**: Monitor and manage employee attendance
- **Leave Management**: Handle vacation, sick leave, and other time-off requests
- **Payroll Processing**: Automated payroll calculations and management
- **Finance Management**: Track expenses, loans, and financial reports
- **Project Management**: Oversee HR-related projects and initiatives
- **HR Policies**: Centralized policy documentation and management
- **Notifications**: System-wide notification management
- **Settings**: Application configuration and preferences

### Technical Features
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Real-time Updates**: Live data synchronization via Supabase
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Robust form handling with React Hook Form and Zod

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database, real-time subscriptions, authentication)
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
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
   bun install
   ```

3. Create environment variables:
   Copy `.env` and update the Supabase configuration with your project credentials.

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
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
│   ├── BeudoxLogo.tsx   # Logo component
│   └── NavLink.tsx      # Navigation link wrapper
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── integrations/        # External service integrations (Supabase)
└── main.tsx            # Application entry point
```

## Architecture

### Component Architecture
- **Layout Components**: `AppLayout` provides the main application structure with sidebar and top bar
- **Navigation**: `AppSidebar` contains organized navigation sections (Main, People, Finance, Work, System)
- **UI Components**: Extensive use of shadcn/ui for consistent, accessible components

### State Management
- **Server State**: React Query for API data fetching and caching
- **Local State**: React hooks for component-level state
- **Authentication**: Supabase auth integration

### Routing
- Client-side routing with React Router
- Route-based page titles in the top bar
- Protected routes for authenticated users

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and run tests: `npm run test`
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Submit a pull request

## License

This project is private and proprietary to Beudox.