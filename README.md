<!--
generated_by: tessera
source_sha: 651a4c25feeeb88adbcdf2ebb86c77c07fded418
generated_at: 2026-04-21T09:46:35.790Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources (HR) management application built for modern businesses. Beudox HR streamlines employee management, performance evaluations, payroll processing, leave tracking, project management, and financial oversight in a single, intuitive platform.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with roles, departments, and organizational structure
- **Performance Evaluations**: Bi-annual evaluations and daily feedback system with role-based visibility
- **Leave Management**: Request, approve, and track various types of leave with balance monitoring
- **Payroll Processing**: Automated payroll generation with overtime, bonuses, and deductions
- **Project Management**: Team assignment, task tracking, and project activity logging

### Administrative Tools
- **Finance Dashboard**: Monthly expense tracking and payroll summaries with trend analysis
- **Settings Management**: Configurable departments, roles, leave types, expense categories, and evaluation parameters
- **Notifications**: Automated notifications for HR events and approvals
- **Reporting**: Comprehensive reporting across all HR domains

### User Experience
- **Role-Based Access**: Tailored interfaces for employees, team leads, HR managers, and CEOs
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live data synchronization across the application

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library for consistent UI elements
- **React Query (TanStack Query)** for efficient data fetching and caching
- **React Hook Form** for form management
- **Lucide React** for icons

### Backend & Database
- **Supabase** for backend-as-a-service including:
  - PostgreSQL database with real-time subscriptions
  - Authentication and authorization
  - File storage for avatars and documents
  - Edge functions for server-side processing

### Development Tools
- **ESLint** for code linting
- **Playwright** for end-to-end testing
- **Vitest** for unit testing
- **TypeScript** for static type checking

## Getting Started

### Prerequisites
- Node.js 18+ and npm or bun
- A Supabase account and project

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
   
   The application uses Supabase migrations. If setting up a new project:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your_project_ref
   
   # Apply migrations
   supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist` directory.

### Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Page components (Next.js-style routing)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
├── test/               # Test files
└── ...

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for server-side logic
```

## Key Components

### Layout System
- **AppLayout**: Main application layout with sidebar navigation
- **AppSidebar**: Collapsible sidebar with role-based menu items
- **TopBar**: User menu and notifications

### Core Features
- **EvaluationTimeline**: Displays performance evaluation history
- **FinanceSummary**: Financial dashboard with trend charts
- **SearchableEmployeeSelect**: Employee selection component with search
- **Leave Management**: Request and approval workflow components

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