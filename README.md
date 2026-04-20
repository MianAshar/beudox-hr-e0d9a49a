<!--
generated_by: tessera
source_sha: 62da9ca68a594e1bf650a365c6f4caceaedd0a2a
generated_at: 2026-04-20T20:39:24.805Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, leave tracking, and organizational workflows for businesses.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including profiles, onboarding, and offboarding
- **Organizational Structure**: Departments, roles, and hierarchical management
- **Performance Tracking**: Quarterly and daily evaluations with detailed feedback systems
- **Leave Management**: Automated leave request processing, balance tracking, and approval workflows

### Financial Management
- **Payroll Processing**: Automated payroll calculations with overtime, bonuses, and deductions
- **Expense Tracking**: Monthly expense management and reporting
- **Invoice Management**: Client invoicing with PDF generation and email delivery
- **Financial Analytics**: Comprehensive dashboards with trend analysis and KPIs

### Project & Resource Management
- **Project Management**: Project creation, team assignment, and progress tracking
- **Client Management**: Client profiles and relationship management
- **Task Management**: Individual and team task assignment and tracking

### Administrative Features
- **HR Policies**: Digital policy management with rich text editing
- **Job Descriptions**: Structured job posting and description management
- **Public Holidays**: Configurable holiday calendars
- **Loan Management**: Employee loan tracking and repayment schedules

### User Experience
- **Role-Based Access Control**: Granular permissions for different user types (CEO, HR Manager, Team Lead, Employee)
- **Responsive Design**: Mobile-first design that works across all devices
- **Real-time Notifications**: Instant notifications for important events and approvals
- **Dark/Light Theme**: User preference-based theming

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library built on Radix UI

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - Authentication and authorization
- **Supabase Edge Functions** - Serverless functions for complex operations

### State Management & Data Fetching
- **TanStack Query** - Powerful data synchronization for React
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Additional Libraries
- **Recharts** - Composable charting library
- **TipTap** - Rich text editor
- **React Image Crop** - Image cropping functionality
- **XLSX** - Excel file processing
- **Date-fns** - Modern JavaScript date utility library

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

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Update `.env` file with your Supabase credentials:
     ```env
     VITE_SUPABASE_PROJECT_ID=your_project_id
     VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
     VITE_SUPABASE_URL=your_project_url
     ```

4. **Run database migrations**
   - Install Supabase CLI
   - Link your project: `supabase link --project-ref your_project_ref`
   - Run migrations: `supabase db push`

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:8080`
   - The application will be running in development mode

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
│   ├── finance/        # Financial dashboard components
│   ├── evaluations/    # Evaluation-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for serverless operations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

```bash
# Run unit tests
npm run test

# Run E2E tests
npx playwright test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the test suite: `npm run test`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.