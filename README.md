<!--
generated_by: tessera
source_sha: 1c9de42dc72a4cebfec5dfc58d7831f5a6a6d842
generated_at: 2026-03-27T03:01:51.241Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application built with modern web technologies. It provides a centralized platform for managing employee data, attendance, leave, payroll, finance, projects, and HR policies.

## Features

### People Management
- Employee profiles and information
- Attendance tracking
- Public holidays management
- Leave management system

### Finance & Payroll
- Payroll processing
- Financial reporting and sheets
- Loan management
- Office expenses tracking
- Outsourcing management

### Work Management
- Project tracking
- Employee evaluations
- HR policies documentation

### System Features
- Notifications system
- User settings
- Authentication and authorization

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with Testing Library
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn or bun package manager

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
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   
   Copy the `.env` file and update the Supabase configuration with your own project credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (AppLayout, AppSidebar, TopBar)
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── BeudoxLogo.tsx   # Logo component
│   └── NavLink.tsx      # Navigation link wrapper
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations (Supabase)
├── lib/                 # Utility functions
├── pages/               # Page components
└── test/                # Test files
```

## Authentication

The application uses Supabase for authentication. Users can log in, reset passwords, and access protected routes based on their session.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.