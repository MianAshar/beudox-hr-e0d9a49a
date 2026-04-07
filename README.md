<!--
generated_by: tessera
source_sha: d4441c5f44692ecc6e3310ebe3bcbd68681eafc3
generated_at: 2026-04-07T11:08:53.254Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built for modern businesses. Beudox HR streamlines employee management, payroll processing, project tracking, and organizational workflows through an intuitive web interface.

## Features

### People Management
- **Employee Directory**: Complete employee profiles with personal and professional information
- **Attendance Tracking**: Monitor employee attendance and work hours
- **Leave Management**: Handle vacation requests, sick leave, and time-off policies
- **Public Holidays**: Manage company-wide holiday schedules

### Finance & Payroll
- **Payroll Processing**: Automated salary calculations and payroll management
- **Invoice Management**: Create, send, and track invoices for clients
- **Financial Reporting**: Comprehensive finance sheets and expense tracking
- **Loan Management**: Track employee loans and repayments
- **Office Expenses**: Monitor and categorize business expenses
- **Outsourcing**: Manage external vendor relationships

### Project & Client Management
- **Project Tracking**: Create and manage projects with timelines and milestones
- **Client Relationships**: Maintain detailed client profiles and interactions
- **Performance Evaluations**: Conduct employee performance reviews
- **HR Policies**: Create and manage company policies with rich text editing

### System Administration
- **Role-Based Access Control**: Granular permissions for different user roles
- **Company Settings**: Configure organization-wide settings
- **Notifications**: System-wide notification management
- **User Authentication**: Secure login with password recovery

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query) for server state
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editing**: Tiptap editor
- **Charts**: Recharts for data visualization
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or bun package manager
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

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings-related components
│   └── hr-policies/    # HR policy components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test utilities

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for serverless operations
└── config.toml         # Supabase project configuration
```

## Authentication & Authorization

The application uses Supabase Auth for user authentication with role-based access control. User roles determine access to different sections of the application:

- **Admin**: Full access to all features
- **Manager**: Access to team management and reporting
- **Employee**: Limited access to personal data and basic features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.
