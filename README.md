<!--
generated_by: tessera
source_sha: 7ffb1b86e9cd74132ef738aca1165796264a4de4
generated_at: 2026-04-17T15:20:11.501Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application built with modern web technologies. It provides tools for employee management, performance evaluations, leave tracking, attendance monitoring, expense management, and HR policy administration.

## Features

- **Employee Management**: Add, update, and manage employee profiles with roles and permissions
- **Performance Evaluations**: Quarterly and daily evaluations with scoring and feedback
- **Leave Management**: Request, approve, and track leave balances and requests
- **Attendance Tracking**: Monitor employee attendance and working hours
- **Expense Management**: Submit and approve expense claims with categories
- **HR Policies**: Create and manage company policies with rich text editing
- **Notifications**: Automated notifications for HR events and approvals
- **Role-based Access**: Different permissions for employees, team leads, HR managers, and CEOs

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **Authentication**: Supabase Auth
- **Rich Text Editing**: Tiptap
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. Install dependencies:
   ```bash
   npm install
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
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for the backend. The database schema is defined in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Run migrations:
   ```bash
   supabase db reset
   ```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── evaluations/    # Evaluation-related components
│   ├── leave/          # Leave management components
│   ├── settings/       # Settings/configuration components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── migrations/         # Database migrations
└── functions/          # Edge functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## License

This project is proprietary software owned by Beudox.