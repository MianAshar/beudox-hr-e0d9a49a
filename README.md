<!--
generated_by: tessera
source_sha: 57916dea765f7842719cc653be4eca1e09745835
generated_at: 2026-04-01T09:45:14.978Z
action: update
-->

# Beudox HR

Beudox HR is a comprehensive Human Resources management system built as a modern React application. It provides tools for managing employees, projects, clients, attendance, payroll, and other HR functions in a user-friendly web interface.

## Features

- **Employee Management**: Add, edit, and view employee profiles
- **Project Management**: Create and manage projects with client associations
- **Client Management**: Maintain client information and relationships
- **Attendance Tracking**: Monitor employee attendance and public holidays
- **Payroll Management**: Handle salary and financial operations
- **Role-Based Access Control**: Secure access based on user roles
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + Auth)
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

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
   Copy `.env` and update the Supabase configuration with your project credentials.

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, AppSidebar, TopBar)
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication

The application uses Supabase Auth for user authentication. Users can log in with email and password, and access is controlled based on their assigned roles.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Update documentation as needed

## License

This project is private and proprietary to Beudox.