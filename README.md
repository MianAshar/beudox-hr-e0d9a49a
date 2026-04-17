<!--
generated_by: tessera
source_sha: bb2f4a3d5c7ffab410e8736a22bf8ff81da5c3f7
generated_at: 2026-04-17T22:00:31.972Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies, designed to streamline HR operations for small to medium-sized businesses.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Attendance Tracking**: Automated attendance recording with overtime calculations and reporting
- **Leave Management**: Flexible leave request system with approval workflows and balance tracking
- **Payroll Processing**: Automated payroll generation with salary calculations, deductions, and payment processing

### Performance & Development
- **Employee Evaluations**: Quarterly performance reviews with structured feedback
- **Daily Evaluations**: Real-time peer feedback and project-based assessments
- **HR Policies**: Rich text policy documents with version control

### Project & Client Management
- **Project Management**: Project tracking with team assignments and deadlines
- **Client Management**: Client relationship management with billing integration
- **Invoicing**: Automated invoice generation and payment tracking

### Financial Management
- **Expense Tracking**: Office and employee expense management with approval workflows
- **Loan Management**: Employee loan processing and repayment tracking
- **Financial Reporting**: Comprehensive financial dashboards and reports

### Communication & Notifications
- **Notification System**: Automated notifications for approvals, deadlines, and updates
- **Role-based Access**: Granular permissions based on organizational roles

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for styling
- **TipTap** rich text editor
- **React Hook Form** with Zod validation

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Edge Functions)
- **Row Level Security (RLS)** for data access control
- **Real-time subscriptions** for live updates

### Development Tools
- **ESLint** for code linting
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **TypeScript** for type checking

## Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## Installation

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
   
   The application uses Supabase migrations. Run the migrations in your Supabase project:
   ```bash
   # The migrations are located in supabase/migrations/
   # Apply them through the Supabase dashboard or CLI
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## Usage

### Authentication
- Access the application at `http://localhost:5173`
- Create an admin account through Supabase Auth
- Set up company information and initial employees

### User Roles
- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and requests

### Key Workflows

#### Employee Onboarding
1. Create employee profile with basic information
2. Assign role and department
3. Set up salary and benefits
4. Configure access permissions

#### Leave Management
1. Employee submits leave request
2. Manager reviews and approves/rejects
3. System updates leave balances
4. Notifications sent to relevant parties

#### Payroll Processing
1. System calculates salaries based on attendance and overtime
2. HR reviews and approves payroll
3. Generate payslips and process payments
4. Track payment history

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   ├── employees/      # Employee-related components
│   ├── evaluations/    # Evaluation components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database migrations
└── functions/          # Edge functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### Code Quality

The project uses ESLint for code linting and follows TypeScript strict mode. All components are typed and the codebase maintains high test coverage.

### Testing

- Unit tests with Vitest
- E2E tests with Playwright
- Component testing with React Testing Library

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Ensure these environment variables are set in your deployment platform:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Supabase Deployment
- Deploy edge functions through Supabase CLI
- Configure authentication providers
- Set up database backups and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.