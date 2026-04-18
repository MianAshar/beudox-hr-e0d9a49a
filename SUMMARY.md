<!--
generated_by: tessera
source_sha: 532445a0e6591cf342df6eb72db8d288205b7fe5
generated_at: 2026-04-18T01:00:48.804Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React/TypeScript)  
**Primary Purpose**: Comprehensive Human Resources Management System  
**Architecture**: Single-page application with Supabase backend

## Technical Architecture

### Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC compiler
- **UI Framework**: ShadCN/UI (Radix UI primitives + Tailwind CSS)
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Styling**: Tailwind CSS with custom design system

### Key Dependencies
- **UI Components**: 20+ Radix UI primitives
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Rich Text**: Tiptap editor
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Application Features & Modules

### 1. Authentication & User Management
- Email/password authentication with Supabase
- Role-based access control (CEO, HR Manager, Team Lead, Employee)
- Password recovery and invite-based onboarding
- Protected routes with automatic redirects

### 2. Employee Management
- Complete employee lifecycle management
- Profile management with avatar uploads
- Organizational hierarchy and reporting structure
- Employee search and filtering components

### 3. Performance Management
- **Quarterly Evaluations**: Bi-annual reviews with 1-5 scoring
- **Daily Evaluations**: Real-time feedback system
- **Evaluation Timeline**: Historical view with role-based visibility
- Manager recommendations and performance insights

### 4. Financial Management
- **Payroll Processing**: Automated calculations with payslips
- **Finance Dashboard**: Real-time metrics with 6-month trends
- **Expense Tracking**: Monthly expense management
- **Invoice System**: Client billing with PDF generation

### 5. Leave Management
- Leave request workflow with approval chains
- Real-time leave balance tracking
- Multiple leave types configuration
- Working days calculation utilities

### 6. Project & Client Management
- Full project lifecycle management
- Team assignment and resource allocation
- Client relationship management
- Project activity logging and tracking

### 7. HR Policies & Compliance
- Rich text policy document management
- Version control for policy updates
- Employee loan tracking
- Configurable system settings

## Codebase Structure Analysis

### Component Architecture
- **50+ ShadCN/UI Components**: Complete design system implementation
- **Feature-Organized Components**: Grouped by domain (finance, evaluations, leave, etc.)
- **Layout System**: AppLayout, AppSidebar, TopBar with responsive design
- **Reusable Components**: SearchableEmployeeSelect, EvaluationTimeline, FinanceSummary

### Key Architectural Patterns
- **Custom Hooks**: Data fetching, authentication, and business logic
- **Utility Functions**: Date formatting, role access control, leave calculations
- **Type Safety**: Comprehensive TypeScript interfaces and Zod schemas
- **Error Handling**: Toast notifications and loading states

### Database Integration
- **Supabase Client**: Centralized configuration
- **Type-Safe Queries**: Generated types from database schema
- **Real-time Subscriptions**: Live updates for collaborative features
- **Edge Functions**: Serverless PDF generation and email sending

## Notable Implementation Details

### Role-Based Access Control
- Granular permissions system implemented via `canAccess` function
- Route-level protection with automatic role-based redirects
- Component-level visibility controls for sensitive data

### Data Visualization
- Recharts integration for financial trends and analytics
- Custom tooltips and responsive chart components
- 6-month rolling data analysis for finance dashboard

### Form Management
- React Hook Form with Zod validation schemas
- Complex form components (employee creation, evaluation forms)
- File upload handling for avatars and documents

### Rich Text Editing
- Tiptap editor for HR policy documents
- Link and formatting extensions
- Version control for policy management

## Development Environment

### Build Configuration
- **Vite Config**: React SWC plugin, path aliases (@/src)
- **TypeScript**: Strict configuration with path mapping
- **Tailwind**: Custom font stack (Outfit, DM Sans) and color system
- **ESLint**: TypeScript-aware linting rules

### Testing Setup
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing
- **Testing Library**: React component testing utilities

### Development Scripts
- `npm run dev`: Development server on port 8080
- `npm run build`: Production build optimization
- `npm run test`: Test execution
- `npm run lint`: Code quality checks

## Key Insights & Patterns

### 1. Scalable Component Architecture
The codebase demonstrates excellent separation of concerns with feature-based component organization and reusable UI primitives.

### 2. Type Safety First
Comprehensive TypeScript usage with generated database types ensures type safety across the entire application.

### 3. Modern React Patterns
Utilizes latest React features (hooks, concurrent features) with TanStack Query for efficient server state management.

### 4. Design System Consistency
ShadCN/UI provides a cohesive design system with consistent spacing, colors, and interaction patterns.

### 5. Real-time Capabilities
Supabase integration enables real-time features for collaborative workflows and live updates.

### 6. Performance Considerations
Vite build system, code splitting, and optimized dependencies ensure fast loading and development experience.

## Summary

Beudox HR represents a well-architected, feature-rich HR management system built with modern web technologies. The codebase demonstrates strong engineering practices with comprehensive TypeScript usage, scalable component architecture, and robust data management. The application successfully implements complex business logic for HR operations while maintaining clean, maintainable code structure.

**Total Files**: 188  
**Primary Language**: TypeScript (137 files)  
**Key Technologies**: React, TypeScript, Vite, Supabase, Tailwind CSS  
**Architecture**: SPA with serverless backend integration

This analysis provides a comprehensive understanding of the codebase for development, maintenance, and future enhancements.