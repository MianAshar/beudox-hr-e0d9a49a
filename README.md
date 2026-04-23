<!--
generated_by: tessera
source_sha: 6123843e38979f8a1ef95cb5e2946f901bd685f2
generated_at: 2026-04-23T22:38:10.068Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR provides organizations with powerful tools to manage employees, track attendance, handle payroll, manage leave requests, conduct evaluations, and oversee various HR operations.

## 🚀 Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and offboarding
- **Attendance Tracking**: Automated attendance monitoring with check-in/out, overtime calculation, and reporting
- **Leave Management**: Comprehensive leave request system with multiple leave types and balance tracking
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and payslip generation

### Performance & Development
- **Employee Evaluations**: Structured performance reviews and feedback systems
- **Daily Evaluations**: Real-time performance tracking and daily assessments
- **Salary Reviews**: Automated salary increment proposals and review scheduling

### Project & Resource Management
- **Project Management**: Project tracking, team assignments, and activity logging
- **Client Management**: Client relationship management and project associations
- **Task Management**: Individual and team task assignment and tracking

### Administrative Tools
- **HR Policies**: Digital policy management and documentation
- **Job Descriptions**: Structured job role definitions and requirements
- **Settings Management**: Configurable system settings including departments, roles, and evaluation parameters
- **Finance Overview**: Financial summaries and expense tracking

### Security & Access
- **Role-Based Access Control**: Granular permissions system with multiple user roles
- **Authentication**: Secure login with password recovery and invite system
- **Audit Logging**: Login tracking and system activity monitoring

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant forms with validation
- **Zod** - Schema validation

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **TanStack Query** - Powerful data fetching and caching

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing
- **TypeScript** - Type checking

## 📋 Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
cd beudox-hr-e0d9a49a
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using bun (recommended)
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### 4. Database Setup

The application uses Supabase migrations for database schema. The migrations are located in the `supabase/migrations/` directory and will be automatically applied when you set up your Supabase project.

### 5. Development Server

```bash
# Using npm
npm run dev

# Or using bun
bun run dev
```

The application will be available at `http://localhost:8080`

### 6. Building for Production

```bash
# Using npm
npm run build

# Or using bun
bun run build
```

## 📜 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `build:dev` - Build for development
- `preview` - Preview production build
- `lint` - Run ESLint
- `test` - Run tests once
- `test:watch` - Run tests in watch mode

## 🏗 Application Architecture

### Routing Structure

The application uses React Router with protected routes. Key routes include:

- `/` - Root redirect (to dashboard or login)
- `/login` - Authentication
- `/dashboard` - Main dashboard
- `/employees` - Employee management
- `/attendance/upload` - Attendance data upload
- `/leave` - Leave management
- `/payroll` - Payroll processing
- `/evaluations` - Performance evaluations
- `/projects` - Project management
- `/settings` - System configuration

### Component Structure

- **Pages** (`src/pages/`): Top-level route components
- **Components** (`src/components/`): Reusable UI components
  - `ui/` - Base UI components (buttons, forms, etc.)
  - `layout/` - Layout components (sidebar, header, etc.)
  - Feature-specific components (employee-profile, leave, etc.)
- **Hooks** (`src/hooks/`): Custom React hooks
- **Lib** (`src/lib/`): Utility functions and business logic
- **Integrations** (`src/integrations/`): External service integrations

### State Management

- **TanStack Query**: Server state management and caching
- **React Context**: Authentication and global state
- **Local Component State**: Form state and UI interactions

## 🔐 Authentication & Authorization

The application implements role-based access control with the following user roles:

- **Admin**: Full system access
- **HR Manager**: HR operations and employee management
- **Manager**: Team management and approvals
- **Employee**: Personal profile and basic operations

Access control is enforced at the route level and component level using the `canAccess` utility function.

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npx playwright test
```

## 📚 API Integration

The application integrates with Supabase for all backend operations:

- **Database**: PostgreSQL with real-time subscriptions
- **Authentication**: Supabase Auth
- **Storage**: File uploads and document management
- **Edge Functions**: Serverless functions for complex operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure linting passes
6. Submit a pull request

## 📄 License

This project is private and proprietary to Beudox.

## 🆘 Support

For support or questions, please contact the development team.