<!--
generated_by: tessera
source_sha: 08845689e8303a1a7a9c6f45cc15f5b45ad07232
generated_at: 2026-04-27T10:44:47.902Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track attendance, handle payroll, manage projects, and streamline HR operations.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and role assignments
- **Attendance Tracking**: Automated attendance monitoring with check-in/out, overtime calculation, and reporting
- **Leave Management**: Comprehensive leave request and approval system with balance tracking
- **Payroll Processing**: Automated payroll generation with salary calculations and payslip management

### Project & Client Management
- **Project Management**: Create and manage projects with team assignments and task tracking
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices with PDF export

### Performance & Development
- **Employee Evaluations**: Performance reviews and salary increment proposals
- **Daily Evaluations**: Ongoing feedback and performance tracking
- **HR Policies**: Document and manage company policies with rich text editing
- **Job Descriptions**: Create and maintain detailed job descriptions

### Administrative Features
- **Finance Dashboard**: Financial overview and expense tracking
- **Loan Management**: Employee loan processing and tracking
- **Settings Management**: Configure company settings, departments, roles, and system parameters
- **Public Holidays**: Manage company holiday schedules

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: TanStack Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text**: Tiptap
- **Testing**: Vitest with Playwright for E2E

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

3. Configure environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

### Database Setup

The application uses Supabase as its backend. Database migrations are included in the `supabase/migrations/` directory. To set up the database:

1. Create a new Supabase project
2. Run the migrations in order
3. Configure authentication settings
4. Set up storage buckets if needed

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses:
- ESLint for code linting
- TypeScript for type checking
- Vitest for unit testing
- Playwright for end-to-end testing

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is private and proprietary to Beudox.