<!--
generated_by: tessera
source_sha: bc78af7064a3d137a4edb9e8baf5be9aa95c410b
generated_at: 2026-04-07T12:46:47.998Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employees, projects, evaluations, policies, and more through an intuitive web interface.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles, onboarding, and organizational structure
- **Project Management**: Track projects, assign team members, and manage client relationships
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback
- **HR Policies**: Rich text policy documents with full formatting capabilities
- **Financial Management**: Invoice generation, expense tracking, and loan management
- **Attendance & Leave**: Time tracking and holiday management

### User Roles & Permissions
- **CEO**: Full system access
- **HR Manager**: Employee management, evaluations, policies, settings
- **Finance Manager**: Financial operations, invoices, expenses
- **Team Lead**: Project management, team evaluations
- **Employee**: Personal dashboard, evaluations, policies

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS with custom design system
- **Rich Text Editing**: Tiptap editor
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
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
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations located in `supabase/migrations/`. Run these migrations in your Supabase project to set up the required database schema.

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
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
│   ├── settings/       # Settings page components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── integrations/       # External service integrations
└── ...
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **EvaluationTimeline**: Displays evaluation history with filtering
- **RichTextEditor**: Full-featured editor for HR policies
- **SearchableEmployeeSelect**: Employee selection component with search
- **BeudoxLogo**: Brand logo component with variants

## API Integration

The application integrates with Supabase for:
- User authentication and authorization
- Real-time data synchronization
- File storage for avatars and documents
- Database operations via auto-generated TypeScript types

## Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# E2E testing with Playwright
npx playwright test
```

## Development Guidelines

- **Code Style**: ESLint configuration with TypeScript rules
- **Component Library**: Use shadcn/ui components for consistency
- **State Management**: React Query for server state, local component state for UI
- **Type Safety**: Full TypeScript coverage with strict mode
- **Accessibility**: Built on Radix UI primitives for accessibility

## Contributing

1. Follow the existing code style and component patterns
2. Ensure TypeScript types are properly defined
3. Test components and functionality
4. Update documentation as needed

## License

This project is private and proprietary to Beudox.