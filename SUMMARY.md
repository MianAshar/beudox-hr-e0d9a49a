<!--
generated_by: tessera
source_sha: 0750a0f91d657ac84947a7b3427876080d9d0667
generated_at: 2026-04-07T21:30:19.220Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React SPA)  
**Primary Language**: TypeScript (119 files)  
**Total Files**: 162 (1.5MB)  
**Lines of Code**: ~25,000+  

## Architecture & Technology Stack

### Core Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM v6
- **UI Framework**: Radix UI (shadcn/ui) + Tailwind CSS
- **State Management**: TanStack Query + React Context
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Build Tool**: Vite with SWC
- **Testing**: Vitest + Playwright

### Key Architectural Patterns
- **Component-Based Architecture**: Modular, reusable components
- **Protected Routes**: Authentication and role-based access control
- **Server State Management**: TanStack Query for API data
- **Custom Hooks**: Business logic abstracted into reusable hooks
- **Type Safety**: Full TypeScript coverage with strict mode

## Application Features

### HR Core Functionality
1. **Employee Management**: Complete CRUD operations with profile management
2. **Performance Evaluations**: Dual system (quarterly formal + daily feedback)
3. **Payroll Processing**: Automated salary calculation and payslip generation
4. **Project Management**: Team assignments and progress tracking
5. **Client & Invoice Management**: Billing system with PDF export
6. **HR Policies**: Rich text policy creation and management
7. **Loan Tracking**: Employee loan management
8. **Holiday Management**: Company-wide holiday scheduling

### User Roles & Permissions
- **CEO**: Full system access
- **HR Manager**: Employee and evaluation management
- **Team Lead**: Team oversight and evaluations
- **Employee**: Limited personal access

## Codebase Structure Analysis

### Directory Organization
```
src/
├── components/ (70+ components)
│   ├── ui/ (40+ shadcn/ui components)
│   ├── layout/ (AppLayout, Sidebar, TopBar)
│   ├── [feature]/ (domain-specific components)
├── pages/ (25+ route components)
├── hooks/ (custom React hooks)
├── lib/ (utilities, configs, helpers)
├── integrations/supabase/ (database client, types)
└── types/ (TypeScript definitions)
```

### Key Files & Components

#### Core Components
- `AppLayout.tsx`: Main application wrapper with navigation
- `AppSidebar.tsx`: Collapsible sidebar navigation
- `TopBar.tsx`: Header with user controls
- `EvaluationTimeline.tsx`: Performance history visualization
- `SearchableEmployeeSelect.tsx`: Employee selection component
- `RichTextEditor.tsx`: Policy editing interface

#### Configuration Files
- `vite.config.ts`: Build configuration with path aliases
- `tailwind.config.ts`: Styling with custom fonts (Outfit, DM Sans)
- `package.json`: 70+ dependencies, modern tooling

#### Authentication System
- `useAuth.ts`: Authentication context and state management
- `role-access.ts`: Permission checking logic
- Protected route wrapper with role validation

## Database Integration

### Supabase Setup
- **Database**: PostgreSQL with 18 migration files
- **Authentication**: Email/password with invite system
- **Storage**: File uploads for avatars and documents
- **Edge Functions**: Server-side PDF generation and email sending

### Data Flow Patterns
- **Queries**: TanStack Query with structured key patterns
- **Mutations**: Optimistic updates with cache invalidation
- **Real-time**: Supabase subscriptions for live updates
- **Type Safety**: Generated TypeScript types from database schema

## Development Insights

### Code Quality
- **TypeScript**: Strict configuration, comprehensive typing
- **Linting**: ESLint with React-specific rules
- **Testing**: Unit tests with Vitest, E2E with Playwright
- **Code Organization**: Clear separation of concerns

### Performance Optimizations
- **Build Tool**: Vite for fast development and optimized production builds
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Intelligent query caching and background updates
- **Bundle Size**: Optimized with tree shaking

### UI/UX Design
- **Design System**: Consistent component library with custom theming
- **Accessibility**: Radix UI primitives ensure WCAG compliance
- **Responsive Design**: Mobile-first approach with Tailwind
- **Dark Mode**: Built-in theme switching capability

## Key Architectural Decisions

1. **SPA Architecture**: Single-page application for smooth user experience
2. **Serverless Backend**: Supabase for scalability and reduced infrastructure management
3. **Component Library**: shadcn/ui for consistent, accessible UI components
4. **Type Safety**: Full TypeScript adoption for maintainability
5. **Query Management**: TanStack Query for robust server state handling
6. **Role-Based Security**: Client-side permission checks with server validation

## Notable Implementation Details

- **Evaluation System**: Sophisticated dual-track evaluation system with visibility controls
- **Rich Text Editing**: Tiptap integration for policy management
- **PDF Generation**: Server-side document creation for invoices and payslips
- **Real-time Updates**: Live evaluation timelines and notifications
- **Form Management**: React Hook Form with Zod validation throughout
- **Image Handling**: Avatar uploads with cropping functionality

## Development Workflow

- **Local Development**: `npm run dev` starts Vite dev server on port 8080
- **Building**: `npm run build` creates optimized production bundle
- **Testing**: Comprehensive test suite with unit and E2E coverage
- **Deployment**: Static hosting compatible (Vercel, Netlify, etc.)

This analysis reveals a well-architected, modern HR management system with strong foundations in React ecosystem best practices, comprehensive feature coverage, and attention to developer experience.