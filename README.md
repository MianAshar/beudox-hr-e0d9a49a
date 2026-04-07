<!--
generated_by: tessera
source_sha: 8e11b5d7fe7d65cb4672bc4879a4a7d4c01dc9e0
generated_at: 2026-04-07T22:34:23.180Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies, designed to streamline HR operations for small to medium-sized businesses.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Payroll Management**: Automated payroll processing with payslip generation
- **HR Policies**: Rich text policy documents with version control
- **Project Management**: Project tracking with client and invoice integration

### Financial Management
- **Invoice Management**: Client invoicing with PDF generation
- **Loan Management**: Employee loan tracking and management
- **Finance Dashboard**: Comprehensive financial reporting and analytics

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Settings Management**: Configurable company settings, departments, roles, and evaluation parameters
- **Public Holidays**: Holiday calendar management

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router DOM** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** component library built on Radix UI primitives

### State Management & Data
- **TanStack Query (React Query)** for server state management and caching
- **React Hook Form** with Zod validation for robust form handling
- **Supabase** for backend services (database, authentication, storage)

### Rich Content & UI
- **TipTap** rich text editor for HR policies
- **Recharts** for data visualization
- **Lucide React** for consistent iconography
- **Date-fns** for date manipulation

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** with TypeScript rules for code quality

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
   
   The project includes Supabase migrations. Run them in your Supabase project:
   ```bash
   # The migrations are located in supabase/migrations/
   # Apply them through the Supabase dashboard or CLI
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components (sidebar, topbar)
│   ├── evaluations/    # Evaluation-specific components
│   ├── hr-policies/    # Policy management components
│   └── settings/       # Settings page components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── test/               # Test files
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Limited access to personal data and basic features

## API Integration

The frontend communicates with Supabase which provides:
- PostgreSQL database with Row Level Security
- Authentication and user management
- File storage for documents and images
- Edge Functions for business logic (payroll generation, email sending)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses ESLint with TypeScript rules and follows React best practices. All components are built with TypeScript for better developer experience and runtime safety.

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all linting passes

## License

This project is proprietary software. All rights reserved.