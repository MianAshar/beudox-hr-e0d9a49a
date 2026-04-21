<!--
generated_by: tessera
source_sha: 39080db9ce7de754e98b2195b07c38e0f3c8705b
generated_at: 2026-04-21T10:15:20.633Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application designed to streamline employee management, performance evaluations, leave tracking, payroll processing, and financial reporting for organizations. Built as a modern web application, it provides an intuitive interface for HR managers, team leads, and employees to manage various aspects of workforce administration.

## Features

### Core HR Functionality
- **Employee Management**: Comprehensive employee profiles with personal details, roles, and organizational hierarchy
- **Performance Evaluations**: 
  - Quarterly/bi-annual evaluations with detailed feedback and recommendations
  - Daily evaluations for continuous feedback between team members
  - Evaluation timeline with historical performance data
- **Leave Management**: 
  - Multiple leave types (vacation, sick leave, etc.)
  - Leave request workflow with approval processes
  - Leave balance tracking and utilization reports
- **Payroll Processing**: 
  - Automated payroll calculations
  - Overtime tracking (regular and holiday)
  - Bonus and loan deduction management
  - Payroll record generation and history

### Financial Management
- **Expense Tracking**: Monthly expense categorization and reporting
- **Financial Analytics**: 6-month trend analysis with interactive charts
- **Payroll vs Expenses**: Comparative financial summaries

### Project Management
- **Team Assignment**: Project-based team management
- **Activity Logging**: Project activity tracking and reporting
- **Task Management**: Project task assignment and monitoring

### Administrative Features
- **Company Settings**: Department, roles, leave types, and expense categories configuration
- **User Roles & Permissions**: Granular access control (HR Manager, CEO, Team Lead, Employee)
- **Login Tracking**: Security monitoring with device and location tracking
- **Notification System**: Automated notifications for various HR events

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL database + real-time subscriptions)
- **State Management**: React Query (TanStack Query) for server state
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Forms**: React Hook Form with validation
- **Testing**: Vitest for unit testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr.git
   cd beudox-hr
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
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in your Supabase project:
   ```bash
   # The migrations are located in supabase/migrations/
   # Use Supabase CLI or dashboard to apply them
   supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
# or
bun run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── evaluations/    # Evaluation-related components
│   ├── finance/        # Financial dashboard components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   └── settings/       # Admin settings components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Key Components

### Layout Components
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Navigation sidebar with role-based menu items
- **TopBar**: Top navigation bar with user menu and notifications

### Core Features
- **EvaluationTimeline**: Displays historical evaluation data with filtering
- **FinanceSummary**: Financial dashboard with trend charts
- **SearchableEmployeeSelect**: Employee selection component with search
- **BeudoxLogo**: Application logo component with variant support

## Authentication & Authorization

The application uses Supabase authentication with role-based access control:

- **CEO**: Full administrative access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal data access and basic operations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.