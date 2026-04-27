<!--
generated_by: tessera
source_sha: e0ed8c70d23881833472a574a5e0a4b8f1c9ab44
generated_at: 2026-04-27T11:03:45.531Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, attendance tracking, leave management, payroll processing, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance import from biometric devices with AI-powered parsing, overtime calculations, and reporting
- **Leave Management**: Request, approve, and track various leave types with balance management
- **Payroll Processing**: Automated payroll generation with salary calculations, deductions, and payslip generation

### Organizational Tools
- **Project Management**: Create and manage projects with team assignments and task tracking
- **Performance Evaluations**: Regular and daily evaluations with customizable parameters
- **HR Policies**: Rich text policy documents with version control
- **Job Descriptions**: Structured job descriptions with requirements and responsibilities

### Administrative Features
- **Role-Based Access Control**: Granular permissions system for different user roles
- **Company Settings**: Configurable company information, departments, and system parameters
- **Finance Management**: Invoice generation, expense tracking, and financial reporting
- **Loan Management**: Employee loan requests and tracking

### User Experience
- **Responsive Design**: Modern, mobile-friendly interface built with shadcn/ui
- **Real-time Notifications**: Toast notifications and email alerts
- **Dashboard Analytics**: Comprehensive dashboards with key metrics and insights
- **Search & Filtering**: Advanced search capabilities across all modules

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with shadcn/ui component library
- **React Query** for efficient server state management
- **React Hook Form** with Zod validation for form handling

### Backend & Database
- **Supabase** for backend-as-a-service (authentication, database, storage, edge functions)
- **PostgreSQL** database with real-time subscriptions
- **Supabase Edge Functions** for server-side processing (AI parsing, PDF generation)

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **Prettier** for code formatting

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
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
   
   Copy the `.env` file and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The database schema is managed through Supabase migrations. The migrations are located in `supabase/migrations/` and will be applied automatically when you run the Supabase CLI commands.
   
   If using Supabase CLI:
   ```bash
   supabase start
   ```

5. **Start the development server**
   ```bash
   npm run dev
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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and business logic
│   ├── utils.ts        # General utilities
│   ├── role-access.ts  # Permission checking
│   ├── attendance-format.ts # Attendance formatting
│   └── ...
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for server-side logic
```

## Key Workflows

### Attendance Processing
1. Upload Excel/CSV files from biometric devices
2. AI-powered parsing normalizes data format
3. Automatic calculation of working hours and overtime
4. Batch import with conflict resolution
5. Real-time reporting and analytics

### Payroll Generation
1. Configure salary components and deductions
2. Automated calculation based on attendance and leave data
3. PDF payslip generation
4. Approval workflows and distribution

### Leave Management
1. Employees submit leave requests
2. Automatic balance checking and approval routing
3. Calendar integration and conflict detection
4. Accrual calculations and reporting

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