<!--
generated_by: tessera
source_sha: 83430515e9679ae4c565139e6e663f8456523b62
generated_at: 2026-03-27T03:27:41.067Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management system designed to streamline employee management, attendance tracking, payroll processing, and organizational workflows. Built as a modern web application, it provides HR professionals and managers with powerful tools to manage workforce data efficiently.

## Features

- **Employee Management**: Comprehensive employee profiles and data management
- **Attendance Tracking**: Monitor employee attendance and time tracking
- **Leave Management**: Handle vacation requests, sick leave, and public holidays
- **Payroll Processing**: Calculate salaries, manage loans, and track expenses
- **Project Management**: Oversee projects, evaluations, and HR policies
- **Finance Management**: Financial sheets, office expenses, and outsourcing
- **Notifications & Settings**: System notifications and configuration

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Authentication & Database**: Supabase
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

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
   
   Copy the `.env` file and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

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
│   └── ui/              # Reusable UI components (shadcn/ui)
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations (Supabase)
├── lib/                 # Utility functions
├── pages/               # Route components
└── test/                # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.