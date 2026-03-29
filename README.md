<!--
generated_by: tessera
source_sha: ddd6752e4206c216e957e09318d2825ecd871405
generated_at: 2026-03-29T22:44:51.821Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete HR solution for managing employees, attendance, payroll, leave, and organizational operations.

## Features

### Core HR Functionality
- **Employee Management**: Add, view, edit, and manage employee profiles
- **Attendance Tracking**: Monitor employee attendance and time records
- **Leave Management**: Handle vacation, sick leave, and other time-off requests
- **Payroll Processing**: Manage salary calculations and payroll operations
- **Finance Management**: Track loans, office expenses, and financial data

### Additional Modules
- **Project Management**: Organize and track company projects
- **Performance Evaluations**: Conduct employee assessments
- **HR Policies**: Maintain and distribute company policies
- **Notifications System**: Keep employees informed
- **Settings Management**: Configure system preferences

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Backend**: Supabase (PostgreSQL database)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or bun package manager
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
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # App layout components
│   │   ├── AppLayout.tsx
│   │   ├── AppSidebar.tsx
│   │   └── TopBar.tsx
│   ├── BeudoxLogo.tsx
│   └── NavLink.tsx
├── pages/            # Route components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── integrations/     # External service integrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Authentication

The application uses Supabase Authentication with the following features:
- Email/password login
- Password reset functionality
- Protected routes
- Session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.