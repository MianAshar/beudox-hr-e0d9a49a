<!--
generated_by: tessera
source_sha: c146e39c807c2d7590e3e1eb1fcb10f3b06bbef7
generated_at: 2026-04-07T11:17:15.541Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR streamlines employee management, performance evaluations, project tracking, and organizational operations.

## Features

### Core HR Functionality
- **Employee Management**: Complete CRUD operations for employee records, profiles, and organizational hierarchy
- **Performance Evaluations**: Quarterly and daily evaluation systems with detailed feedback and scoring
- **HR Policies**: Rich text policy documents with full formatting capabilities
- **Role-Based Access Control**: Granular permissions for employees, team leads, HR managers, and CEOs

### Project & Client Management
- **Project Tracking**: Create, manage, and track project progress with team assignments
- **Client Management**: Maintain client relationships and project associations
- **Invoice Management**: Generate and manage project invoices with PDF export

### Organizational Tools
- **Settings Management**: Configure company details, departments, roles, and attendance policies
- **Public Holidays**: Manage organizational holiday schedules
- **Dashboard**: Centralized view of key metrics and recent activities

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router DOM** for client-side routing with protected routes
- **Tailwind CSS** for responsive, utility-first styling
- **shadcn/ui** component library built on Radix UI primitives

### State Management & Data
- **TanStack React Query** for server state management and caching
- **Supabase** for backend services (PostgreSQL database, authentication, real-time)
- **React Hook Form** with Zod validation for robust form handling

### Rich Content & UI
- **TipTap** rich text editor for policy documents
- **Recharts** for data visualization
- **Lucide React** for consistent iconography
- **React Image Crop** for profile picture management

### Development & Testing
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **ESLint** with TypeScript support for code quality

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
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
   
   Copy the environment template and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your Supabase project details:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start Development Server**
   ```bash
   npm run dev
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
│   ├── layout/         # Layout components (AppLayout, Sidebar, TopBar)
│   ├── evaluations/    # Evaluation-specific components
│   ├── hr-policies/    # Policy management components
│   └── settings/       # Settings page components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Authentication & Authorization

The application implements role-based access control with the following roles:

- **Employee**: Basic access to personal profile and limited evaluations
- **Team Lead**: Can view team member evaluations and manage team projects
- **HR Manager**: Full access to employee management, evaluations, and settings
- **CEO**: Complete system access including sensitive operations

## API Integration

Beudox HR integrates with Supabase for:
- User authentication and session management
- Real-time data synchronization
- File storage for profile pictures and documents
- Serverless functions for email notifications and PDF generation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

### Code Quality

The project uses ESLint with TypeScript support and follows React best practices. All components are typed with TypeScript for better developer experience and runtime safety.

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Ensure all linting passes
4. Test across different screen sizes for responsive design

## License

This project is proprietary software. All rights reserved.