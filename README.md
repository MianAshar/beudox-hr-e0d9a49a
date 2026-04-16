<!--
generated_by: tessera
source_sha: 939657ec2ede9cca1a4aad08f88592834464cc25
generated_at: 2026-04-16T12:21:14.215Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. This application provides a complete suite of HR tools for managing employees, projects, evaluations, leave, payroll, and more.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Leave Management**: Request, approve, and track employee leave with balance calculations
- **Performance Evaluations**: Quarterly and daily evaluations with rating systems
- **Payroll Management**: Automated payroll processing and payslip generation
- **HR Policies**: Rich text policy documents with full editing capabilities

### Project & Client Management
- **Project Tracking**: Create and manage projects with team assignments
- **Client Management**: Maintain client relationships and project associations
- **Invoice Generation**: Automated invoice creation and PDF generation

### Administrative Tools
- **Role-Based Access Control**: Granular permissions for different user roles
- **Settings Management**: Configure company settings, departments, leave types, etc.
- **Finance Dashboard**: Financial overview and reporting
- **Loan Management**: Employee loan tracking and management

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching

### UI & Styling
- **ShadCN/UI** - Modern component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization components

### Backend & Database
- **Supabase** - Backend-as-a-Service providing:
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - File storage
  - Edge functions

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing
- **TypeScript** - Type checking

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager

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
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
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
│   ├── ui/             # ShadCN base components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── ...
```

## Key Components

### Layout Components
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Navigation sidebar with role-based menu items
- **TopBar**: Top navigation bar with notifications and user menu

### Feature Components
- **EvaluationTimeline**: Displays chronological evaluation history
- **SearchableEmployeeSelect**: Employee selection with search functionality
- **RichTextEditor**: WYSIWYG editor for policy documents
- **BeudoxLogo**: Application logo component with variants

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **Authentication**: Email/password with invite system
- **Roles**: CEO, HR Manager, Team Lead, Employee
- **Permissions**: Route-level and feature-level access control

## Database Schema

The application uses a PostgreSQL database with the following main entities:
- **employees** - Employee profiles and information
- **evaluations** - Performance evaluation records
- **daily_evaluations** - Daily feedback records
- **leave_requests** - Leave management
- **projects** - Project management
- **invoices** - Invoice and billing
- **hr_policies** - Company policies
- **payroll** - Payroll processing

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Testing

The application includes both unit tests (Vitest) and end-to-end tests (Playwright).

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software. All rights reserved.