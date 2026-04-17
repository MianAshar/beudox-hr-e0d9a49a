<!--
generated_by: tessera
source_sha: 008c102d0cabb918fb1de501c61abdbf3fe6aa56
generated_at: 2026-04-17T22:45:57.358Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and organizational workflows for businesses of all sizes.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions system with CEO, HR Manager, Team Lead, and Employee roles
- **Company Settings**: Configure departments, roles, leave types, expense categories, and evaluation parameters

### Performance & Development
- **Quarterly Evaluations**: Structured performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with filtering and visibility controls

### Time & Attendance
- **Leave Management**: Comprehensive leave request and approval workflow
- **Public Holidays**: Configurable holiday calendar management
- **Attendance Tracking**: Integration with payroll and leave calculations

### Financial Management
- **Payroll Processing**: Automated payroll generation with allowances and deductions
- **Invoice Management**: Client invoicing with PDF generation and email delivery
- **Expense Categories**: Configurable expense tracking and approval workflows
- **Finance Dashboard**: Financial overview and reporting

### Project & Client Management
- **Project Tracking**: Project lifecycle management with team assignments
- **Client Management**: Client relationship and contract management
- **Resource Allocation**: Employee assignment to projects and tasks

### Communication & Policies
- **HR Policies**: Rich text policy documents with version control
- **Notifications**: Automated notifications for approvals, deadlines, and updates
- **Document Management**: Secure storage and access to HR documents

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **React Query** for efficient server state management
- **React Hook Form** with Zod validation for robust form handling

### UI & Design
- **Radix UI** components for accessible, customizable UI primitives
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **Custom Design System** with Syne and DM Sans fonts
- **Responsive Design** optimized for desktop and mobile

### Backend & Database
- **Supabase** for backend-as-a-service
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions
  - Built-in authentication and authorization
  - File storage for documents and images
  - Edge functions for server-side logic

### Rich Content & Data
- **TipTap** rich text editor for policy documents
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **XLSX** for Excel file processing
- **React Image Crop** for profile picture management

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** with TypeScript rules
- **Prettier** for code formatting

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
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
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   
   Copy the environment file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   Alternatively, if using Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npx playwright test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── evaluations/    # Evaluation-specific components
│   ├── hr-policies/    # Policy management components
│   ├── leave/          # Leave management components
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Authentication & Authorization

The application uses Supabase Auth with Row Level Security (RLS) policies to ensure data security. Users are assigned roles that determine their access to different features:

- **CEO**: Full access to all features and data
- **HR Manager**: Access to HR functions, employee management, and sensitive data
- **Team Lead**: Access to team management and evaluations
- **Employee**: Access to personal data and basic functions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.