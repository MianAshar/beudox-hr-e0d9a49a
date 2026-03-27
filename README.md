<!--
generated_by: tessera
source_sha: 4507847a31943b1e146942fce5377c9e1baf985e
generated_at: 2026-03-27T02:51:05.609Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application built as a modern web frontend. It provides tools for managing employees, attendance, payroll, leave management, and other HR-related functions.

## Features

- **Dashboard**: Overview of HR metrics and activities
- **Employee Management**: Manage employee information and profiles
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests and leave policies
- **Payroll Processing**: Manage salary calculations and payments
- **Finance Management**: Track expenses, loans, and financial data
- **Project Management**: Oversee HR-related projects and evaluations
- **HR Policies**: Document and manage company policies
- **Notifications**: System notifications and alerts
- **Settings**: Application configuration

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL database, authentication, real-time features)
- **UI Components**: Custom component library with shadcn/ui-inspired design
- **Testing**: Vitest and Playwright for unit and E2E testing
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

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
   - Copy `.env` file and update the Supabase configuration if needed
   - The app uses Supabase for backend services

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   └── ...             # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is private and proprietary.