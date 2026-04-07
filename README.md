<!--
generated_by: tessera
source_sha: 2403c41076bab5248cc9861adb3d1a403b8cf2fa
generated_at: 2026-04-07T22:38:04.596Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, payroll processing, performance evaluations, and organizational workflows.

## Features

### Core HR Management
- **Employee Profiles**: Complete employee information management with roles, departments, and contact details
- **Attendance Tracking**: Automated attendance recording with import capabilities and overtime calculations
- **Payroll Processing**: Automated salary calculations including allowances, overtime, and deductions
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Leave Management**: Comprehensive leave request and approval workflow

### Project & Client Management
- **Project Management**: Project creation, assignment, and tracking with deadlines and priorities
- **Client Management**: Client information, billing details, and project associations
- **Invoice Generation**: Automated invoice creation with payment tracking

### Financial & Administrative
- **Expense Tracking**: Office and employee expense management with approval workflows
- **Loan Management**: Employee loan processing and monthly deduction tracking
- **HR Policies**: Rich text policy documents with version control
- **Notifications**: Automated notifications for approvals, deadlines, and updates

### Security & Access Control
- **Role-Based Access**: Granular permissions based on user roles (CEO, HR Manager, Team Lead, Employee)
- **Multi-Company Support**: Isolated data per company with company-specific settings
- **Secure Authentication**: Supabase-powered authentication with email/password

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling and responsive design
- **React Query** for server state management
- **React Hook Form** with Zod validation for forms
- **Tiptap** rich text editor for policy documents
- **Recharts** for data visualization
- **date-fns** for date manipulation

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)
- **Row Level Security (RLS)** for data access control
- **Real-time subscriptions** for live updates
- **File storage** for documents, receipts, and avatars

### Development Tools
- **ESLint** for code linting
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **TypeScript** for type checking

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
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
   
   Alternatively, if you have the Supabase CLI installed:
   ```bash
   supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── settings/       # Settings page components
│   ├── evaluations/    # Evaluation-related components
│   ├── hr-policies/    # HR policy components
│   └── ...
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
├── test/               # Test files
└── main.tsx           # Application entry point
```

## Key Components

### Authentication Flow
- Login/Registration with email verification
- Password reset functionality
- Role-based route protection
- Automatic redirects based on authentication state

### Data Management
- React Query for caching and synchronization
- Optimistic updates for better UX
- Real-time data updates via Supabase subscriptions

### Form Handling
- Type-safe forms with React Hook Form
- Zod schemas for validation
- File uploads for documents and images

## API Integration

The application integrates with Supabase for:
- **Authentication**: User login, registration, and session management
- **Database**: PostgreSQL with 40+ tables for comprehensive HR data
- **Storage**: File uploads for avatars, receipts, and documents
- **Edge Functions**: Server-side processing for payroll calculations and email sending

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npx playwright test
```

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.