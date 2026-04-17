<!--
generated_by: tessera
source_sha: 099d34358ea15e3c514ce78c3f996a5e1e65dbc6
generated_at: 2026-04-17T21:48:49.795Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Beudox HR** is a comprehensive Human Resources Management System implemented as a modern React/TypeScript frontend application. The codebase consists of 182 files (1686KB) with TypeScript as the primary language, featuring a complete HR suite with employee management, performance evaluations, payroll, and business operations.

## Key Architectural Insights

### Technology Stack Analysis
- **Frontend Framework**: React 18 + TypeScript + Vite build system
- **UI Framework**: Tailwind CSS + shadcn/ui component library
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **State Management**: React Query for server state, Context API for authentication
- **Routing**: React Router DOM with protected routes
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Supabase subscriptions for live updates

### Application Architecture
- **Component-Based**: Modular component architecture with reusable UI elements
- **Role-Based Security**: Granular access control with CEO/HR Manager/Team Lead/Employee roles
- **Multi-Tenant**: Company-based data isolation
- **Real-time Features**: Live notifications and data synchronization
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Core Business Domains

### 1. Employee Lifecycle Management
- Complete employee onboarding and profile management
- Role and department assignments
- Employment status tracking
- Avatar and document management

### 2. Performance Management System
- **Quarterly Evaluations**: Formal performance reviews with ratings (1-5 scale)
- **Daily Evaluations**: Continuous feedback with peer reviews
- **Timeline Views**: Historical evaluation tracking
- **Role-Based Visibility**: Different access levels for different user types

### 3. Leave & Attendance Management
- Automated leave request workflows
- Balance tracking with accrual calculations
- Approval hierarchies
- Integration with payroll systems

### 4. Payroll & Financial Operations
- Automated payroll generation
- Payslip distribution
- Invoice management and client billing
- Financial reporting and analytics
- Loan tracking and management

### 5. Business Operations
- Project management and tracking
- Client relationship management
- HR policy documentation with rich text editing
- Company settings and configuration

## Database Schema Insights

### Key Tables Identified
- `companies` - Multi-tenant company data
- `employees` - Core employee profiles
- `departments` & `roles` - Organizational structure
- `evaluations` & `daily_evaluations` - Performance management
- `leave_requests` - Leave management system
- `payroll` - Payroll processing
- `invoices` & `projects` & `clients` - Business operations
- `hr_policies` - Policy documentation

### Data Relationships
- Hierarchical employee structures
- Evaluation workflows with reviewers/reviewees
- Approval chains for leave and other requests
- Financial integrations across payroll and invoicing

## Component Architecture Patterns

### Layout System
- `AppLayout` - Main application shell
- `AppSidebar` - Dynamic navigation based on user roles
- `TopBar` - Global actions and notifications
- `NotificationBell` - Real-time notification system

### Feature Components
- **Employee Components**: Searchable selectors, profile displays
- **Evaluation Components**: Timeline views, rating interfaces
- **Form Components**: Rich text editors, date pickers, file uploads
- **Data Display**: Tables, charts, and reporting components

### UI Component Library
- Complete shadcn/ui implementation
- Custom Beudox theming with violet/indigo color scheme
- Accessible components with proper ARIA labels
- Consistent design system with custom fonts (Outfit, DM Sans)

## Security & Access Control

### Authentication Flow
- Supabase Auth integration
- Email/password and magic link authentication
- Secure password reset and employee invitation
- Session management with automatic refresh

### Authorization Model
- Role-based access control (RBAC)
- Route-level protection
- Component-level permission checks
- Data filtering based on user roles and company membership

## Key Technical Patterns

### Data Fetching Strategy
- React Query for caching and synchronization
- Optimistic updates for better UX
- Background refetching for data freshness
- Error handling with retry logic

### Form Management
- React Hook Form for complex forms
- Zod schemas for validation
- File upload handling
- Rich text editing with Tiptap

### Real-time Features
- Supabase subscriptions for live updates
- Notification system for approvals
- Live evaluation submissions
- Real-time dashboard updates

## Development & Build Insights

### Build Configuration
- Vite with React SWC plugin for fast builds
- Path aliases (`@/` for `src/`)
- Development server on port 8080
- Optimized dependency pre-bundling

### Styling System
- Tailwind CSS with custom design tokens
- Dark mode support
- Custom color palette (Beudox violet theme)
- Responsive breakpoints and container queries

### Testing Infrastructure
- Vitest for unit testing
- React Testing Library for component testing
- Playwright for E2E testing
- JSDOM environment for testing

## Important Files & Entry Points

### Application Entry
- `src/main.tsx` - React 18 createRoot bootstrap
- `src/App.tsx` - Main application with routing and providers

### Core Configuration
- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `.env` - Environment variables for Supabase

### Key Business Logic
- `src/hooks/useAuth.ts` - Authentication state
- `src/lib/role-access.ts` - Permission utilities
- `src/lib/leave-utils.ts` - Leave calculations
- `src/components/evaluations/EvaluationTimeline.tsx` - Complex evaluation display

## Database Migration History

23 SQL migration files indicating:
- Incremental schema evolution
- Feature additions over time
- Data integrity maintenance
- Performance optimizations

## Integration Points

### Supabase Ecosystem
- Database with 23+ migrations
- Authentication system
- File storage for uploads
- Edge functions for server logic
- Email service for notifications
- Real-time subscriptions

### External Dependencies
- Comprehensive UI component library
- Chart and visualization libraries
- Form handling and validation
- Rich text editing capabilities
- Date manipulation utilities

## Performance Considerations

### Frontend Optimizations
- Code splitting with dynamic imports
- Image lazy loading and optimization
- React Query caching strategies
- Virtual scrolling for large datasets

### Database Optimizations
- Indexed queries for performance
- Efficient joins and relationships
- Migration-based schema updates
- Query optimization patterns

## Summary of Findings

This is a production-ready, feature-complete HR management system with:
- **183 files** across TypeScript, SQL, and configuration
- **298 symbols** with 255 public interfaces
- **Complete business logic** for HR operations
- **Modern architecture** with best practices
- **Comprehensive testing** and development tooling
- **Real-time capabilities** and responsive design
- **Security-first approach** with role-based access
- **Scalable foundation** for future enhancements

The codebase demonstrates professional software development practices with clean architecture, comprehensive error handling, and maintainable code structure suitable for enterprise HR management needs.