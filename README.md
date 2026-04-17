<!--
generated_by: tessera
source_sha: 099d34358ea15e3c514ce78c3f996a5e1e65dbc6
generated_at: 2026-04-17T21:48:49.795Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies to streamline HR operations, employee management, and organizational workflows.

## 🚀 Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions for different user roles (CEO, HR Manager, Team Lead, Employee)
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback
- **Leave Management**: Automated leave request and approval workflows
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **Loan Management**: Employee loan tracking and management

### Business Operations
- **Project Management**: Project creation, assignment, and tracking
- **Client Management**: Client profiles and relationship management
- **Invoice Management**: Automated invoice generation and tracking
- **Finance Sheets**: Comprehensive financial reporting and analytics

### Administrative Tools
- **HR Policies**: Rich text policy documents with version control
- **Settings Management**: Configurable company settings, departments, roles, and more
- **Public Holidays**: Holiday calendar management
- **Notifications**: Automated email notifications for key events

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query for server state, Context API for authentication
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Rich Text Editor**: Tiptap for policy documents

### Backend & Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time Features**: Supabase Realtime
- **File Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions for server-side logic
- **Email**: Supabase email service for notifications

### Development Tools
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: npm/bun

## 📋 Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

## 🚀 Getting Started

### 1. Clone the Repository
```bash
# Clone the repository
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

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### 4. Supabase Setup

1. Create a new Supabase project
2. Run the database migrations located in `supabase/migrations/`
3. Configure authentication settings
4. Set up storage buckets for file uploads
5. Deploy edge functions if needed

### 5. Development Server

```bash
# Start the development server
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080`

### 6. Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings-related components
│   ├── evaluations/    # Evaluation components
│   ├── leave/          # Leave management components
│   └── hr-policies/    # HR policy components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## 🔐 User Roles & Permissions

- **CEO**: Full access to all features
- **HR Manager**: Employee management, evaluations, payroll, settings
- **Team Lead**: Team member management, evaluations, limited reporting
- **Employee**: Personal profile, leave requests, evaluations, payslips

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team.