<!--
generated_by: tessera
source_sha: b9d25ca50f9936ed4870c9193d580635d08b66e4
generated_at: 2026-04-18T01:08:40.207Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, leave tracking, and organizational workflows.

## 🚀 Features

### Core HR Management
- **Employee Lifecycle**: Complete employee onboarding, profile management, and offboarding
- **Organizational Structure**: Department and role management with hierarchical permissions
- **Performance Management**: Quarterly and daily evaluations with customizable parameters
- **Leave Management**: Automated leave request processing with balance tracking

### Financial & Payroll
- **Payroll Processing**: Automated payroll generation with overtime calculations
- **Expense Tracking**: Monthly expense management and reporting
- **Loan Management**: Employee loan tracking and deductions
- **Financial Analytics**: Comprehensive financial dashboards and reporting

### Project & Client Management
- **Project Tracking**: Project lifecycle management with activity logging
- **Client Relations**: Client database with detailed profiles
- **Invoice Management**: Automated invoice generation and tracking

### Administrative Tools
- **HR Policies**: Rich text policy documents with version control
- **Public Holidays**: Configurable holiday calendar management
- **Notifications**: Automated email notifications for key events
- **Settings**: Comprehensive system configuration options

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Shadcn/ui (Radix UI primitives), Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Rich Text**: TipTap Editor
- **Testing**: Vitest, Playwright

## 📋 Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## 🚀 Quick Start

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
   
   Copy the environment template:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in your Supabase project:
   ```bash
   # The migrations are located in supabase/migrations/
   # Apply them through the Supabase dashboard or CLI
   ```

5. **Development Server**
   ```bash
   npm run dev
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
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components (sidebar, topbar, etc.)
│   ├── finance/        # Financial components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## 🔐 Authentication & Authorization

Beudox HR uses Supabase Auth for user authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Limited access to personal data

## 📊 Key Components

### Dashboard
Central hub displaying key metrics, recent activities, and quick actions.

### Employee Management
- Employee profiles with comprehensive information
- Role and department assignments
- Performance tracking and evaluations

### Financial Management
- Automated payroll processing
- Expense tracking and reporting
- Financial analytics and trends

### Leave Management
- Leave request workflow
- Balance tracking
- Approval processes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions, please contact the development team.