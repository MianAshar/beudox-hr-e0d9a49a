<!--
generated_by: tessera
source_sha: ffa5d56cfc01cd8b190e033eee4d9a5fa4cb9fa4
generated_at: 2026-03-29T22:27:11.957Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Overview

Beudox HR is a modern Human Resources management web application built with React, TypeScript, and Supabase. The codebase represents a well-structured Single Page Application (SPA) designed for managing employee data, attendance, payroll, and other HR functions.

## Key Architectural Insights

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript for type safety
- **Build System**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS combined with shadcn/ui component library
- **Routing**: React Router DOM with protected routes
- **State Management**: React Query for server state, custom hooks for local state
- **Backend**: Supabase (PostgreSQL database, authentication, real-time features)

### Application Structure
The application follows a clear separation of concerns:
- **Components**: Reusable UI components organized by type (layout, ui)
- **Pages**: Feature-specific page components
- **Hooks**: Custom React hooks for business logic
- **Integrations**: External service configurations (Supabase)
- **Lib**: Utility functions and helpers

### Layout System
- **AppLayout**: Provides the main application structure with sidebar and content area
- **AppSidebar**: Collapsible navigation with organized menu sections (MAIN, PEOPLE, FINANCE, WORK, SYSTEM)
- **TopBar**: Dynamic header displaying current page titles

## Important Files and Their Roles

### Core Application Files
- `src/App.tsx`: Main application component handling routing, authentication, and global providers
- `src/main.tsx`: Application entry point and React root rendering

### Layout Components
- `src/components/layout/AppLayout.tsx`: Main layout wrapper
- `src/components/layout/AppSidebar.tsx`: Navigation sidebar with menu items
- `src/components/layout/TopBar.tsx`: Page header component

### Authentication & Data
- `src/hooks/useAuth.tsx`: Authentication state management
- `src/integrations/supabase/client.ts`: Supabase client setup
- `src/integrations/supabase/types.ts`: Database type definitions

### UI Components
- Extensive shadcn/ui component library (40+ components)
- `src/components/BeudoxLogo.tsx`: Custom logo component with variants
- `src/components/NavLink.tsx`: Enhanced navigation link component

## Current Implementation Status

### Implemented Features
- User authentication (login, password reset, protected routes)
- Employee management (list, view, add, edit)
- Dashboard overview
- Responsive layout with collapsible sidebar
- Toast notifications and loading states

### Navigation Structure Indicates
The sidebar navigation suggests additional planned features:
- Attendance tracking
- Public holidays management
- Leave management
- Payroll and finance
- Project management
- HR policies
- Notifications and settings

## Database & Backend Insights

### Supabase Integration
- Authentication handled via Supabase Auth
- Database schema managed through migrations in `supabase/migrations/`
- Edge functions for serverless operations (e.g., employee invitations)
- Real-time capabilities available through Supabase subscriptions

### Configuration
- Environment variables for Supabase configuration
- TypeScript configuration for type checking
- ESLint for code quality
- Playwright for end-to-end testing

## Development Workflow

### Available Scripts
- `npm run dev`: Development server
- `npm run build`: Production build
- `npm run test`: Unit testing with Vitest
- `npm run lint`: Code linting

### Testing Setup
- Unit tests configured with Vitest and React Testing Library
- E2E tests configured with Playwright
- Example test file present in `src/test/`

## Notable Patterns & Decisions

### Component Architecture
- Uses shadcn/ui for consistent, accessible UI components
- Custom hooks for reusable logic (authentication, toasts)
- Utility functions for common operations (class name merging)

### Routing Strategy
- Protected routes with authentication checks
- Dynamic routing for employee profiles and editing
- Loading states and redirects handled at route level

### Styling Approach
- Utility-first CSS with Tailwind
- CSS variables for theming (--ff-display, --ff-body)
- Responsive design with mobile considerations

## Areas for Future Development

Based on the navigation structure and current implementation:
- Implementation of attendance, leave, and payroll features
- Completion of dashboard with meaningful metrics
- Addition of finance and project management modules
- Enhancement of notification system
- Expansion of HR policy management

## Code Quality Observations

- Well-organized file structure
- Consistent use of TypeScript
- Proper separation of concerns
- Use of modern React patterns (hooks, functional components)
- Comprehensive UI component library
- Proper error handling and loading states

This analysis provides a foundation for understanding the Beudox HR application's architecture and current state, enabling effective development and maintenance of the codebase.