<!--
generated_by: tessera
source_sha: d5deb5bd5c9714c72e93778947bb8ef3f6812c5e
generated_at: 2026-04-19T12:41:06.444Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll processing, leave tracking, performance evaluations, and financial reporting for organizations.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Leave Management**: Automated leave request processing, balance tracking, and approval workflows
- **Payroll Processing**: Automated payroll calculations with overtime, bonuses, and deductions
- **Performance Evaluations**: Bi-annual and daily evaluation systems with customizable parameters
- **Project Management**: Project tracking, client management, and resource allocation

### Financial Management
- **Invoice Management**: Client invoicing with PDF generation and email delivery
- **Expense Tracking**: Monthly expense management and reporting
- **Financial Analytics**: Comprehensive dashboards with trend analysis and KPIs

### Administrative Features
- **HR Policies**: Rich text policy documents with version control
- **Loan Management**: Employee loan tracking and repayment schedules
- **Public Holidays**: Configurable holiday calendars
- **Role-Based Access Control**: Granular permissions system with multiple user roles

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, React Hook Form for forms
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Charts**: Recharts for data visualization
- **Rich Text Editing**: Tiptap for policy documents
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

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
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Access the application**
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── finance/        # Financial dashboard components
│   ├── evaluations/    # Evaluation-related components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The application uses Supabase authentication with role-based access control. User roles include:
- **Employee**: Basic access to personal data and requests
- **Team Lead**: Additional permissions for team management
- **HR Manager**: Full HR functionality access
- **CEO**: Administrative access to all features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.