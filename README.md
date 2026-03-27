<!--
generated_by: tessera
source_sha: 44ea5d093ea1c161971af7870d4ddedbca5e8428
generated_at: 2026-03-27T03:10:36.422Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track attendance, handle payroll, and oversee various HR operations through an intuitive web interface.

## Features

### Core HR Modules
- **Employee Management**: Manage employee profiles, roles, and information
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests, sick leave, and leave policies
- **Payroll Processing**: Calculate and manage employee salaries and compensation
- **Finance Management**: Track expenses, loans, and financial operations
- **Project Management**: Oversee projects and employee assignments
- **Performance Evaluations**: Conduct employee evaluations and reviews
- **HR Policies**: Maintain and distribute company policies

### System Features
- **Authentication**: Secure login with Supabase authentication
- **Notifications**: System-wide notification management
- **Settings**: Configurable system preferences
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database + Auth + Real-time)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or bun package manager

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
   
   Copy the `.env` file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Database Setup**
   
   Run the Supabase migration to set up the database schema:
   ```bash
   # If using Supabase CLI
   supabase db push
   ```
   
   Or apply the migration file manually: `supabase/migrations/20260327024411_dd73d633-87f8-4810-ade7-67a731f7245d.sql`

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (shadcn/ui)
│   ├── layout/       # Layout components (AppLayout, Sidebar, TopBar)
│   └── ...           # Feature-specific components
├── pages/            # Route components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── integrations/     # External service integrations (Supabase)
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
