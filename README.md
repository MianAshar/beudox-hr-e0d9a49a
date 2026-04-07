<!--
generated_by: tessera
source_sha: 5ad27002d46dd144b4404dd6446fd9fca6cca7e0
generated_at: 2026-04-07T20:51:03.221Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, projects, evaluations, payroll, and HR policies in a unified platform.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Payroll Management**: Automated payroll processing with payslip generation
- **HR Policies**: Rich text policy documents with version control
- **Project Management**: Project tracking, client management, and resource allocation
- **Invoice Management**: Client invoicing and financial tracking
- **Loan Management**: Employee loan tracking and management

### User Experience
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live data synchronization using Supabase
- **Intuitive UI**: Modern interface built with Radix UI components

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router DOM** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible, unstyled UI primitives
- **TanStack React Query** for server state management
- **React Hook Form** with Zod validation for forms

### Backend & Infrastructure
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** as the primary database
- **Supabase Edge Functions** for serverless backend logic

### Development Tools
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** for code linting
- **TypeScript** for type checking

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
   
   Copy the environment template:
   ```bash
   cp .env .env.local
   ```
   
   Configure your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
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
│   ├── ui/             # Base UI components (Radix-based)
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal data and limited views

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Beudox.