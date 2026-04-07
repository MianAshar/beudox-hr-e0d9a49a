<!--
generated_by: tessera
source_sha: 7b605e9472f6b8c714de14d5769583c23a81c06a
generated_at: 2026-04-07T21:29:46.483Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React SPA)  
**Primary Language**: TypeScript (119 files)  
**Total Files**: 162  
**Total Size**: 1.5MB

## Technology Stack Analysis

### Core Framework
- **React 18** with TypeScript for type-safe component development
- **Vite** as build tool with SWC compiler for fast development
- **React Router DOM v6** for client-side routing

### UI & Styling
- **Tailwind CSS** with custom design system
- **shadcn/ui** component library (40+ components)
- Custom fonts: Outfit (display), DM Sans (body)
- Dark mode support with CSS custom properties

### State Management & Data
- **React Query (TanStack Query)** for server state management
- **Supabase** for backend (database, auth, edge functions)
- **React Hook Form + Zod** for form validation

### Additional Libraries
- **Tiptap** for rich text editing
- **Recharts** for data visualization
- **Lucide React** for icons
- **Date-fns** for date manipulation
- **Sonner** for toast notifications

## Application Architecture

### Component Structure
- **119 TypeScript files** organized in feature-based directories
- **Modular component design** with clear separation of concerns
- **Reusable UI components** following shadcn/ui patterns
- **Feature-specific components** (evaluations, hr-policies, settings)

### Key Architectural Patterns
- **Protected Routes** with role-based access control
- **Layout Components** (AppLayout, AppSidebar, TopBar)
- **Custom Hooks** for shared logic (useAuth, useToast)
- **Utility Functions** in lib/ directory
- **Type Definitions** for Supabase integration

## Feature Analysis

### Core Features Identified
1. **Employee Management** - Profiles, forms, organizational structure
2. **Project Management** - CRUD operations, team assignment
3. **Client Management** - Relationships, project associations
4. **Invoicing System** - Generation, PDF export, email sending
5. **HR Policies** - Rich text content management
6. **Performance Evaluations** - Quarterly and daily feedback system
7. **Payroll Processing** - Automated calculations, payslip generation
8. **Loan Management** - Tracking and repayment
9. **Settings Management** - Company configuration, departments, roles

### Authentication & Security
- **Supabase Auth** integration
- **Role-based access control** (CEO, HR Manager, Team Lead, Employee)
- **Protected routes** with authorization checks
- **Row Level Security** in database

## Database Integration

### Supabase Usage
- **18 SQL migration files** indicating complex schema
- **Edge Functions** for business logic (payroll, invoices, employee management)
- **Real-time subscriptions** (implied by React Query usage)
- **File storage** for avatars and documents

### Data Flow
- **React Query** for optimistic updates and caching
- **Type-safe database operations** via generated types
- **Server-side processing** via Edge Functions for complex calculations

## Development Infrastructure

### Testing Setup
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **Testing Library** for component testing
- **Test configuration** with setup files

### Build & Deployment
- **Vite configuration** with development server on port 8080
- **ESLint + TypeScript** for code quality
- **Path aliases** (@/ for src/)
- **Environment configuration** via .env files

## Key Findings

### Strengths
- **Modern tech stack** with latest React patterns
- **Comprehensive feature set** covering full HR lifecycle
- **Type safety** throughout with TypeScript
- **Scalable architecture** with clear component boundaries
- **Professional UI/UX** with consistent design system
- **Robust testing strategy** with multiple testing layers

### Notable Components
- **EvaluationTimeline**: Complex component with role-based visibility filtering
- **SearchableEmployeeSelect**: Sophisticated combobox with avatar display
- **RichTextEditor**: Full-featured WYSIWYG editor
- **AppLayout**: Flexible layout system with sidebar navigation

### Architecture Insights
- **Role-based rendering** affects data visibility and UI elements
- **Unified timeline view** combining quarterly and daily evaluations
- **Modular settings system** with tabbed interface
- **Responsive design** with mobile-friendly components

## Documentation Generated

- **README.md**: Comprehensive project overview, setup instructions, and feature list
- **llms.txt**: Detailed technical context for AI assistants
- **SUMMARY.md**: This analysis summary

The codebase represents a production-ready, enterprise-grade HR management system with modern development practices and comprehensive functionality.