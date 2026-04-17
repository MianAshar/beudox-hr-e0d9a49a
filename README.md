<!--
generated_by: tessera
source_sha: 271fa0137f3add500b8ec2fb355c333abd9e5202
generated_at: 2026-04-17T15:03:43.134Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. This frontend application provides a complete HR dashboard for managing employees, leave requests, performance evaluations, company settings, and more.

## Features

### Core HR Functionality
- **Employee Management**: Add, invite, deactivate, and manage employee profiles
- **Leave Management**: Request, approve, and track leave balances and requests
- **Performance Evaluations**: 
  - Quarterly evaluations with recommendations
  - Daily peer-to-peer evaluations
  - Evaluation timeline and history
- **Company Settings**: Configure departments, roles, expense categories, and notifications
- **HR Policies**: Create and manage company policies with rich text editing

### User Roles & Permissions
- **CEO**: Full access to all features
- **HR Manager**: Comprehensive HR operations access
- **Team Lead**: Limited management capabilities
- **Employee**: Personal dashboard and basic requests

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **State Management**: TanStack Query for server state
- **Rich Text Editing**: TipTap editor
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase as its backend. Database migrations are included in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-id`
3. Run migrations: `supabase db push`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── leave/          # Leave management components
│   ├── evaluations/    # Evaluation components
│   ├── settings/       # Settings page components
│   └── hr-policies/    # HR policies components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── main.tsx            # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Contributing

1. Follow the existing code style and component patterns
2. Use TypeScript for all new code
3. Add tests for new features
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.