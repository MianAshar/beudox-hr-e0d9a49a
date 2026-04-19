<!--
generated_by: tessera
source_sha: a90685c00aea6cff27dce068c05702801a768e5c
generated_at: 2026-04-19T20:46:03.184Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, project tracking, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Organizational Structure**: Departments, roles, and hierarchical management
- **Profile Management**: Personal information, contact details, and professional data

### Performance & Evaluation
- **Quarterly Evaluations**: Bi-annual performance reviews with detailed feedback
- **Daily Evaluations**: Real-time feedback and performance tracking
- **Evaluation Timeline**: Historical view of all evaluations and feedback

### Financial Management
- **Payroll Processing**: Automated salary calculations with overtime and bonuses
- **Expense Tracking**: Monthly expense management and reporting
- **Loan Management**: Employee loan tracking and deductions
- **Financial Dashboard**: Comprehensive financial overview with trend analysis

### Project Management
- **Project Tracking**: Project creation, assignment, and progress monitoring
- **Task Management**: Individual and team task assignment
- **Client Management**: Client information and project associations
- **Invoice Generation**: Automated invoice creation and PDF generation

### Leave & Attendance
- **Leave Management**: Request, approval, and tracking of various leave types
- **Attendance Tracking**: Daily attendance monitoring
- **Public Holidays**: Holiday calendar management

### Policy & Communication
- **HR Policies**: Rich text policy documents with version control
- **Notifications**: Automated notifications for important events
- **Settings Management**: Configurable system settings and parameters

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS, Radix UI
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text Editor**: Tiptap
- **Testing**: Vitest, Playwright
- **Build Tools**: Vite, ESLint, TypeScript

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
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:8080`

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
│   ├── finance/        # Financial components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   └── ...
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## User Roles & Permissions

- **CEO**: Full system access
- **HR Manager**: Employee management, evaluations, settings
- **Team Lead**: Team management, evaluations, project oversight
- **Employee**: Personal profile, tasks, leave requests

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

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

For support and questions, please contact the development team.