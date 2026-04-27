<!--
generated_by: tessera
source_sha: 557a51a9f15d2dae00b56c3b7d1c433de7ae6e3a
generated_at: 2026-04-27T12:53:11.020Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern React frontend application. Beudox HR streamlines HR operations including employee management, attendance tracking, leave management, payroll processing, and organizational settings.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance import from biometric systems, real-time tracking, and overtime calculations
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll generation with overtime calculations and salary history
- **Performance Reviews**: Employee evaluations, salary reviews, and increment proposals

### Administrative Features
- **Company Settings**: Configure departments, roles, leave types, expense categories, and evaluation parameters
- **User Management**: Role-based access control with granular permissions
- **Project Management**: Team assignments and project activity tracking
- **Finance Integration**: Invoice generation and financial summaries

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **State Management**: React Query for server state, custom hooks for local state
- **Routing**: React Router
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Modern web standards, optimized for performance

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
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   # or
   bun run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── layout/         # App layout components
│   └── ...
├── pages/              # Page components (routes)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Key Components

### Layout Components
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Navigation sidebar with role-based menu items
- **TopBar**: Header with notifications and user menu
- **BeudoxLogo**: Brand logo component with variant support

### Feature Components
- **AttendanceUploadFlow**: Complex workflow for importing attendance data from Excel files
- **SearchableEmployeeSelect**: Employee selection component with search functionality
- **NavLink**: Enhanced navigation link with active state styling

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Run ESLint

### Code Quality

The project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting (via ESLint)
- **Vitest** for unit testing
- **Playwright** for E2E testing

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.