<!--
generated_by: tessera
source_sha: 942ac75d0a0aa3497bc07e272fa632f05056e732
generated_at: 2026-04-07T11:54:22.799Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, project tracking, invoicing, and HR policy administration for organizations.

## Features

### Core HR Functionality
- **Employee Management**: Complete CRUD operations for employee records, profiles, and organizational structure
- **Role-Based Access Control**: Hierarchical permissions system (CEO, HR Manager, Team Lead, Employee)
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback and recommendations
- **HR Policies**: Rich text policy documents with full formatting capabilities

### Business Operations
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoicing System**: Generate and manage invoices with PDF export functionality
- **Loan Management**: Track employee loans and repayment schedules

### Administrative Features
- **Company Settings**: Configure company information, departments, and roles
- **Attendance Tracking**: Monitor and manage employee attendance
- **Public Holidays**: Manage company-wide holiday schedules
- **Settings Dashboard**: Centralized configuration for all system parameters

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library built on Radix UI primitives

### Backend & Data
- **Supabase** for authentication, database, and serverless functions
- **PostgreSQL** database with real-time capabilities
- **TanStack Query** for efficient data fetching and caching

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **React Hook Form** with **Zod** validation for form handling

### Rich Content
- **Tiptap** rich text editor for policy documents
- **React Image Crop** for avatar management
- **Recharts** for data visualization

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

3. **Environment Configuration**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings-specific components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for PDF generation, emails, etc.
```

## Authentication & Authorization

The system implements role-based access control with the following roles:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Limited access to personal data and basic features

Authentication is handled through Supabase Auth with email/password and invite-based registration.

## API Integration

The frontend communicates with Supabase through:
- **REST API** for CRUD operations
- **Real-time subscriptions** for live updates
- **Edge Functions** for PDF generation and email sending

## Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npx playwright test
```

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.