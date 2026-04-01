<!--
generated_by: tessera
source_sha: d679fb7f86bfadeec60e21b6cb516592e3d6b811
generated_at: 2026-04-01T09:27:56.860Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application designed to streamline employee management, project tracking, and organizational operations. Built as a modern web application, it provides role-based access to various HR functions including employee profiles, attendance tracking, payroll management, project oversight, and more.

## Features

### Core Functionality
- **Dashboard**: Overview of key HR metrics and activities
- **Employee Management**: Complete CRUD operations for employee records, including profiles, roles, and organizational structure
- **Attendance & Leave**: Track employee attendance and manage leave requests
- **Payroll & Finance**: Handle payroll processing, expense tracking, and financial reporting
- **Project Management**: Create and manage projects, assign team members, and track progress
- **Client Management**: Maintain client relationships and project associations
- **HR Policies**: Access and manage company policies and procedures
- **Settings**: System configuration and user preferences

### Security & Access
- Role-based access control with granular permissions
- Secure authentication via Supabase
- Protected routes with automatic redirects

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or bun package manager
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
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory to set up your database schema.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components and routes
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application uses Supabase for authentication and implements role-based access control:

- Authentication is handled via Supabase Auth
- User roles determine access to different sections of the application
- Protected routes automatically redirect unauthorized users
- Password reset and invitation flows are supported

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Beudox.