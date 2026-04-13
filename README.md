<!--
generated_by: tessera
source_sha: 46dfb6ac3a974a552a857eb52d0e4225e2601dd1
generated_at: 2026-04-13T10:27:21.841Z
action: update
-->

# Beudox HR Management System

A comprehensive HR management platform built with modern web technologies, designed to streamline employee management, payroll, evaluations, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and organizational structure
- **Leave Management**: Automated leave request and approval workflows with balance tracking
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **Performance Evaluations**: Quarterly and daily evaluation systems with structured feedback
- **HR Policies**: Centralized policy management with rich text editing

### Business Operations
- **Project Management**: Project tracking with client associations and resource allocation
- **Client Management**: Client relationship management with detailed profiles
- **Invoice Management**: Professional invoice generation and tracking
- **Loan Management**: Employee loan processing and repayment tracking
- **Finance Sheets**: Comprehensive financial reporting and analytics

### Administrative Features
- **Role-Based Access Control**: Granular permissions system (CEO, HR Manager, Team Lead, Employee)
- **Settings Management**: Configurable company settings, departments, roles, and parameters
- **Public Holidays**: Centralized holiday management
- **Notifications**: Automated notification system for important events

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **TanStack Query** for efficient server state management
- **React Hook Form + Zod** for robust form handling and validation

### UI/UX
- **Shadcn UI + Radix UI** for accessible, customizable components
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **Recharts** for data visualization
- **Tiptap** for rich text editing

### Backend & Database
- **Supabase** for backend-as-a-service (authentication, database, storage, edge functions)
- **PostgreSQL** database with real-time capabilities

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
   git clone <repository-url>
   cd beudox-hr
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
│   ├── ui/             # Shadcn UI components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── ...

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application implements role-based access control with the following roles:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal data access and basic operations

Authentication is handled through Supabase Auth with support for email/password and social logins.

## API Integration

The frontend communicates with Supabase through:
- **REST API** for CRUD operations
- **Real-time subscriptions** for live updates
- **Edge Functions** for complex business logic (payroll generation, notifications, etc.)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses ESLint with TypeScript support and follows React best practices. All components are typed with TypeScript for better developer experience and runtime safety.

### Testing

Unit tests are written with Vitest and React Testing Library. E2E tests use Playwright.

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all linting passes

## License

This project is proprietary software. All rights reserved.