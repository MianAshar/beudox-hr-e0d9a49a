<!--
generated_by: tessera
source_sha: 33a0971c00b6755ad2b4b40df39abdb3f8cc7ba7
generated_at: 2026-04-19T14:07:58.146Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern companies. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and financial oversight in a single, intuitive web application.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions for different user roles (Employee, Team Lead, HR Manager, Finance Manager, CEO)
- **Profile Management**: Detailed employee profiles with personal information, job details, and history

### Performance & Evaluations
- **Bi-Annual Evaluations**: Structured performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with filtering by role

### Leave & Attendance
- **Leave Management**: Request, approve, and track various leave types
- **Leave Balances**: Real-time tracking of remaining leave days
- **Public Holidays**: Company-wide holiday management

### Payroll & Finance
- **Payroll Processing**: Automated payroll calculations with overtime and bonuses
- **Payslip Generation**: Employee payslip access and PDF generation
- **Financial Dashboard**: Revenue and expense tracking with trend analysis
- **Invoice Management**: Client invoicing and payment tracking

### Project Management
- **Project Tracking**: Project creation, assignment, and progress monitoring
- **Task Management**: Individual and team task assignment
- **Client Management**: Client relationship and project association

### HR Policies & Compliance
- **Policy Management**: Rich text policy documents with version control
- **Loan Management**: Employee loan requests and tracking
- **Settings Management**: Configurable company settings and parameters

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast development
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query for server state, React Hook Form for forms
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Routing**: React Router v6 with protected routes
- **Charts**: Recharts for data visualization
- **Rich Text**: Tiptap for policy document editing
- **Testing**: Vitest + Playwright for unit and E2E testing

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
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist/` directory.

## User Roles & Permissions

### Employee
Basic access to personal dashboard, leave requests, evaluations, and payslips.

### Team Lead
Employee access plus project management and team evaluation capabilities.

### HR Manager
Full employee management, leave approvals, evaluations, and HR policy management.

### Finance Manager
Payroll processing, invoice management, financial reporting, and expense tracking.

### CEO
Complete access to all system features and settings.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   └── feature/        # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses ESLint for code linting and follows TypeScript strict mode. All components are built with accessibility in mind using Radix UI primitives.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.