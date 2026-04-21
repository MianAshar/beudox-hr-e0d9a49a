<!--
generated_by: tessera
source_sha: e04aecde5ab46a80a517ec8e335e3f1de4382b8f
generated_at: 2026-04-21T10:59:09.226Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies, designed to streamline HR operations for organizations of all sizes.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and offboarding
- **Attendance Tracking**: Automated attendance monitoring with check-in/check-out, overtime calculation, and reporting
- **Leave Management**: Comprehensive leave request system with multiple leave types, balances, and approval workflows
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and payslip generation
- **Performance Evaluations**: Regular and daily evaluation systems for employee performance tracking

### Administrative Features
- **Organization Settings**: Configure departments, roles, company information, and HR policies
- **Project Management**: Track projects, assign team members, and monitor project activities
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage client invoices with PDF export
- **Finance Dashboard**: Overview of financial metrics and summaries

### User Experience
- **Role-Based Access Control**: Granular permissions system ensuring users only access authorized features
- **Responsive Design**: Modern, mobile-friendly interface built with shadcn/ui components
- **Real-time Notifications**: Toast notifications and activity tracking
- **Search & Filtering**: Advanced search capabilities across employees, projects, and other entities

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data fetching and caching

### UI & Styling
- **shadcn/ui** - High-quality React components built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library

### Backend & Database
- **Supabase** - Open source Firebase alternative
  - PostgreSQL database
  - Authentication & authorization
  - Real-time subscriptions
  - Edge functions for serverless compute
  - File storage

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing
- **TypeScript** - Type checking

## Getting Started

### Prerequisites
- **Node.js** 18+ and npm/bun
- **Supabase** account and project

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
   
   Copy the environment file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations for database schema. The migrations are located in `supabase/migrations/` and will be applied automatically when you run the Supabase CLI commands.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
# or
bun run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/ # Employee profile specific components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Key Components

### Authentication & Authorization
- JWT-based authentication via Supabase Auth
- Role-based access control with granular permissions
- Protected routes with automatic redirects

### Data Management
- TanStack Query for server state management
- Optimistic updates and caching
- Real-time data synchronization

### Forms & Validation
- React Hook Form for form management
- Zod schemas for validation
- Rich text editing with Tiptap

## API Integration

The application integrates with Supabase for all backend operations:

- **Authentication**: User login, registration, password reset
- **Database**: CRUD operations on all entities
- **File Storage**: Document uploads and management
- **Edge Functions**: Server-side processing (payroll generation, PDF creation, notifications)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses ESLint for code linting and follows TypeScript strict mode for type safety. All components are built with accessibility in mind using Radix UI primitives.

### Testing

Unit tests are written with Vitest and React Testing Library. End-to-end tests use Playwright for comprehensive testing coverage.

## Deployment

The application can be deployed to any static hosting service that supports SPAs:

- **Vercel** - Recommended for React applications
- **Netlify** - Alternative static hosting
- **Supabase** - Can host both frontend and backend

Ensure environment variables are configured in your deployment platform.

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

For support or questions, please contact the development team.