<!--
generated_by: tessera
source_sha: e40134e5ce03f627183bc9715d4779879adb272c
generated_at: 2026-04-17T23:37:05.870Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance tracking, payroll processing, and organizational workflows for businesses of all sizes.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and offboarding
- **Performance Evaluations**: Quarterly performance reviews and daily feedback system
- **Leave Management**: Automated leave request and approval workflows
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **HR Policies**: Rich text policy documents with version control

### Business Operations
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices with PDF export
- **Finance Tracking**: Comprehensive financial reporting and expense management
- **Loan Management**: Employee loan tracking and repayment schedules

### Administrative Tools
- **Role-Based Access Control**: Granular permissions system (CEO, HR Manager, Team Lead, Employee)
- **Company Settings**: Configure departments, roles, leave types, and evaluation parameters
- **Notifications**: Automated email notifications for important events
- **Public Holidays**: Configurable holiday calendar management

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library built on Radix UI primitives
- **React Router** for client-side routing
- **React Query** for efficient server state management
- **React Hook Form + Zod** for form validation
- **Tiptap** for rich text editing
- **Recharts** for data visualization

### Backend & Infrastructure
- **Supabase** (PostgreSQL database, authentication, real-time subscriptions, storage)
- **Supabase Edge Functions** for serverless compute (payroll generation, PDF creation, email sending)
- **Row Level Security (RLS)** for data access control

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint + TypeScript** for code quality
- **Prettier** for code formatting

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
   
   The application uses Supabase migrations. Run them in your Supabase project:
   ```bash
   cd supabase
   supabase db push
   ```

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
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (sidebar, topbar)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for serverless compute
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application uses Supabase Auth with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

## API Architecture

### Database Schema
The system uses a normalized PostgreSQL schema with tables for:
- Users and authentication
- Employee profiles and organizational structure
- Projects, clients, and invoices
- Evaluations, leave requests, and payroll
- HR policies and company settings

### Serverless Functions
Supabase Edge Functions handle complex operations:
- Payroll calculation and PDF generation
- Invoice creation and email delivery
- Employee notifications
- Data export and reporting

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky pre-commit hooks (if configured)

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Configure environment variables in your hosting platform

### Recommended Deployment Platforms
- Vercel
- Netlify
- AWS S3 + CloudFront
- Supabase Hosting (for full-stack deployment)

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

For support and questions, please contact the development team.