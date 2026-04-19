<!--
generated_by: tessera
source_sha: ec61f787a9e7e73226c0feb8636d88bb33c1aa7b
generated_at: 2026-04-19T14:45:43.535Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track performance, handle payroll, manage leave requests, and oversee financial operations.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with search and filtering capabilities
- **Performance Evaluations**: Bi-annual evaluations and daily feedback system
- **Leave Management**: Request, approve, and track leave balances
- **Payroll Processing**: Automated payroll calculations with overtime and bonuses
- **Financial Tracking**: Expense management and financial summaries with trend analysis

### Administrative Tools
- **Organization Settings**: Configure departments, roles, and company policies
- **Project Management**: Track projects and assign tasks to team members
- **Notifications System**: Automated notifications for HR events and approvals
- **Rich Text Policies**: Create and manage company policies with rich text editing

### User Experience
- **Role-Based Access**: Different permissions for employees, managers, and HR administrators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live data synchronization across the application

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Charts**: Recharts for data visualization
- **Rich Text**: TipTap editor for policy documents
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the database migrations located in `supabase/migrations/` in your Supabase SQL editor

4. **Configure environment variables**
   
   Copy `.env` and update with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

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
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── ...

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase configuration
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## License

This project is private and proprietary to Beudox.