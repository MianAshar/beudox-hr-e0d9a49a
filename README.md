<!--
generated_by: tessera
source_sha: ffa5d56cfc01cd8b190e033eee4d9a5fa4cb9fa4
generated_at: 2026-03-29T22:27:11.957Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management application built as a modern web application. It provides tools for managing employees, attendance, payroll, leave management, and other HR-related functionalities.

## Features

- **Employee Management**: Add, view, and edit employee profiles
- **Dashboard**: Overview of key HR metrics and activities
- **Attendance Tracking**: Monitor employee attendance
- **Leave Management**: Handle employee leave requests and approvals
- **Payroll Processing**: Manage salary calculations and payments
- **Finance Management**: Track expenses, loans, and financial data
- **Project Management**: Organize and track HR-related projects
- **HR Policies**: Maintain and distribute company policies
- **Notifications**: System-wide notification management
- **Settings**: Configure application preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Authentication & Database**: Supabase
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest and Playwright

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

5. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code linting
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
├── lib/                # Utility functions
└── test/               # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.