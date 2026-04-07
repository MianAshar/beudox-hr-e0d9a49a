<!--
generated_by: tessera
source_sha: d4441c5f44692ecc6e3310ebe3bcbd68681eafc3
generated_at: 2026-04-07T11:10:38.964Z
action: update
-->

# Beudox HR Management System

Beudox HR is a comprehensive human resources management application designed to streamline HR operations for companies. It provides tools for employee management, attendance tracking, payroll processing, leave management, and more.

## Features

### Core Modules

- **Dashboard**: Overview of key HR metrics and activities
- **Employee Management**: Add, edit, and manage employee information
- **Attendance Tracking**: Monitor employee attendance and working hours
- **Leave Management**: Handle vacation requests and approvals
- **Payroll Processing**: Calculate and manage employee salaries
- **Finance Management**: Track invoices, expenses, loans, and financial reports
- **Project Management**: Manage projects, clients, and evaluations
- **HR Policies**: Create and maintain company policies with rich text editing
- **Notifications**: System-wide notification management
- **Settings**: Configure company settings, departments, roles, and more

### User Roles & Access Control

The application supports role-based access control with different permission levels for various user types (admin, manager, employee, etc.).

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router
- **Rich Text Editing**: Tiptap editor
- **Backend**: Supabase (PostgreSQL database + real-time features)
- **Icons**: Lucide React
- **State Management**: React hooks and context
- **Testing**: Vitest + Playwright for E2E testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- Supabase account and project

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

3. Configure environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
   VITE_SUPABASE_URL="your-supabase-url"
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase for backend services. Database migrations are included in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

### Testing

Run unit tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   ├── settings/       # Settings-related components
│   └── hr-policies/    # HR policies components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Key Components

- **AppLayout**: Main application layout with sidebar and content area
- **AppSidebar**: Collapsible navigation sidebar with role-based menu items
- **RichTextEditor**: WYSIWYG editor for creating HR policies
- **BeudoxLogo**: Logo component with multiple variants
- **NavLink**: Enhanced navigation link component

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software owned by Beudox.