<!--
generated_by: tessera
source_sha: 69dfe220c232280439037af17c6798983ee6a6b4
generated_at: 2026-04-23T21:30:52.983Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with powerful tools to manage employees, track attendance, handle payroll, manage projects, and streamline HR operations.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Attendance Tracking**: Automated attendance monitoring with check-in/out times, overtime calculation, and reporting
- **Leave Management**: Comprehensive leave request and approval system with multiple leave types and balances
- **Payroll Processing**: Automated payroll generation with salary calculations, deductions, and payslip generation

### Performance & Development
- **Employee Evaluations**: Structured performance reviews with customizable evaluation parameters
- **Daily Evaluations**: Quick daily feedback and performance tracking
- **Salary Reviews**: Automated salary increment proposals and review scheduling

### Project Management
- **Project Tracking**: Project lifecycle management with team assignments and progress tracking
- **Client Management**: Client relationship management with project associations
- **Task Management**: Individual and team task assignment and tracking

### Administrative Tools
- **HR Policies**: Digital policy management with rich text editing
- **Job Descriptions**: Structured job description creation and management
- **Settings Management**: Comprehensive system configuration including departments, roles, and company settings
- **Finance Integration**: Invoice generation and financial reporting

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast development
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React Query for server state
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text**: Tiptap editor
- **Testing**: Vitest + Playwright

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
   
   Copy the environment file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
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
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components
│   ├── employee-profile/  # Employee profile tabs
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application uses Supabase Auth for user authentication with role-based access control. Users can have multiple roles that determine their access to different features and pages.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint)
- **Testing**: Unit tests with Vitest, E2E tests with Playwright

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.