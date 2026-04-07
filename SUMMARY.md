<!--
generated_by: tessera
source_sha: e4666b393eb5ebe6bd89896a1cb544c156007f6a
generated_at: 2026-04-07T11:10:51.223Z
action: create
-->

# Beudox HR - Code Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend React Application  
**Primary Language**: TypeScript  
**Lines of Code**: ~152 files, 1.4MB  
**Key Technologies**: React, TypeScript, Vite, Supabase, Tailwind CSS, shadcn/ui

## What I Discovered

This is a comprehensive HR management SaaS application called "Beudox HR" that provides tools for employee performance evaluations, HR policy management, and organizational configuration. The application serves different user roles (employees, team leads, HR managers, CEOs) with appropriate access controls and visibility rules.

### Core Features Identified

1. **Employee Evaluation System**
   - Quarterly performance reviews with scores, comments, and recommendations
   - Daily feedback sessions with positive/constructive direction
   - Timeline view aggregating both evaluation types
   - Role-based visibility (hierarchical access control)

2. **HR Policy Management**
   - Rich text editor for creating and editing policies
   - HTML content storage with formatting support
   - Integrated document creation workflow

3. **Organizational Settings**
   - Company information configuration
   - Department and role management
   - Evaluation parameters and attendance policies
   - Administrative controls with danger zone options

4. **User Interface & Navigation**
   - Responsive sidebar navigation
   - Top bar with user context
   - Component-based architecture using shadcn/ui
   - Consistent design system with Tailwind CSS

## Key Architectural Insights

### Technology Stack Analysis
- **Frontend Framework**: React 18 with TypeScript for type safety
- **Build System**: Vite for fast development and optimized production builds
- **Backend Integration**: Supabase for database, authentication, and real-time features
- **State Management**: TanStack Query for server state, React Context for auth
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens

### Component Architecture
- **Layout System**: AppLayout provides consistent structure with sidebar and main content
- **Feature Organization**: Components grouped by domain (evaluations, hr-policies, settings)
- **UI Components**: Extensive use of shadcn/ui for buttons, forms, dialogs, etc.
- **Custom Components**: Specialized components like EvaluationTimeline and RichTextEditor

### Data Flow Patterns
- **Query Management**: TanStack Query handles all API calls with caching
- **Authentication**: Supabase Auth with role-based access control
- **Real-time Updates**: Supabase subscriptions for live data synchronization
- **Type Safety**: Generated TypeScript types from database schema

## Important Files and Their Roles

### Application Structure
- `src/main.tsx`: Entry point initializing the React application
- `src/App.tsx`: Root component with routing configuration
- `src/pages/Index.tsx`: Main page component

### Core Components
- `src/components/layout/AppLayout.tsx`: Main application layout with sidebar integration
- `src/components/evaluations/EvaluationTimeline.tsx`: Complex evaluation display with filtering and role-based visibility
- `src/components/hr-policies/RichTextEditor.tsx`: Rich text editing component using Tiptap
- `src/components/BeudoxLogo.tsx`: Logo component with variant support
- `src/components/NavLink.tsx`: Navigation link wrapper with active state handling

### Configuration Files
- `package.json`: Project dependencies and scripts
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration
- `supabase/config.toml`: Backend configuration
- `.env`: Environment variables for Supabase connection

### Database Integration
- `src/integrations/supabase/client.ts`: Supabase client setup
- `src/integrations/supabase/types.ts`: Generated TypeScript types
- `supabase/migrations/`: SQL migration files for database schema

## Business Logic Insights

### Role-Based Access Control
The application implements a hierarchical permission system:
- **Employees**: Can view their own evaluations and basic information
- **Team Leads**: Can see evaluations they submitted or received from their team
- **HR Managers**: Full access to all evaluations and settings
- **CEOs**: Complete administrative access including recommendations

### Evaluation Workflow
- **Quarterly Evaluations**: Formal reviews with structured feedback
- **Daily Evaluations**: Quick feedback with directional guidance
- **Timeline Aggregation**: Unified view combining both evaluation types
- **Visibility Filtering**: Dynamic content based on user role and relationships

### Content Management
- **Policy Creation**: Rich text editing with formatting toolbar
- **HTML Storage**: Content persisted as formatted HTML
- **Rendering**: ProseMirror-based display with consistent styling

## Development Environment

- **Package Manager**: Bun for fast dependency management
- **Testing**: Vitest for unit tests, Playwright for E2E testing
- **Linting**: ESLint for code quality
- **Version Control**: Git with conventional commit structure

## Database Schema Understanding

From the migration files, the application manages:
- **Core Entities**: companies, employees, users
- **Evaluation Data**: evaluations (quarterly), daily_evaluations
- **Configuration**: departments, roles, settings, attendance policies
- **Content**: hr_policies with rich text content

## Recommendations for Future Development

1. **Documentation**: Expand API documentation for Supabase functions
2. **Testing**: Increase test coverage for complex components like EvaluationTimeline
3. **Performance**: Implement virtualization for large evaluation lists
4. **Accessibility**: Add ARIA labels and keyboard navigation support
5. **Internationalization**: Prepare for multi-language support

This analysis provides a comprehensive understanding of the Beudox HR application's architecture, features, and technical implementation based on the provided codebase.