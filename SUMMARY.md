<!--
generated_by: tessera
source_sha: 271fa0137f3add500b8ec2fb355c333abd9e5202
generated_at: 2026-04-17T15:03:43.134Z
action: create
-->

# Repository Analysis Summary: Beudox HR Management System

## Overview

This is a comprehensive Human Resources management frontend application built with React, TypeScript, and Supabase. The codebase contains 180 files (1674KB) with TypeScript as the primary language, featuring a modern component-based architecture for HR operations.

## Key Discoveries

### Application Purpose
The application serves as a complete HR dashboard enabling:
- Employee lifecycle management (invitations, profiles, deactivation)
- Leave request and approval workflows
- Performance evaluation system (quarterly formal reviews + daily peer feedback)
- Company settings and policy management
- Role-based access control with hierarchical permissions

### Architecture Insights

**Frontend Stack**: React 18 + TypeScript + Vite for fast development and building
**UI Framework**: Tailwind CSS + Shadcn/ui for consistent, accessible components
**State Management**: TanStack Query for server state, React hooks for local state
**Backend Integration**: Supabase for database, auth, and real-time features
**Rich Text**: TipTap editor for HR policy creation

**Component Organization**: Feature-based structure with shared UI components, clear separation of concerns

### Important Files and Roles

#### Core Application Files
- `src/main.tsx`: Application entry point with routing setup
- `src/pages/Index.tsx`: Main dashboard component
- `src/App.tsx`: Root component (likely contains providers)

#### Layout Components
- `src/components/layout/AppLayout.tsx`: Main app shell
- `src/components/layout/AppSidebar.tsx`: Navigation with role-based menu items
- `src/components/layout/TopBar.tsx`: Header with notifications and user menu

#### Feature Components
- `src/components/leave/ApplyLeaveModal.tsx`: Leave request interface
- `src/components/evaluations/EvaluationTimeline.tsx`: Combined quarterly/daily evaluation history
- `src/components/hr-policies/RichTextEditor.tsx`: Policy editing with formatting toolbar
- `src/components/SearchableEmployeeSelect.tsx`: Employee picker with search and avatars

#### Utility Files
- `src/lib/role-access.ts`: Permission checking functions
- `src/lib/leave-utils.ts`: Leave balance calculations
- `src/lib/notifications.ts`: Notification system logic
- `src/lib/utils.ts`: Common utilities (className merging)

#### Configuration
- `package.json`: Dependencies and scripts
- `vite.config.ts`: Build configuration
- `supabase/config.toml`: Database setup
- `.env`: Supabase credentials

### Database Integration
The application integrates with Supabase, evidenced by:
- 23 SQL migration files for database schema
- Generated TypeScript types in `src/integrations/supabase/types.ts`
- Supabase client configuration and auth setup
- Real-time subscriptions for live updates

### Testing and Quality
- Unit tests in `src/test/` directory
- ESLint configuration for code quality
- TypeScript strict mode for type safety
- Playwright for E2E testing setup

## Business Logic Insights

### User Roles and Permissions
- **CEO**: Full system access
- **HR Manager**: Comprehensive HR operations
- **Team Lead**: Limited management capabilities
- **Employee**: Personal dashboard access

### Evaluation System
- **Quarterly**: Formal performance reviews with recommendations (visible to managers)
- **Daily**: Peer-to-peer feedback with directional ratings
- Timeline view combining both types with role-based filtering

### Leave Management
- Multiple leave types (annual, sick, etc.)
- Balance tracking with automatic calculations
- Approval workflows with notifications

## Technical Patterns Observed

- **Component Composition**: Extensive use of compound components (Shadcn/ui patterns)
- **Custom Hooks**: Reusable logic extraction (useAuth, useToast)
- **Type Safety**: Comprehensive TypeScript usage with generated database types
- **Accessibility**: ARIA attributes and keyboard navigation support
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Error Handling**: Proper loading states and error boundaries

## Configuration and Environment

- Environment variables for Supabase configuration
- Separate config files for different tools (Vite, Tailwind, TypeScript)
- Database migrations for schema evolution
- Build and test configurations

This analysis provides a foundation for understanding the codebase structure, business logic, and technical implementation patterns of the Beudox HR Management System.