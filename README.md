<!--
generated_by: tessera
source_sha: 84730b592bff08963ab922338ed5d22181c3cf2b
generated_at: 2026-04-30T20:26:08.593Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management platform designed for companies to streamline employee management, attendance tracking, leave administration, payroll processing, and organizational settings. Built as a modern web application, it provides an intuitive interface for HR teams and employees to manage day-to-day operations efficiently.

## Features

### Core HR Functions
- **Employee Management**: Complete employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording, time tracking, overtime calculations, and analytics dashboards
- **Leave Management**: Leave request workflows, balance tracking, approval processes, and policy enforcement
- **Payroll Processing**: Salary calculations, overtime pay, deductions, and payslip generation
- **Performance Reviews**: Employee evaluations, salary reviews, and promotion tracking

### Administrative Tools
- **Company Settings**: Configure departments, roles, leave types, expense categories, and company policies
- **Project Management**: Team assignments, project tracking, and resource allocation
- **HR Policies**: Rich text policy documents and compliance tracking
- **Notifications**: Automated alerts for reviews, leave approvals, and system events

### Analytics & Reporting
- **Attendance Analytics**: Detailed summaries, punctuality metrics, and anomaly detection
- **Financial Insights**: Payroll summaries and expense tracking
- **Employee Insights**: Leave balances, salary history, and performance trends

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Icons**: Lucide React
- **Routing**: React Router
- **State Management**: React hooks with Supabase client
- **Testing**: Vitest for unit tests

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=your-project-id
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   VITE_SUPABASE_URL=your-supabase-url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase as its backend. The database schema is defined in the `supabase/migrations/` directory. To set up the database:

1. Create a new Supabase project
2. Run the migrations in order:
   ```bash
   supabase db push
   ```
3. Configure authentication and storage as needed

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── test/               # Test files
```

## Contributing

1. Follow the existing code style and component patterns
2. Use TypeScript for all new code
3. Add tests for new features
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.