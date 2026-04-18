<!--
generated_by: tessera
source_sha: be22c53a9b4354969e209148d4d03dbfbcb698f3
generated_at: 2026-04-18T00:33:40.398Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and organizational workflows.

## 🚀 Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Performance Evaluations**: Bi-annual and daily evaluation systems with customizable parameters
- **Leave Management**: Automated leave request processing with balance tracking
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **Project Management**: Project tracking with team assignments and activity logging

### Administrative Tools
- **HR Policies**: Rich text policy documents with version control
- **Client Management**: Client relationship and invoice management
- **Loan Management**: Employee loan tracking and repayment schedules
- **Finance Dashboard**: Comprehensive financial reporting and analytics
- **Settings Management**: Configurable company settings, departments, roles, and parameters

### User Experience
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Responsive Design**: Modern, mobile-friendly interface using shadcn/ui components
- **Real-time Notifications**: Automated notifications for important HR events
- **Dark/Light Theme**: User preference-based theming

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast development
- **Routing**: React Router v6 with protected routes
- **State Management**: TanStack Query for server state, React Context for auth
- **UI Components**: shadcn/ui (Radix UI primitives) with Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Rich Text Editing**: Tiptap editor for HR policies
- **Charts & Analytics**: Recharts for financial and performance visualizations
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, or bun package manager
- Supabase account and project

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
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
   
   If using Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employees/      # Employee-specific components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings components
│   └── hr-policies/    # HR policy components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions
```

## 🔐 Authentication & Authorization

The application uses Supabase authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal profile and limited access

## 📊 Key Components

### Core Components
- **AppLayout**: Main application layout with sidebar navigation
- **EvaluationTimeline**: Performance evaluation history
- **SearchableEmployeeSelect**: Employee selection with search
- **RichTextEditor**: WYSIWYG editor for HR policies
- **BeudoxLogo**: Brand logo component with variants

### Layout Components
- **AppSidebar**: Navigation sidebar with role-based menu items
- **TopBar**: User menu and notifications
- **NotificationBell**: Real-time notification system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support or questions, please contact the development team.