<!--
generated_by: tessera
source_sha: 387391b56870e1f87a0608cfe39642ec2a98d0ba
generated_at: 2026-04-21T11:07:06.080Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR provides organizations with tools to manage employees, track attendance, handle payroll, manage projects, and streamline HR operations.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and offboarding
- **Attendance Tracking**: Real-time attendance monitoring with check-in/check-out functionality
- **Leave Management**: Comprehensive leave request and approval system
- **Payroll Processing**: Automated payroll generation with overtime calculations

### Project & Client Management
- **Project Management**: Create and manage projects with team assignments
- **Client Relations**: Maintain client information and project associations
- **Task Tracking**: Assign and monitor project tasks

### Financial Management
- **Invoice Generation**: Create and send professional invoices
- **Finance Dashboard**: Overview of financial metrics and summaries
- **Expense Tracking**: Manage expense categories and approvals

### Performance & Development
- **Employee Evaluations**: Regular performance reviews and feedback
- **Daily Evaluations**: Quick daily check-ins and progress tracking
- **Review Scheduling**: Automated review cycle management

### Administrative Tools
- **HR Policies**: Create and manage company policies
- **Job Descriptions**: Maintain detailed job role definitions
- **Settings Management**: Configure company settings, departments, roles, and more

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives

### Backend & Database
- **Supabase** - Backend-as-a-Service providing:
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - File storage
  - Edge functions

### State Management & Data Fetching
- **TanStack Query** - Powerful data synchronization for React
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Additional Libraries
- **date-fns** - Modern JavaScript date utility library
- **Recharts** - Composable charting library
- **TipTap** - Rich text editor
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager

### Installation

1. Clone the repository:
```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
```

2. Install dependencies:
```bash
   npm install
   # or
   bun install
```

3. Set up environment variables:
   - Copy `.env` and configure your Supabase credentials
   - Ensure you have the correct Supabase project URL and API keys

4. Start the development server:
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
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/  # Employee-specific components
│   ├── finance/        # Financial components
│   ├── evaluations/    # Evaluation components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **Authentication**: Email/password and invite-based registration
- **Authorization**: Route-level and component-level permission checks
- **Roles**: Configurable roles with specific permissions

## Database Schema

The application uses PostgreSQL with the following main entities:
- Employees and user accounts
- Attendance records
- Leave requests and balances
- Payroll data
- Projects and tasks
- Clients and invoices
- Evaluations and reviews
- HR policies and settings

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

### Code Quality

- ESLint for code linting
- TypeScript for type checking
- Prettier for code formatting (via ESLint)

## Deployment

The application is designed to be deployed as a static site to any modern hosting platform that supports SPAs:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Supabase Hosting

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