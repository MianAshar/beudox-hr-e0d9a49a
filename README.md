<!--
generated_by: tessera
source_sha: c350928f79a57af4dadd038fc15720484a255196
generated_at: 2026-04-17T23:42:32.749Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines HR operations for companies, providing tools for employee management, attendance tracking, leave management, payroll processing, performance evaluations, and more.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profile management, and organizational structure
- **Attendance Tracking**: Automated attendance recording with overtime calculations and reporting
- **Leave Management**: Comprehensive leave request and approval system with balance tracking
- **Payroll Processing**: Automated payroll calculations, salary history, and payment processing

### Performance & Development
- **Performance Evaluations**: Bi-annual and daily evaluation systems with customizable parameters
- **HR Policies**: Rich text policy documents with version control and publishing
- **Notifications**: Automated notifications for HR events and approvals

### Project & Client Management
- **Project Management**: Project tracking, resource allocation, and client management
- **Invoice Management**: Client invoicing with payment tracking and PDF generation
- **Finance Tracking**: Expense management and financial reporting

### Administrative Features
- **Role-Based Access Control**: Granular permissions for different user roles (Employee, HR Manager, Finance Manager, Team Lead, CEO)
- **Multi-Company Support**: Single platform supporting multiple companies
- **Audit Logging**: Comprehensive logging of administrative actions

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for styling with custom design system
- **Tiptap** for rich text editing
- **React Hook Form** with Zod validation

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)
- **Row Level Security (RLS)** policies for data access control
- **Real-time subscriptions** for live updates
- **Supabase Auth** for user authentication and authorization

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type checking
- **Vitest** for unit testing
- **Playwright** for end-to-end testing

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
   
   Copy the environment template:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

4. **Database Setup**
   
   The project includes Supabase migrations. Run them in your Supabase project:
   ```bash
   # Apply migrations in order
   supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `http://localhost:5173`

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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (sidebar, topbar)
│   └── [feature]/      # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── App.tsx             # Main application component
```

## Authentication & Authorization

The application uses Supabase Auth with role-based access control:

- **CEO**: Full access to all features
- **HR Manager**: Employee management, attendance, leave, evaluations, policies
- **Finance Manager**: Payroll, invoices, finance, expenses
- **Team Lead**: Project management, evaluations, team oversight
- **Employee**: Personal dashboard, leave requests, evaluations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.