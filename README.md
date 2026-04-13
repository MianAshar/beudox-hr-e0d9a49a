<!--
generated_by: tessera
source_sha: 7b981c028793e58c58f99f38b47edd01a0828f06
generated_at: 2026-04-13T10:51:52.484Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built for modern businesses. Beudox HR streamlines employee management, leave tracking, performance evaluations, policy management, and administrative workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with roles, departments, and organizational structure
- **Leave Management**: Request, approve, and track leave balances across different leave types
- **Performance Evaluations**: 
  - Quarterly evaluations with detailed feedback and recommendations
  - Daily peer-to-peer evaluations for continuous feedback
  - Timeline view of all evaluations with role-based visibility
- **HR Policies**: Rich text policy documents with formatting capabilities
- **Company Settings**: Configure departments, roles, leave types, expense categories, and evaluation parameters

### Administrative Features
- **Notifications System**: Automated notifications for HR events and approvals
- **Payroll Integration**: Automated payroll generation with attendance tracking
- **Invoice Management**: PDF invoice generation and email delivery
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router
- **State Management**: React Query for server state, custom hooks for UI state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions, edge functions)
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Configured for modern web deployment platforms

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
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
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   If using Supabase CLI:
   ```bash
   supabase db reset
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
# or
bun run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── layout/          # App layout components (sidebar, topbar, etc.)
│   ├── leave/           # Leave management components
│   ├── evaluations/     # Evaluation-related components
│   ├── hr-policies/     # Policy management components
│   ├── settings/        # Admin settings components
│   └── ...
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── integrations/        # External service integrations (Supabase)
└── ...

supabase/
├── migrations/          # Database schema migrations
└── functions/           # Edge functions for backend logic
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
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.