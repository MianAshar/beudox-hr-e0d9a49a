<!--
generated_by: tessera
source_sha: 2371286576e780a886fa9a7f8eccbe67e207892e
generated_at: 2026-04-13T11:05:20.954Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll, evaluations, leave tracking, and organizational workflows for businesses.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Authentication & Security**: Secure login with Supabase authentication

### Employee Lifecycle
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback
- **Leave Management**: Comprehensive leave tracking, balances, and approval workflows
- **Payroll Processing**: Automated payroll generation with payslips and financial reporting

### Business Operations
- **Project Management**: Project tracking, client management, and resource allocation
- **Invoice Management**: Client invoicing, payment tracking, and financial documentation
- **HR Policies**: Digital policy management with rich text editing
- **Loan Management**: Employee loan tracking and management

### Administrative Tools
- **Settings Management**: Configurable company settings, departments, roles, and parameters
- **Public Holidays**: Holiday calendar management
- **Finance Dashboard**: Comprehensive financial overview and reporting

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** with custom design system and dark mode support
- **shadcn/ui** component library built on Radix UI primitives

### State Management & Data
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling
- **Supabase** for backend services, database, and real-time features

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing

### Key Libraries
- **TipTap** for rich text editing
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
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
   yarn install
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
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Page components and routing
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── ...

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase project configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## User Roles & Permissions

The system supports role-based access control with the following roles:

- **CEO**: Full system access
- **HR Manager**: HR operations, employee management, payroll
- **Team Lead**: Team management, evaluations, limited reporting
- **Employee**: Personal dashboard, leave requests, evaluations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.