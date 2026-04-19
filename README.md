<!--
generated_by: tessera
source_sha: 91480e783d77e3dd785d35e7e989c5cd4d70abe5
generated_at: 2026-04-19T21:27:05.200Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, projects, payroll, evaluations, leave management, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Profile Management**: Detailed employee profiles with personal information, skills, and history

### Performance & Evaluation
- **Quarterly Evaluations**: Bi-annual performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations for each employee

### Project Management
- **Project Tracking**: Create and manage projects with team assignments
- **Client Management**: Maintain client relationships and project associations
- **Task Management**: Assign and track tasks within projects

### Financial Management
- **Payroll Processing**: Automated payroll calculations with overtime and bonuses
- **Invoice Management**: Generate and manage client invoices
- **Finance Dashboard**: Real-time financial insights with trend analysis
- **Loan Management**: Track employee loans and deductions

### Leave & Attendance
- **Leave Management**: Request, approve, and track various types of leave
- **Public Holidays**: Configure and manage company holidays
- **Attendance Tracking**: Monitor employee attendance patterns

### Policy & Documentation
- **HR Policies**: Create and maintain company policies with rich text editing
- **Document Management**: Store and organize important HR documents

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **shadcn/ui** - Beautiful, customizable components
- **Lucide React** - Modern icon library
- **Recharts** - Composable charting library

### Data Management
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **TanStack Query** - Powerful data synchronization for React
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Rich Text Editing
- **Tiptap** - Extensible rich text editor for React

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **TypeScript** - Type checking

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager

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
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. **Database Setup**
   
   The application uses Supabase as its backend. You'll need to:
   - Create a Supabase project
   - Run the database migrations located in `supabase/migrations/`
   - Configure authentication and storage settings

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components
│   ├── [feature]/      # Feature-specific components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full access to all features
- **HR Manager**: Access to HR functions, employee management, payroll
- **Team Lead**: Limited access to team management and evaluations
- **Employee**: Access to personal profile, leave requests, and assigned tasks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is private and proprietary.