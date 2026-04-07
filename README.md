<!--
generated_by: tessera
source_sha: 1cec2ce393d8f182112788746e7935917c082ccd
generated_at: 2026-04-07T21:17:04.205Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, projects, evaluations, payroll, and more through an intuitive web interface.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Payroll Management**: Automated payroll processing, payslip generation, and salary management
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices with PDF export
- **Loan Management**: Track employee loans and repayment schedules
- **HR Policies**: Create and manage company policies with rich text formatting
- **Attendance Tracking**: Monitor employee attendance and working hours
- **Public Holidays**: Configure and manage company holiday schedules

### User Roles & Access Control
- **CEO**: Full system access
- **HR Manager**: Employee management, evaluations, policies, settings
- **Finance Manager**: Payroll, invoices, financial reporting
- **Team Lead**: Project management, team evaluations
- **Employee**: Personal dashboard, evaluations, payslips

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **React Query** for server state management and caching
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom design system
- **Tiptap** rich text editor for policy documents
- **Recharts** for data visualization
- **React Hook Form** with Zod validation for forms

### Backend & Infrastructure
- **Supabase** for database, authentication, and edge functions
- **PostgreSQL** database with real-time capabilities
- **Row Level Security (RLS)** for data access control

### Development & Testing
- **ESLint** and **TypeScript** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **Tailwind CSS** with custom configuration

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
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
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
│   ├── settings/       # Settings page components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for business logic
└── config.toml         # Supabase project configuration
```

## Key Components

### Authentication Flow
- Login with email/password
- Password reset and invitation system
- Role-based route protection
- Automatic redirects based on authentication state

### Data Management
- React Query for server state caching
- Optimistic updates for better UX
- Real-time subscriptions for live data

### Form Handling
- React Hook Form for performance
- Zod schemas for validation
- Consistent error handling and display

### UI Components
- Accessible components built on Radix UI
- Consistent design system with Tailwind CSS
- Dark/light theme support
- Responsive design for all screen sizes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for React and TypeScript
- Prettier for consistent code formatting
- Husky pre-commit hooks (if configured)

### Testing
- Vitest for fast unit testing
- React Testing Library for component testing
- Playwright for end-to-end testing
- Test coverage reporting

## Deployment

The application is designed to be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist/` directory to your hosting provider
3. Configure environment variables in your hosting platform

### Environment Variables

Required environment variables for production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.