<!--
generated_by: tessera
source_sha: 34474433baf6ce5d84be9dba1b703f540bfd4d0c
generated_at: 2026-04-12T18:58:50.596Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, project tracking, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Attendance Tracking**: Automated attendance monitoring with overtime calculations
- **Leave Management**: Flexible leave types with approval workflows
- **Payroll Processing**: Automated salary calculations, deductions, and payment processing

### Performance & Development
- **Performance Evaluations**: Quarterly and daily evaluation systems
- **Employee Development**: Structured feedback and improvement tracking
- **Goal Setting**: Performance objectives and progress monitoring

### Project & Client Management
- **Project Tracking**: Project lifecycle management with resource allocation
- **Client Relations**: Client information and billing management
- **Invoice Generation**: Automated invoice creation and payment tracking

### Financial Management
- **Expense Tracking**: Office and employee expense management
- **Loan Management**: Employee loan processing and repayment tracking
- **Financial Reporting**: Comprehensive financial analytics and reporting

### Administrative Features
- **Role-Based Access Control**: Granular permissions system
- **Multi-Company Support**: Single platform for multiple company management
- **Notification System**: Automated alerts and communication
- **Document Management**: HR policy and document version control

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **shadcn/ui** - Modern UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Tiptap** - Rich text editor for HR documents

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Database-level access control
- **Real-time subscriptions** - Live data updates

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing
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
   
   Update the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The database schema is automatically managed through Supabase migrations. The application expects the following tables to be present:
   - Companies, Employees, Roles
   - Attendance, Payroll, Evaluations
   - Projects, Clients, Invoices
   - Leave management, Loans, Expenses
   - And more (see database schema documentation)

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   # or
   bun run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings page components
│   ├── evaluations/    # Evaluation-related components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── App.tsx             # Main application component
```

## Key Components

### Authentication & Authorization
- Role-based access control with granular permissions
- JWT-based authentication via Supabase Auth
- Protected routes with automatic redirects

### Data Management
- React Query for server state management
- Optimistic updates for better UX
- Real-time data synchronization

### UI/UX
- Responsive design with Tailwind CSS
- Dark/light theme support
- Accessible components with Radix UI primitives
- Toast notifications and loading states

## API Integration

The application integrates with Supabase for:
- **Authentication**: User login/logout, password reset
- **Database**: CRUD operations on all entities
- **File Storage**: Document and image uploads
- **Real-time**: Live updates for collaborative features

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npx playwright test
```

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Configure environment variables on your hosting platform

### Recommended Deployment Platforms
- Vercel
- Netlify
- AWS S3 + CloudFront
- Supabase Edge Functions (for full-stack deployment)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the test suite: `npm run test`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team or create an issue in the repository.