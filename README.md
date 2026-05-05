<!--
generated_by: tessera
source_sha: d2dd5800dede643bd5c76facc7cd3e7c05224a68
generated_at: 2026-05-05T12:08:41.061Z
action: update
-->

# Beudox HR Portal

A comprehensive HR management system built for modern companies to streamline employee management, attendance tracking, leave administration, payroll processing, and performance evaluations.

## Features

### Core HR Modules
- **Employee Management**: Complete employee profiles with personal details, roles, and organizational structure
- **Attendance Tracking**: Automated attendance recording with check-in/out, working hours calculation, overtime tracking, and anomaly detection
- **Leave Management**: Leave request system with balance tracking, approval workflows, and policy enforcement
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, deductions, and PDF invoice generation
- **Performance Evaluations**: Employee evaluation system with scheduled reviews, parameter-based assessments, and timeline tracking
- **Finance & Expenses**: Expense tracking and financial summaries for better budget management

### Administrative Tools
- **Settings Management**: Company configuration, departments, roles, leave types, evaluation parameters, and expense categories
- **User Access Control**: Role-based permissions and authentication with mandatory password changes
- **Audit & Logging**: Login tracking, activity logs, and system change history
- **Project Management**: Team assignments, project tracking, and activity logging

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router (Pages Router pattern)
- **Backend**: Supabase (PostgreSQL database + real-time features)
- **UI Components**: Custom component library with shadcn/ui foundation
- **State Management**: React hooks and context
- **Testing**: Vitest for unit testing
- **Deployment**: Configured for modern web hosting

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
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Database Setup**
   
   The application uses Supabase migrations for database schema. The migrations are located in `supabase/migrations/` and will be applied automatically when you run the Supabase CLI commands.
   
   If you're setting up a new Supabase project:
   ```bash
   npx supabase start
   npx supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── employee-profile/ # Employee profile tabs
│   └── ...
├── pages/              # Route components (Next.js Pages Router)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
└── config.toml        # Supabase configuration
```

## Usage

### First Time Setup
1. Access the application at the development URL
2. Create a company account or log in with existing credentials
3. Configure company settings (departments, roles, leave types, etc.)
4. Add employees and set up their profiles
5. Import attendance data or set up automated tracking

### Daily Operations
- **Employees**: Check attendance, submit leave requests, view payroll
- **Managers**: Approve requests, manage teams, review performance
- **HR/Admin**: Configure policies, generate reports, manage payroll

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team or refer to the internal documentation.