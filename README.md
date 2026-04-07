<!--
generated_by: tessera
source_sha: b4b241cfd7371f23914eb092aaa2d645364c636e
generated_at: 2026-04-07T21:23:43.753Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management platform built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, payroll processing, project tracking, and organizational workflows.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Role-Based Access Control**: Granular permissions system with multiple user roles (CEO, HR Manager, Team Lead, Employee)
- **Company Settings**: Configure departments, roles, evaluation parameters, and expense categories

### Performance & Evaluations
- **Quarterly Evaluations**: Structured performance reviews with scoring and recommendations
- **Daily Evaluations**: Real-time feedback system for continuous improvement
- **Evaluation Timeline**: Historical view of all evaluations with filtering and visibility controls

### Financial Management
- **Payroll Processing**: Automated payroll generation with attendance tracking
- **Invoice Management**: Client invoicing with PDF generation and email delivery
- **Loan Management**: Employee loan tracking and management
- **Expense Categories**: Configurable expense tracking for reimbursement

### Project & Client Management
- **Project Tracking**: Full project lifecycle management with team assignments
- **Client Management**: Client relationship management with detailed profiles
- **Time Tracking**: Integration with attendance and payroll systems

### Policy & Compliance
- **HR Policies**: Rich text policy documents with version control
- **Public Holidays**: Configurable holiday calendar management
- **Document Management**: Secure document storage and access

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **React Query** for efficient server state management
- **shadcn/ui + Radix UI** for accessible, customizable components
- **Tailwind CSS** for utility-first styling
- **Tiptap** for rich text editing
- **React Hook Form + Zod** for robust form handling and validation

### Backend & Database
- **Supabase** for backend-as-a-service
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions
  - Built-in authentication
  - File storage
  - Edge functions for business logic

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** for code quality
- **TypeScript** for type checking

### UI/UX
- **Custom Design System**: Beudox-branded components with consistent theming
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: WCAG compliant components
- **Dark/Light Mode**: Theme switching capability

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
   
   Copy the environment template:
   ```bash
   cp .env .env.local
   ```
   
   Configure your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.
   
   Key tables include:
   - `companies` - Company information
   - `employees` - Employee records
   - `roles` - User roles and permissions
   - `evaluations` - Performance reviews
   - `daily_evaluations` - Daily feedback
   - `projects` - Project management
   - `invoices` - Client invoicing
   - `payroll` - Payroll records

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # App layout components
│   ├── settings/       # Settings page components
│   └── evaluations/    # Evaluation components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Key Components

### Authentication Flow
- Email/password authentication with Supabase Auth
- Password reset and account recovery
- Role-based route protection
- Session management with automatic refresh

### Data Management
- React Query for caching and synchronization
- Optimistic updates for better UX
- Real-time subscriptions for live data
- Type-safe database operations

### Form Handling
- React Hook Form for performance
- Zod schemas for validation
- Accessible form components
- File upload with image cropping

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Prettier for code formatting
- Husky for git hooks

### Testing
- Unit tests with Vitest
- E2E tests with Playwright
- Component testing with React Testing Library

## Deployment

The application is designed to be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist/` directory to your hosting provider
3. Configure environment variables in your hosting platform

### Recommended Hosting
- Vercel
- Netlify
- AWS S3 + CloudFront
- Supabase Hosting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team or create an issue in the repository.