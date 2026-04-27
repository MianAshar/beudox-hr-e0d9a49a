<!--
generated_by: tessera
source_sha: 8b43983087baf01c7a020f61a68274eaa48f5634
generated_at: 2026-04-27T23:25:20.637Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources management application built with React, TypeScript, and Supabase. This frontend application provides a modern web interface for managing employee data, attendance tracking, leave requests, payroll processing, and more.

## Features

- **Employee Management**: Profile management, role-based access control
- **Attendance Tracking**: Upload and manage attendance records with AI-powered parsing
- **Leave Management**: Request, approve, and track leave balances
- **Payroll Processing**: Generate payroll reports and manage salary information
- **Project Management**: Team assignments and project activity tracking
- **Settings Management**: Company configuration, departments, roles, and policies
- **Notifications**: Real-time notifications and preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library with shadcn/ui
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **Authentication**: Supabase Auth
- **State Management**: React hooks and context
- **Testing**: Vitest for unit tests

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

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

3. Copy environment variables:
   ```bash
   cp .env .env.local
   ```

4. Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── projects/       # Project management components
│   ├── settings/       # Settings and configuration components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── test/               # Test files
```

## Key Components

### Core UI Components
- `BeudoxLogo`: Brand logo component with variant support
- `NavLink`: Enhanced navigation link with active state styling
- `SearchableEmployeeSelect`: Employee selection with search functionality

### Feature Components
- `AttendanceUploadFlow`: Complex attendance data upload with AI parsing
- `MandatoryPasswordChange`: Secure password reset modal
- `AppLayout`: Main application layout with sidebar navigation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Vitest for unit testing

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure TypeScript types are properly defined

## License

This project is proprietary software. All rights reserved.