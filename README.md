<!--
generated_by: tessera
source_sha: cbfdaa67dad861603e73542b543937249d4e19e2
generated_at: 2026-04-19T12:41:39.152Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with React, TypeScript, and Supabase. Streamline employee management, evaluations, leave tracking, payroll, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Comprehensive employee profiles with roles, departments, and organizational hierarchy
- **Performance Evaluations**: Bi-annual evaluations and daily feedback system
- **Leave Management**: Request, approve, and track various leave types with balance monitoring
- **Payroll & Finance**: Automated payroll processing, expense tracking, and financial reporting
- **Attendance Tracking**: Monitor employee attendance and working hours

### Administrative Tools
- **Settings Management**: Configure company policies, roles, departments, and evaluation parameters
- **Notifications System**: Automated notifications for HR events and approvals
- **Rich Text Policies**: Create and manage HR policies with rich text editing
- **Expense Categories**: Track and categorize business expenses

### User Experience
- **Responsive Design**: Modern, mobile-friendly interface with consistent design system
- **Role-Based Access**: Different permission levels for employees, team leads, HR managers, and CEOs
- **Real-time Updates**: Live data synchronization with Supabase
- **Search & Filter**: Powerful search functionality across employees and records

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **State Management**: React Query (TanStack)
- **Routing**: React Router
- **Charts**: Recharts
- **Testing**: Vitest, Playwright
- **Build Tools**: Vite, ESLint, PostCSS

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
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

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   # or
   bun run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── evaluations/    # Evaluation-related components
│   ├── finance/        # Financial dashboard components
│   ├── leave/          # Leave management components
│   ├── settings/       # Settings/configuration components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Run ESLint

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