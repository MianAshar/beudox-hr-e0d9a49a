<!--
generated_by: tessera
source_sha: d933cf0a098e282eeff971e97773e24794f4dfd3
generated_at: 2026-04-20T20:01:36.200Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, projects, payroll, evaluations, leave requests, and more through an intuitive web interface.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll calculations with overtime, bonuses, and deductions
- **Performance Evaluations**: Both quarterly formal evaluations and daily feedback systems
- **Loan Management**: Track employee loans and repayments

### Project & Client Management
- **Project Tracking**: Manage project timelines, teams, and progress
- **Client Relations**: Maintain client information and project associations
- **Task Management**: Assign and track tasks within projects

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Job Descriptions**: Maintain detailed job descriptions and requirements
- **Settings Management**: Configure company settings, departments, roles, and more
- **Finance Dashboard**: Monitor payroll and expense trends

### Security & Access
- **Role-Based Access Control**: Different permission levels for employees, managers, and administrators
- **Secure Authentication**: Supabase-powered authentication with email/password and invite flows
- **Data Privacy**: Proper access controls ensure users only see authorized information

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state, React hooks for local state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text**: Tiptap for policy editing
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
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order to set up the database schema.

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` to access the application.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
├── types/              # TypeScript type definitions
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for server-side logic
└── config.toml         # Supabase project configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Beudox.