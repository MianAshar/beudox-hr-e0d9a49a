<!--
generated_by: tessera
source_sha: f1a3d6086340396d2f2a9a07591755d5fdd81480
generated_at: 2026-04-19T14:17:03.200Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, payroll processing, leave management, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Performance Evaluations**: Bi-annual and daily evaluation systems with structured feedback
- **Payroll Management**: Automated payroll processing with overtime calculations and deductions
- **Leave Management**: Comprehensive leave tracking and approval workflows
- **Loan Management**: Employee loan tracking and repayment management

### Organizational Tools
- **Project Management**: Project tracking with task assignments and activity logging
- **Client Management**: Client relationship management with invoice generation
- **HR Policies**: Rich text policy documents with version control
- **Finance Dashboard**: Real-time financial insights with trend analysis
- **Settings Management**: Configurable company settings, roles, and parameters

### User Experience
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Responsive Design**: Mobile-first design that works across all devices
- **Real-time Notifications**: Instant notifications for important HR events
- **Dark/Light Theme**: User preference-based theming

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing with protected routes
- **TanStack Query** - Powerful data fetching and caching

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
- **shadcn/ui** - Beautiful, customizable component library
- **Lucide React** - Consistent icon system
- **Recharts** - Data visualization components

### Forms & Validation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **TipTap** - Rich text editor for policy documents

### Backend & Database
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Supabase Auth** - Secure authentication and authorization
- **Supabase Storage** - File upload and management

### Development & Testing
- **Vitest** - Fast unit testing framework
- **Playwright** - End-to-end testing
- **ESLint** - Code linting and formatting
- **TypeScript** - Type checking

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

6. **Build for Production**
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
│   └── BeudoxLogo.tsx  # Logo component
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── App.tsx             # Main application component
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

### CEO
- Full access to all features
- Can view all employee data and evaluations
- Manage company settings and policies

### HR Manager
- Employee management and evaluations
- Payroll and finance oversight
- HR policy management
- Access to sensitive employee information

### Team Lead
- Manage team members
- Conduct daily evaluations
- View team performance data
- Limited access to HR functions

### Employee
- View personal profile and payslips
- Submit leave requests
- Access assigned tasks and projects
- Limited self-service features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team or create an issue in the repository.