<!--
generated_by: tessera
source_sha: d00bdd87ef74df4d9f3d9037dee4c8e6c466a45a
generated_at: 2026-04-20T20:34:22.965Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built for modern businesses. Beudox HR streamlines employee management, performance evaluations, payroll processing, leave tracking, and financial reporting.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with roles, departments, and organizational structure
- **Performance Evaluations**: Bi-annual evaluations and daily feedback system
- **Leave Management**: Request, approve, and track various leave types with balance monitoring
- **Payroll Processing**: Automated payroll calculations including overtime, bonuses, and deductions
- **Project Management**: Team assignments, task tracking, and project activity logging

### Administrative Tools
- **Finance Dashboard**: Monthly expense tracking and financial summaries with trend analysis
- **HR Policies**: Rich text policy documents and company guidelines
- **Settings Management**: Configure departments, roles, leave types, expense categories, and evaluation parameters
- **Notifications**: Automated notifications for HR events and approvals

### User Experience
- **Role-based Access**: Different permission levels for employees, team leads, HR managers, and CEOs
- **Responsive Design**: Modern, clean interface that works on all devices
- **Real-time Updates**: Live data synchronization across the application

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database + real-time subscriptions)
- **Routing**: React Router
- **State Management**: React Query for server state, custom hooks for local state
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with validation
- **Icons**: Lucide React

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
   
   Copy the `.env` file and update the Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. **Database Setup**
   
   The application uses Supabase migrations. If setting up a new project:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref jqhiijbunselslmvhdwe
   
   # Apply migrations
   supabase db push
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components (sidebar, header, etc.)
│   ├── evaluations/    # Evaluation-related components
│   ├── finance/        # Financial dashboard components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── profile/        # User profile components
│   ├── settings/       # Admin settings components
│   └── hr-policies/    # Policy document components
├── pages/              # Page components (Next.js style routing)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for backend logic
```

## Key Components

### Layout Components
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Collapsible sidebar with navigation menu
- **TopBar**: Header with user menu and notifications
- **NotificationBell**: Notification dropdown and management

### Feature Components
- **EvaluationTimeline**: Displays evaluation history with filtering
- **FinanceSummary**: Financial dashboard with charts and KPIs
- **SearchableEmployeeSelect**: Employee selection with search functionality
- **BeudoxLogo**: Application logo component with variant support

## Database Schema

The application uses a comprehensive PostgreSQL schema managed through Supabase migrations. Key tables include:

- `employees`: Employee profiles and organizational data
- `evaluations`: Performance evaluation records
- `daily_evaluations`: Daily feedback entries
- `leave_requests`: Leave application and approval tracking
- `payroll_records`: Payroll calculation and payment history
- `projects`: Project management and task tracking
- `monthly_expenses`: Financial expense tracking
- `notifications`: System notification management

## Authentication & Authorization

- **Authentication**: Supabase Auth with email/password and social logins
- **Role-based Access**: Hierarchical permissions (Employee → Team Lead → HR Manager → CEO)
- **Row Level Security**: Database-level access control through RLS policies

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint)
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

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