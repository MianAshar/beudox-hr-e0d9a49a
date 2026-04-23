<!--
generated_by: tessera
source_sha: 46101e07edf7db322bf7c596eea3db0981159d6b
generated_at: 2026-04-23T23:09:17.409Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, attendance tracking, payroll processing, leave management, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Attendance Tracking**: Automated attendance recording with check-in/out times, overtime calculation, and reporting
- **Leave Management**: Comprehensive leave request and approval system with multiple leave types
- **Payroll Processing**: Automated payroll generation with salary calculations, deductions, and payslip generation
- **Performance Evaluations**: Employee evaluation system with scheduled reviews and performance tracking

### Project & Finance Management
- **Project Management**: Project creation, team assignment, task tracking, and progress monitoring
- **Client Management**: Client relationship management with project associations
- **Invoice Management**: Invoice creation, tracking, and financial reporting
- **Finance Dashboard**: Comprehensive financial overview with expense tracking and reporting

### Administrative Features
- **HR Policies**: Digital policy management and distribution
- **Job Descriptions**: Structured job description management
- **Settings Management**: Configurable company settings, departments, roles, and system parameters
- **Role-Based Access Control**: Granular permissions system ensuring secure access to features

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **Tailwind CSS** with custom design system for styling
- **shadcn/ui** component library built on Radix UI primitives

### Backend & Infrastructure
- **Supabase** for database, authentication, and serverless functions
- **PostgreSQL** database with real-time capabilities
- **TanStack Query** for efficient data fetching and caching

### Development Tools
- **ESLint** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **TypeScript** for type safety

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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/ # Employee profile specific components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **Authentication**: Email/password with magic link support
- **Authorization**: Role-based permissions system
- **Session Management**: Automatic session handling with refresh tokens

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses ESLint with TypeScript support and follows React best practices. All components are built with accessibility in mind using Radix UI primitives.

### Testing

Unit tests are written with Vitest and React Testing Library. End-to-end tests use Playwright.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.