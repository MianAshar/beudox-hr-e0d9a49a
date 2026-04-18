<!--
generated_by: tessera
source_sha: c66ac7e241bf072c76ba5f1e516dda55f5985f0f
generated_at: 2026-04-18T00:55:03.445Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern businesses. Streamline employee management, attendance tracking, performance evaluations, project management, payroll processing, and more.

## 🚀 Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Company Settings**: Multi-company support with customizable settings

### Attendance & Time Tracking
- **Automated Attendance**: Check-in/check-out with overtime calculations
- **Attendance Imports**: Bulk import from external systems
- **Holiday Management**: Public holidays and working day configurations

### Performance Management
- **Quarterly Evaluations**: Comprehensive performance reviews with customizable parameters
- **Daily Evaluations**: Real-time feedback and peer reviews
- **Evaluation Parameters**: Configurable scoring criteria

### Project Management
- **Project Tracking**: Full project lifecycle management
- **Client Management**: Client relationships and billing
- **Project Assignments**: Team member allocation and tracking
- **Activity Logging**: Detailed project activity history

### Financial Management
- **Invoice Management**: Client invoicing with PDF generation
- **Payroll Processing**: Automated salary calculations with overtime and deductions
- **Expense Tracking**: Office and employee expense management
- **Loan Management**: Employee loan processing and repayments

### Leave Management
- **Leave Types**: Configurable leave categories (annual, sick, etc.)
- **Leave Requests**: Automated approval workflows
- **Leave Balances**: Real-time balance tracking and carry-over

### Document Management
- **HR Policies**: Rich text policy documents with versioning
- **Document History**: Full audit trail of changes

### Communication
- **Notifications**: In-app and email notifications
- **Real-time Updates**: Live notifications for important events

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible UI primitives
- **React Query** - Powerful data synchronization
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### Backend & Database
- **Supabase** - Open source Firebase alternative
  - PostgreSQL database
  - Authentication & authorization
  - Real-time subscriptions
  - Edge functions
  - File storage

### Development Tools
- **ESLint** - Code linting
- **Playwright** - End-to-end testing
- **Vitest** - Unit testing
- **TypeScript** - Type checking

## 📋 Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MianAshar/beudox-hr.git
cd beudox-hr
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using bun (recommended)
bun install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations/` in order
3. Configure authentication settings
4. Set up storage buckets for file uploads

### 5. Development Server

```bash
# Using npm
npm run dev

# Or using bun
bun run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   ├── employees/      # Employee-related components
│   ├── evaluations/    # Evaluation components
│   ├── projects/       # Project management components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── App.tsx             # Main application component
```

## 🔐 Authentication & Authorization

The application uses Supabase Auth for authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Personal data and basic operations

## 📊 Database Schema

The system uses a comprehensive PostgreSQL database with 30+ tables including:

- User management (employees, roles, companies)
- Attendance tracking (records, imports)
- Performance management (evaluations, parameters)
- Project management (projects, assignments, clients)
- Financial management (invoices, payroll, expenses)
- Leave management (requests, balances, types)
- Document management (HR policies, versions)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions, please contact the development team.