<!--
generated_by: tessera
source_sha: 001061ada578b3f6e982469cb94d4dfa0ee8e474
generated_at: 2026-04-30T11:48:34.279Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern web application for managing employee data, attendance, leave, payroll, and organizational workflows.

## Features

### Core HR Modules
- **Employee Profiles**: Complete employee information management including personal details, job history, and organizational structure
- **Attendance Management**: Automated attendance tracking with check-in/out, overtime calculation, and analytics
- **Leave Management**: Comprehensive leave request and approval system with balance tracking
- **Payroll Processing**: Automated payroll generation with salary calculations and overtime handling
- **Performance Evaluations**: Employee evaluation system with scheduled reviews and feedback
- **Project Management**: Team assignment and project tracking capabilities
- **Finance & Expenses**: Expense tracking and financial reporting
- **HR Policies**: Rich text policy documentation and management

### Administrative Features
- **User Authentication**: Secure login with mandatory password changes for new users
- **Role-Based Access Control**: Granular permissions system for different user roles
- **Company Settings**: Configurable company information, departments, roles, and policies
- **Audit Logs**: Login tracking and activity monitoring
- **Notification System**: Automated notifications for HR events and approvals

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **UI Components**: Custom component library with Radix UI primitives
- **State Management**: React hooks and context
- **Testing**: Vitest for unit testing
- **Deployment**: Modern web standards

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. **Database Setup**
   
   The application uses Supabase for data storage. Run the SQL migrations in the `supabase/migrations/` directory to set up the database schema.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI primitives (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components (Next.js-style routing)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── main.tsx           # Application entry point

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for backend logic
```

## Key Components

### Core UI Components
- **BeudoxLogo**: Brand logo component with multiple variants
- **AppLayout**: Main application layout with sidebar navigation
- **SearchableEmployeeSelect**: Employee selection dropdown with search
- **MandatoryPasswordChange**: Password reset modal for new users

### Feature Components
- **AttendanceSummary**: Comprehensive attendance analytics dashboard
- **LeaveBalancesTab**: Employee leave balance management
- **PayrollDetailSheet**: Detailed payroll information display
- **EvaluationTimeline**: Performance review timeline visualization

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Comprehensive test coverage

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure TypeScript types are properly defined
5. Test across different screen sizes

## License

This project is proprietary software. All rights reserved.