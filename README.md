<!--
generated_by: tessera
source_sha: 2360da71b970a607d2dfaa07c69a6a8cdd48c807
generated_at: 2026-04-19T20:57:04.765Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with React, TypeScript, and Supabase. Streamline employee management, payroll, evaluations, leave tracking, and more in a modern, user-friendly interface.

## Features

### Core HR Management
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Company Settings**: Configure departments, roles, leave types, expense categories, and evaluation parameters

### Performance & Development
- **Quarterly Evaluations**: Structured performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Project Management**: Track projects, assign tasks, and monitor progress

### Financial Management
- **Payroll Processing**: Automated payroll calculations with overtime, bonuses, and deductions
- **Expense Tracking**: Monitor and approve employee expenses
- **Invoice Management**: Generate and manage client invoices
- **Financial Dashboard**: Real-time insights into payroll and expenses

### Time & Leave Management
- **Leave Management**: Request, approve, and track various leave types
- **Attendance Tracking**: Monitor employee attendance patterns
- **Public Holidays**: Configure and display company holidays

### Communication & Policies
- **HR Policies**: Rich text policy documents with full editing capabilities
- **Notifications**: Automated notifications for important events
- **Client Management**: Maintain client relationships and project assignments

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: ShadCN/UI with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text**: Tiptap for policy editing

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser

### Database Setup

The application uses Supabase as its backend. The database schema includes migrations for:
- User authentication and authorization
- Employee and company management
- Payroll and financial records
- Evaluations and performance tracking
- Projects and task management
- Leave and attendance systems

Run the migrations in the `supabase/migrations/` directory in order.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN/UI components
│   ├── layout/         # App layout components
│   ├── finance/        # Financial components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Open a Pull Request

## License

This project is private and proprietary to Beudox.

## Support

For support or questions, please contact the development team.