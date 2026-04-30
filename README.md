<!--
generated_by: tessera
source_sha: 9c111b985ea060cf573e05d196278bcc245cedcc
generated_at: 2026-04-30T11:06:58.788Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System (HRMS) designed for companies to efficiently manage employee data, attendance, payroll, leave requests, evaluations, and more. Built as a modern web application using React and Supabase.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording with check-in/check-out, overtime calculation, and reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll calculations, payslip generation, and salary history
- **Performance Evaluations**: Regular and daily evaluations with customizable parameters

### Project & Client Management
- **Project Management**: Create and manage projects with team assignments and task tracking
- **Client Relations**: Maintain client information and project associations
- **Invoice Management**: Generate and manage invoices for projects

### Administrative Tools
- **HR Policies**: Create and manage company policies with rich text editing
- **Job Descriptions**: Define roles and responsibilities
- **Public Holidays**: Configure company-wide holidays and recurring events
- **Loan Management**: Track employee loans and repayments
- **Finance Overview**: Comprehensive financial reporting and analytics

### User Experience
- **Role-Based Access Control**: Granular permissions based on user roles
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Notifications**: Instant updates for important events
- **Dashboard Analytics**: Visual insights into key HR metrics

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Radix UI** components for accessible, customizable UI elements
- **React Query** for efficient server state management
- **React Hook Form** with Zod validation for robust forms

### Backend & Infrastructure
- **Supabase** for authentication, real-time database, and serverless functions
- **PostgreSQL** database with automatic migrations

### Development Tools
- **ESLint** for code linting
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **TypeScript** for type checking

## Getting Started

### Prerequisites
- Node.js 18+ and npm or bun
- A Supabase account and project

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
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order to set up the database schema.

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` to access the application.

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Serverless edge functions
```

## Authentication & Authorization

The application uses Supabase Auth for user authentication with role-based access control:

- **Authentication**: Email/password with mandatory password changes for new users
- **Authorization**: Route-level protection with role-based permissions
- **Session Management**: Automatic session refresh and secure token handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.