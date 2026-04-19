<!--
generated_by: tessera
source_sha: a02c83f5c9df8f60820dd6a77bf50dfdd5ee30ee
generated_at: 2026-04-19T13:17:24.149Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern companies. Beudox HR streamlines employee management, performance evaluations, leave tracking, payroll processing, and financial oversight in a single, intuitive web application.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with roles, departments, and organizational structure
- **Performance Evaluations**: Bi-annual evaluations and daily feedback system with rating scales
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll calculations including overtime, bonuses, and deductions
- **Financial Dashboard**: Real-time expense tracking and financial reporting with trend analysis

### Administrative Tools
- **Company Settings**: Configure company information, departments, roles, and policies
- **Notifications System**: Automated alerts for HR events and approvals
- **Project Management**: Track employee assignments and project activity
- **Expense Management**: Categorize and monitor business expenses

### User Experience
- **Role-based Access**: Different permission levels for employees, managers, and HR administrators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live data synchronization across the application

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: Tiptap editor for policy documents

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr.git
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Copy the environment variables from `.env` or create your own Supabase project:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Database Setup**
   
   Run the Supabase migrations to set up the database schema:
   ```bash
   # If using Supabase CLI
   supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
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
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── [feature]/      # Feature-specific components
├── pages/              # Page components (Next.js style routing)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for backend logic
└── config.toml         # Supabase project configuration
```

## Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

```bash
# Run unit tests
npm run test

# Run E2E tests
npx playwright test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Beudox.