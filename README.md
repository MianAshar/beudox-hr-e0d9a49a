<!--
generated_by: tessera
source_sha: 9a53aff35a3b0098be861aa00c86917edd260b64
generated_at: 2026-04-07T11:45:42.666Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, project tracking, invoicing, and HR policy administration for organizations.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Project Management**: Track projects, assign team members, and monitor progress
- **Client & Invoice Management**: Manage client relationships and generate invoices
- **HR Policies**: Create and manage company policies with rich text editing
- **Loan Management**: Track employee loans and repayments
- **Settings**: Configure company information, departments, roles, and evaluation parameters

### User Experience
- **Role-Based Access Control**: Different permissions for employees, team leads, HR managers, and CEOs
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live data synchronization with Supabase
- **Intuitive UI**: Clean, modern interface built with shadcn/ui components

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **React Query** for efficient data fetching and caching
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library built on Radix UI primitives

### Backend & Database
- **Supabase** for authentication, real-time database, and serverless functions
- **PostgreSQL** database with Row Level Security (RLS)
- **Supabase Edge Functions** for business logic and integrations

### Development Tools
- **ESLint** for code linting
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **TypeScript** for type safety

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- A Supabase project (sign up at [supabase.com](https://supabase.com))

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
   
   Run the Supabase migrations to set up your database schema:
   ```bash
   # If using Supabase CLI
   supabase db push
   ```
   
   Or apply the SQL migrations manually in your Supabase dashboard from the `supabase/migrations/` directory.

5. **Start the development server**
   ```bash
   npm run dev
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
│   ├── layout/         # App layout components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions
└── config.toml         # Supabase configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Authentication & Authorization

The application uses Supabase Auth for user authentication with role-based access control:

- **Employee**: Basic access to personal data and assigned tasks
- **Team Lead**: Additional access to team member evaluations and project management
- **HR Manager**: Full HR functionality including employee management and policy administration
- **CEO**: Complete system access including company settings and financial data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Beudox.