<!--
generated_by: tessera
source_sha: 5a2d080405f8bed73410566f539c7603e2229b45
generated_at: 2026-04-17T22:20:33.491Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies. Beudox HR streamlines employee management, payroll, evaluations, leave tracking, and organizational workflows for businesses.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Leave Management**: Request, approve, and track various leave types
- **Payroll Processing**: Automated payroll generation with payslip distribution
- **Performance Evaluations**: Quarterly and daily evaluation systems
- **HR Policies**: Rich text policy documents with version control

### Business Operations
- **Project Management**: Track projects, assign team members, monitor progress
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices
- **Loan Management**: Track employee loans and repayments
- **Finance Dashboard**: Comprehensive financial overview and reporting

### Administrative Tools
- **Settings Management**: Configure company settings, departments, roles, and policies
- **Public Holidays**: Manage company-wide holiday schedules
- **Role-Based Access Control**: Granular permissions system
- **Notifications**: Automated email notifications for key events

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library built on Radix UI primitives
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation for forms

### Backend & Infrastructure
- **Supabase** for database, authentication, and serverless functions
- **PostgreSQL** database with real-time capabilities
- **Supabase Auth** for secure user authentication
- **Supabase Edge Functions** for server-side logic

### Additional Libraries
- **TipTap** for rich text editing
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **Lucide React** for icons
- **xlsx** for Excel file handling

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Copy the environment template and configure:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Development Server**
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
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── [feature]/      # Feature-specific components
│   └── BeudoxLogo.tsx  # Logo component
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

## Key Components

### Authentication & Authorization
- Role-based access control with granular permissions
- Secure authentication via Supabase Auth
- Password reset and employee invitation flows

### Data Management
- Real-time data synchronization with Supabase
- Optimistic updates with TanStack Query
- Comprehensive error handling and loading states

### User Interface
- Responsive design with mobile-first approach
- Dark/light theme support
- Accessible components following WCAG guidelines
- Consistent design system with shadcn/ui

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses:
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **Testing Library** for component testing

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)

## Deployment

The application is designed to be deployed as a static site. Build the project and deploy the `dist/` directory to any static hosting service like Vercel, Netlify, or Cloudflare Pages.

Ensure your Supabase project allows CORS from your deployment domain.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.