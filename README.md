<!--
generated_by: tessera
source_sha: cba889a6ae30e757b49737301f23468d6d1539b5
generated_at: 2026-04-18T00:50:20.435Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, project tracking, payroll processing, and organizational workflows for businesses.

## 🚀 Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Leave Management**: Track and manage employee leave requests and balances
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **Performance Evaluations**: Quarterly and daily evaluation systems with feedback tracking
- **HR Policies**: Rich text policy documents with version control

### Project & Client Management
- **Project Tracking**: Manage project timelines, assignments, and progress
- **Client Relations**: Maintain client information and project associations
- **Invoice Management**: Generate and track client invoices

### Financial Management
- **Loan Management**: Track employee loans and repayments
- **Finance Sheets**: Comprehensive financial reporting and analysis
- **Expense Tracking**: Categorize and monitor business expenses

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles
- **Settings Management**: Configure company policies, departments, and system parameters
- **Public Holidays**: Manage regional holiday calendars
- **Notifications**: Automated email notifications for key events

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** with Radix UI components (shadcn/ui) for modern UI
- **TanStack Query** for efficient server state management
- **React Hook Form** with Zod validation for robust forms

### Backend & Database
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** database with Row Level Security
- **Supabase Edge Functions** for server-side processing

### Additional Libraries
- **Tiptap** for rich text editing in HR policies
- **Recharts** for data visualization
- **React Day Picker** for date selection
- **Lucide React** for consistent iconography
- **XLSX** for Excel file processing

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** with TypeScript rules for code quality

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project

## 🚀 Getting Started

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
   pnpm install
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

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:8080`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## 🏗 Application Architecture

### Routing Structure
The application uses React Router with protected routes and role-based access control:

- `/login` - Authentication
- `/dashboard` - Main dashboard
- `/employees/*` - Employee management
- `/projects/*` - Project management
- `/clients/*` - Client management
- `/invoices/*` - Invoice management
- `/hr-policies/*` - HR policy documents
- `/evaluations/*` - Performance evaluations
- `/leave` - Leave management
- `/payroll` - Payroll processing
- `/finance` - Financial reports
- `/settings` - System configuration

### Key Components

#### Layout Components
- `AppLayout` - Main application layout with sidebar navigation
- `AppSidebar` - Navigation sidebar with role-based menu items
- `TopBar` - Header with user menu and notifications

#### UI Components
- Comprehensive shadcn/ui component library
- `RichTextEditor` - Tiptap-based rich text editor for policies
- `SearchableEmployeeSelect` - Employee selection with search functionality
- `EvaluationTimeline` - Timeline view of employee evaluations

#### Business Logic
- Role-based access control with `canAccess` utility
- Notification system for automated emails
- Leave balance calculations and validations
- Payroll generation with overtime calculations

## 🔐 Authentication & Authorization

The application uses Supabase Auth with custom role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Limited access to personal data

## 📊 Database Schema

The application uses a PostgreSQL database with the following main entities:

- `employees` - Employee information and profiles
- `companies` - Company/organization data
- `projects` - Project management
- `clients` - Client information
- `invoices` - Invoice tracking
- `evaluations` - Performance evaluations
- `daily_evaluations` - Daily feedback system
- `leave_requests` - Leave management
- `payroll` - Payroll records
- `hr_policies` - Policy documents
- `loans` - Employee loans
- `notifications` - System notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is private and proprietary to Beudox.

## 📞 Support

For support or questions, please contact the development team.