<!--
generated_by: tessera
source_sha: 1d5e0dfda21b7bc05d820d1da31b13fc4b2ba0bf
generated_at: 2026-04-30T00:29:39.200Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React application. This portal provides a complete suite of HR tools for managing employees, attendance, payroll, leave, evaluations, projects, and more.

## Features

- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Attendance Tracking**: Automated attendance import from biometric systems with AI parsing
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Leave Management**: Comprehensive leave request and approval system
- **Performance Evaluations**: Structured evaluation processes and review cycles
- **Project Management**: Project tracking, task assignment, and resource allocation
- **Finance & Invoicing**: Invoice generation, expense tracking, and financial reporting
- **HR Policies**: Digital policy management and compliance tracking
- **Role-Based Access Control**: Granular permissions and security

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text**: Tiptap for policy editing
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright

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
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-specific components
│   ├── employee-profile/ # Employee profile tabs
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex attendance import workflow with AI parsing
- **MandatoryPasswordChange**: Secure password reset modal
- **SearchableEmployeeSelect**: Employee selection component with search
- **RichTextEditor**: WYSIWYG editor for HR policies

## Authentication & Security

The application uses Supabase Auth for authentication with:
- Email/password login
- Role-based access control
- Mandatory password changes for new users
- Session management and route protection

## Database Schema

The application relies on a PostgreSQL database managed through Supabase with tables for:
- Employees and user management
- Attendance records
- Payroll data
- Leave requests
- Projects and tasks
- Evaluations and reviews
- Company settings and policies

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all linting passes

## License

This project is proprietary software for Beudox HR systems.