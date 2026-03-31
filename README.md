<!--
generated_by: tessera
source_sha: b539e0ef426dc79227432acc6263ba638f91abbe
generated_at: 2026-03-31T22:19:56.145Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources management application built with modern web technologies.

## Overview

Beudox HR is a full-featured HR management system designed to streamline employee management, attendance tracking, payroll processing, and organizational workflows. The application provides role-based access control and a user-friendly interface for managing various HR functions.

## Features

### Core Modules

- **Dashboard**: Overview of key HR metrics and activities
- **People Management**:
  - Employee profiles and management
  - Attendance tracking
  - Public holidays management
  - Leave management system
- **Finance**:
  - Payroll processing
  - Financial reporting
  - Loan management
  - Office expenses tracking
  - Outsourcing management
- **Work Management**:
  - Project management
  - Employee evaluations
  - HR policies documentation
- **System**:
  - Notifications
  - System settings

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Testing**: Vitest, Playwright
- **Code Quality**: ESLint

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
   ```

3. Set up environment variables:
   
   Copy `.env` and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

The application uses Supabase for data storage. Database migrations are located in `supabase/migrations/`.

### Testing

Run unit tests:
```bash
npm run test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (shadcn/ui)
│   ├── layout/       # Layout components (AppLayout, AppSidebar, TopBar)
│   └── BeudoxLogo.tsx # Logo component
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── integrations/     # External service integrations (Supabase)
└── test/             # Test files

supabase/
├── functions/        # Edge functions for serverless operations
├── migrations/       # Database schema migrations
└── config.toml       # Supabase configuration
```

## Authentication & Authorization

The application uses Supabase authentication with role-based access control. Employee roles determine access to different sections of the application.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PRs

## License

This project is proprietary software owned by Beudox.