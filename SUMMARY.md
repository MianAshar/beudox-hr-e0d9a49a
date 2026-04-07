<!--
generated_by: tessera
source_sha: c146e39c807c2d7590e3e1eb1fcb10f3b06bbef7
generated_at: 2026-04-07T11:17:15.541Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Beudox HR** is a comprehensive Human Resources Management System implemented as a modern React/TypeScript frontend application. The codebase consists of 152 files (1424KB) with primary focus on TypeScript development.

## Key Findings

### Application Architecture
- **Frontend Framework**: React 18 with TypeScript, built using Vite for fast development
- **UI System**: shadcn/ui component library (40+ components) built on Radix UI primitives with Tailwind CSS styling
- **Routing**: React Router DOM with protected routes and role-based access control
- **State Management**: TanStack React Query for server state, React Context for client state
- **Backend Integration**: Supabase (PostgreSQL, authentication, real-time, file storage)

### Core Features Identified
1. **Employee Management**: Complete CRUD operations with profile management
2. **Performance Evaluations**: Dual system (quarterly formal reviews + daily feedback)
3. **Project Management**: Project tracking with client associations and team assignments
4. **Invoice Management**: Billing system with PDF generation capabilities
5. **HR Policies**: Rich text document management using TipTap editor
6. **Settings Management**: Company, department, role, and attendance configuration
7. **Public Holidays**: Organizational holiday schedule management

### Technical Stack Analysis
- **Languages**: 113 TypeScript files, 14 SQL migrations, 6 JSON configs
- **Key Dependencies**: React ecosystem, Supabase client, Radix UI components, TanStack Query
- **Build Tools**: Vite with SWC compiler, ESLint, Vitest for testing
- **Development Tools**: Playwright for E2E testing, Tailwind for styling

### Security & Access Control
- **Role-Based Permissions**: 4-tier hierarchy (employee → team_lead → hr_manager → ceo)
- **Route Protection**: ProtectedRoute component with authentication and authorization checks
- **Database Security**: Supabase Row Level Security (RLS) policies
- **Authentication**: Supabase Auth with email/password and magic link support

## Architectural Insights

### Component Architecture
- **Modular Design**: Components organized by feature (evaluations, hr-policies, settings)
- **Reusable UI Library**: 40+ shadcn/ui components for consistent design
- **Layout System**: AppLayout with collapsible sidebar and top navigation
- **Composition Pattern**: Higher-order components for shared functionality

### Data Management
- **Server State**: React Query for API calls, caching, and synchronization
- **Real-time Updates**: Supabase subscriptions for live data updates
- **Form Handling**: React Hook Form with Zod validation schemas
- **File Storage**: Supabase Storage for profile pictures and documents

### Code Quality Patterns
- **TypeScript**: Strict typing throughout the application
- **Custom Hooks**: Business logic extraction (useAuth, useToast)
- **Utility Functions**: Pure functions for data transformation and formatting
- **Path Aliases**: `@/` for clean imports and better developer experience

## Important Files & Structure

### Entry Points
- `src/main.tsx` - React application bootstrap
- `src/App.tsx` - Main routing and provider setup
- `src/pages/Index.tsx` - Application root (misclassified in CodeIndex as Next.js)

### Core Components
- `src/components/layout/AppLayout.tsx` - Main application wrapper
- `src/components/evaluations/EvaluationTimeline.tsx` - Complex evaluation display logic
- `src/components/hr-policies/RichTextEditor.tsx` - TipTap integration
- `src/components/ui/` - Complete shadcn/ui component library

### Configuration Files
- `vite.config.ts` - Build configuration with development optimizations
- `package.json` - Comprehensive dependency management
- `tailwind.config.ts` - Design system configuration
- `.env` - Supabase environment variables

### Database Integration
- `supabase/migrations/` - 14 SQL migration files defining complete schema
- `src/integrations/supabase/` - Client configuration and type definitions

## Business Logic Insights

### Evaluation System
- **Dual Evaluation Types**: Quarterly (formal) and daily (peer feedback)
- **Visibility Controls**: Role-based access to evaluation data and recommendations
- **Scoring System**: 1-5 star rating with directional feedback
- **Timeline View**: Unified display of all evaluation history

### Permission Model
- **Hierarchical Roles**: Progressive access levels with specific capabilities
- **Route Guards**: Automatic redirection based on user permissions
- **Component Guards**: Feature-level access control within pages
- **Data Filtering**: Query-level filtering based on user roles

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Proper loading indicators and skeleton screens
- **Error Handling**: Toast notifications for user feedback
- **Accessibility**: Radix UI primitives ensure WCAG compliance

## Development Environment

### Local Development
- **Port**: 8080 (configured in vite.config.ts)
- **Hot Reload**: Vite's fast refresh for instant updates
- **Component Tagging**: Development tool for component identification
- **Path Resolution**: `@` alias for src directory

### Build Process
- **Optimization**: Vite's production build with tree-shaking
- **Asset Handling**: Automatic optimization of images and fonts
- **Bundle Splitting**: Code splitting for better performance
- **Type Checking**: TypeScript compilation with strict checks

This analysis reveals a well-architected, modern React application with strong emphasis on type safety, user experience, and scalable architecture. The codebase demonstrates best practices in component design, state management, and integration with modern backend services.