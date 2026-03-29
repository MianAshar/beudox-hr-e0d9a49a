<!--
generated_by: tessera
source_sha: 1912bab0ad21101787bdfbc9b42a058207c7862c
generated_at: 2026-03-29T23:20:01.840Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete HR dashboard for managing employees, attendance, payroll, and organizational operations.

## Features

### Core Functionality
- **Employee Management**: Add, view, edit, and manage employee profiles
- **Dashboard**: Overview of key HR metrics and activities
- **Authentication**: Secure login with role-based access control
- **Responsive Design**: Optimized for desktop and mobile devices

### Planned Features (Based on Navigation)
- Attendance tracking
- Public holidays management
- Leave management
- Payroll processing
- Financial reporting
- Loan management
- Office expenses tracking
- Outsourcing management
- Project management
- Employee evaluations
- HR policies
- Notifications system
- System settings

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication & Database**: Supabase
- **Icons**: Lucide React
- **Testing**: Vitest with Playwright for E2E

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager

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
   Copy `.env` and update the Supabase configuration with your project credentials.

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Configuration

The application requires the following environment variables (configured in `.env`):

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # App layout components (AppLayout, AppSidebar, TopBar)
│   ├── BeudoxLogo.tsx
│   └── NavLink.tsx
├── pages/            # Route components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configurations
├── integrations/     # External service integrations (Supabase)
└── test/             # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is private and proprietary to Beudox.