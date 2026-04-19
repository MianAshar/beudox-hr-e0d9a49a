<!--
generated_by: tessera
source_sha: 080b12ca14473ee3c4be3b0d80a30d901b653bff
generated_at: 2026-04-19T13:09:47.785Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies, designed to streamline HR operations for organizations.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and offboarding
- **Leave Management**: Automated leave request processing, balance tracking, and approval workflows
- **Payroll Processing**: Automated payroll calculations with overtime, bonuses, and deductions
- **Performance Evaluations**: Bi-annual and daily evaluation systems with customizable parameters
- **Project Management**: Project tracking, resource allocation, and activity logging

### Financial Management
- **Invoice Management**: Client invoicing with PDF generation and email delivery
- **Expense Tracking**: Monthly expense monitoring and reporting
- **Financial Analytics**: 6-month trend analysis with interactive charts
- **Loan Management**: Employee loan tracking and repayment management

### Administrative Tools
- **HR Policies**: Rich text policy documents with full editing capabilities
- **Company Settings**: Configurable departments, roles, leave types, and evaluation parameters
- **Notifications**: Automated email notifications for various HR events
- **Public Holidays**: Configurable holiday calendar management

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing with role-based access control
- **Tailwind CSS** with custom design system and dark mode support
- **shadcn/ui** component library built on Radix UI primitives

### Backend & Database
- **Supabase** for authentication, real-time database, and serverless functions
- **PostgreSQL** database with comprehensive schema migrations
- **Row Level Security (RLS)** policies for data access control

### Key Libraries
- **@tanstack/react-query** for efficient server state management
- **React Hook Form** with Zod validation for form handling
- **Recharts** for data visualization
- **TipTap** for rich text editing
- **date-fns** for date manipulation
- **Lucide React** for consistent iconography

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
   
   Update the following variables:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application includes comprehensive database migrations. Run them in your Supabase project:
   ```bash
   # Migrations are located in supabase/migrations/
   # Apply them through Supabase dashboard or CLI
   ```

5. **Development Server**
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
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── ...

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Serverless edge functions
```

## Authentication & Authorization

The application implements role-based access control with the following roles:
- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Limited access to personal data and requests

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests with Playwright
npx playwright test
```

## Development Guidelines

### Code Style
- ESLint configuration for consistent code quality
- Prettier for code formatting
- TypeScript for type safety

### Component Architecture
- Atomic design principles with reusable UI components
- Custom hooks for business logic separation
- Consistent naming conventions

### State Management
- React Query for server state
- React Context for global app state
- Local component state for UI interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.