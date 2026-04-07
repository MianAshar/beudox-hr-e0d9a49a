<!--
generated_by: tessera
source_sha: f2cefb2acc4e7e7cd2bf360280e4f2dd21435e3a
generated_at: 2026-04-07T12:36:26.731Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, project tracking, client relationships, invoicing, policy management, performance evaluations, and organizational settings.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback
- **HR Policies**: Rich text policy documents with full editing capabilities
- **Attendance & Time Tracking**: Comprehensive attendance management
- **Loan Management**: Employee loan tracking and administration

### Project & Client Management
- **Project Tracking**: Full project lifecycle management with team assignments
- **Client Relationships**: Client profiles and project associations
- **Invoice Management**: Automated invoicing with PDF generation

### Administrative Tools
- **Settings Management**: Company settings, departments, roles, and expense categories
- **Public Holidays**: Holiday calendar management
- **Role-Based Access Control**: Granular permissions system

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling with shadcn/ui component library
- **React Query** for efficient server state management

### Backend & Infrastructure
- **Supabase** for backend-as-a-service (database, authentication, storage)
- **PostgreSQL** database with real-time capabilities

### Key Libraries
- **Tiptap** for rich text editing
- **React Hook Form** with Zod validation
- **Recharts** for data visualization
- **Date-fns** for date manipulation
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy `.env` and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

4. Start the development server:
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
│   ├── settings/       # Settings-specific components
│   └── evaluations/    # Evaluation components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── types/              # TypeScript type definitions

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for business logic
```

## Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **CEO**: Full system access
- **HR Manager**: HR operations and employee management
- **Team Lead**: Team management and evaluations
- **Employee**: Limited access to own data and team information

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses:
- **Vitest** for unit testing
- **React Testing Library** for component testing
- **Playwright** for end-to-end testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary to Beudox.