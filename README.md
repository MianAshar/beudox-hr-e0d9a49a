<!--
generated_by: tessera
source_sha: 20ef1eb521eec693f7ae1732004ba33e7dca4c1d
generated_at: 2026-04-19T13:02:16.583Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern businesses. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and financial reporting.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with roles, departments, and organizational structure
- **Performance Evaluations**: Bi-annual evaluations and daily feedback system
- **Leave Management**: Request, approve, and track various types of leave
- **Payroll Processing**: Automated payroll calculations with overtime and bonuses
- **Financial Dashboard**: Real-time expense tracking and financial summaries

### Administrative Tools
- **Company Settings**: Configure departments, roles, leave types, and expense categories
- **Notifications System**: Automated alerts for HR events and approvals
- **Role-based Access Control**: Granular permissions for different user types (CEO, HR Manager, Team Lead, Employee)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Configured for modern hosting platforms

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

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Run tests**
   ```bash
   npm run test
   ```

### Database Setup

The application uses Supabase for data storage. Database migrations are included in the `supabase/migrations/` directory. To set up the database:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── evaluations/    # Evaluation-related components
│   ├── finance/        # Financial dashboard components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── settings/       # Admin settings components
├── pages/              # Page components (Next.js style routing)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── test/               # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the test suite: `npm run test`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.