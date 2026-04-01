<!--
generated_by: tessera
source_sha: a15d5b2711d130e083ecc68f33f6a4aff150e0ec
generated_at: 2026-04-01T10:21:10.741Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete HR solution for managing employees, projects, clients, attendance, payroll, and more.

## Features

### Core HR Functionality
- **Employee Management**: Add, edit, and view employee profiles with role-based access control
- **Attendance Tracking**: Monitor employee attendance and public holidays
- **Leave Management**: Handle employee leave requests and approvals
- **Payroll Processing**: Manage salary calculations and financial records
- **Project Management**: Create and track projects with client associations
- **Client Management**: Maintain client relationships and project assignments
- **Finance & Expenses**: Track office expenses and financial sheets
- **HR Policies**: Store and manage company policies
- **Notifications**: System-wide notification management
- **Settings**: Configure application preferences

### Technical Features
- **Role-Based Access Control**: Different permission levels for various user roles
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Data**: Powered by Supabase for real-time database operations
- **Modern UI**: Built with shadcn/ui components for consistent design
- **Type-Safe**: Full TypeScript implementation for reliability

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **State Management**: React Query for server state, custom hooks for local state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- A Supabase project (for backend services)

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

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

### Run E2E Tests

```bash
npx playwright install
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── pages/              # Page components for routing
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
├── test/               # Test files
└── ...
```

## Authentication & Authorization

The application uses Supabase Authentication for user management. Role-based access control is implemented through:

- **Authentication**: Email/password login with password reset functionality
- **Authorization**: Role-based permissions checked on route access
- **Session Management**: Automatic session handling with protected routes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.