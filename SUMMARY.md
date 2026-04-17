<!--
generated_by: tessera
source_sha: 55444638bc53a18285b920d64c478cdcc2ed710c
generated_at: 2026-04-17T23:30:49.218Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Beudox HR** is a comprehensive Human Resources Management System implemented as a modern React frontend application. The codebase consists of 185 files (1694KB) with primary focus on TypeScript development, utilizing a robust tech stack for enterprise-grade HR operations.

## Key Architectural Insights

### Technology Stack & Architecture
- **Frontend Framework**: React 18 with TypeScript, built with Vite
- **UI System**: Tailwind CSS + shadcn/ui component library (40+ UI components)
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: React Router DOM with role-based route protection
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: Tiptap editor for HR policies
- **Charts**: Recharts for financial and analytics visualizations

### Application Structure
- **Component Architecture**: 135 TypeScript files organized by feature domains
- **Routing System**: 25+ protected routes with granular role-based access
- **Database Integration**: 25 SQL migrations defining comprehensive HR schema
- **Edge Functions**: Business logic for payroll, invoicing, and notifications

## Core Business Domains

### 1. Employee Lifecycle Management
- Complete employee CRUD operations
- Role-based organizational hierarchy
- Profile management with avatar support
- Department and position tracking

### 2. Performance Management
- **Quarterly Evaluations**: Bi-annual performance reviews
- **Daily Evaluations**: Real-time peer feedback system
- Role-specific visibility controls (managers see recommendations, employees see personal feedback)
- Evaluation timeline with historical tracking

### 3. Leave & Attendance
- Multi-type leave request system
- Balance tracking and approval workflows
- Attendance recording and reporting
- Working days calculation utilities

### 4. Financial Operations
- Automated payroll generation
- Invoice creation and PDF generation
- Expense tracking and approval
- Loan management system
- Financial reporting and analytics

### 5. Project & Client Management
- Project lifecycle management
- Client relationship tracking
- Team assignment and resource allocation
- Project progress monitoring

## Role-Based Access Control

The system implements a sophisticated 5-tier role hierarchy:

- **CEO**: Universal access to all features
- **HR Manager**: Employee management, evaluations, leave, settings
- **Finance Manager**: Payroll, invoicing, financial operations
- **Team Lead**: Team oversight, evaluations, project management
- **Employee**: Personal dashboard, requests, self-service features

Access control is implemented at both route level and component level using a centralized permission system.

## Key Components Analysis

### Layout System
- `AppLayout`: Main application shell with responsive design
- `AppSidebar`: Collapsible navigation with role-based menu items
- `TopBar`: User menu, notifications, and global actions
- `NotificationBell`: Real-time notification system

### Core Business Components
- `EvaluationTimeline`: Complex component handling evaluation history with filtering
- `SearchableEmployeeSelect`: Reusable employee selection with search and avatar display
- `RichTextEditor`: Tiptap-based editor for HR policy creation
- `BeudoxLogo`: Multi-variant logo component for different contexts

### UI Component Library
- 40+ shadcn/ui components customized for HR workflows
- Consistent design system with Tailwind CSS
- Accessible components built on Radix UI primitives

## Database Schema Insights

### Multi-Tenant Architecture
- Company-based data isolation
- Shared schema with company_id foreign keys
- Row Level Security policies for data protection

### Key Relationships
- Employees belong to companies and departments
- Evaluations link employees to evaluators
- Projects connect employees and clients
- Financial records tie to employees and approval workflows

### Migration History
- 25 database migrations showing iterative schema development
- Progressive addition of features (evaluations, payroll, invoicing)
- Consistent naming and relationship patterns

## Technical Implementation Highlights

### State Management
- React Query for all server state
- Optimistic updates for better UX
- Real-time subscriptions for live data
- Intelligent caching and synchronization

### Form Handling
- React Hook Form for complex forms
- Zod schemas for validation
- Type-safe form data handling
- File upload support (avatars, documents)

### Business Logic
- Centralized utility functions (`leave-utils.ts`, `role-access.ts`)
- Edge functions for heavy computations (PDF generation, payroll)
- Notification system with email integration
- Automated workflows and approvals

## Development & Testing Infrastructure

### Build System
- Vite with SWC for fast development
- TypeScript with strict configuration
- ESLint and Prettier for code quality
- Path aliases for clean imports

### Testing Strategy
- Vitest for unit testing
- Playwright for E2E testing
- Component testing setup
- CI/CD pipeline configuration

## Important Files & Their Roles

### Configuration Files
- `vite.config.ts`: Build configuration with React SWC plugin
- `tailwind.config.ts`: Design system configuration
- `tsconfig.json`: TypeScript compiler options
- `package.json`: Dependencies and scripts

### Core Application Files
- `src/App.tsx`: Main routing configuration (25+ routes)
- `src/main.tsx`: Application entry point
- `src/hooks/useAuth.ts`: Authentication state management
- `src/lib/role-access.ts`: Permission system logic

### Integration Files
- `src/integrations/supabase/client.ts`: Supabase client setup
- `src/integrations/supabase/types.ts`: Database type definitions
- Supabase edge functions for business logic

## Security & Performance Considerations

### Security Implementation
- JWT-based authentication via Supabase
- Row Level Security in PostgreSQL
- Role-based UI component visibility
- Input validation and sanitization

### Performance Optimizations
- Code splitting by routes
- Lazy loading of components
- React Query caching strategies
- Optimized bundle with Vite

## Development Workflow Insights

### Code Organization
- Feature-based directory structure
- Consistent naming conventions
- TypeScript for type safety
- Component composition patterns

### Version Control
- 25 database migrations indicating iterative development
- Feature branches and clean commit history
- Automated documentation generation

This codebase represents a well-architected, enterprise-ready HR management system with modern development practices, comprehensive feature coverage, and scalable architecture suitable for growing organizations.