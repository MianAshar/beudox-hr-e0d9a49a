<!--
generated_by: tessera
source_sha: a3f5f655ebc057dc58d1a1ace1f3c809d1a248e4
generated_at: 2026-03-29T23:06:07.521Z
action: update
-->

# Beudox HR Management System

A comprehensive human resources management application built for modern businesses. Beudox HR provides tools for employee management, attendance tracking, payroll processing, and organizational administration.

## Features

### Core Functionality
- **Employee Management**: Complete employee profiles, onboarding, and lifecycle management
- **Attendance Tracking**: Daily attendance monitoring and reporting
- **Leave Management**: Vacation, sick leave, and holiday tracking
- **Payroll Processing**: Salary calculations and payroll management
- **Finance Management**: Budget tracking and expense management
- **Project Management**: Resource allocation and project tracking
- **Performance Evaluations**: Employee assessment and feedback systems
- **HR Policies**: Centralized policy documentation and management

### User Experience
- **Role-based Access Control**: Secure access based on user roles and permissions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Notifications**: Instant updates and alerts
- **Intuitive Navigation**: Clean, organized interface with collapsible sidebar

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI primitives with custom theming
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with Testing Library
- **E2E Testing**: Playwright

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
   
   Copy the `.env` file and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

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
│   └── layout/         # Layout components (AppLayout, Sidebar, TopBar)
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase for authentication with role-based access control. User roles determine access to different sections of the application:

- **Admin**: Full access to all features
- **Manager**: Access to team management and reporting
- **Employee**: Limited access to personal data and basic features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Beudox.