<!--
generated_by: tessera
source_sha: f2cefb2acc4e7e7cd2bf360280e4f2dd21435e3a
generated_at: 2026-04-07T12:36:26.731Z
action: create
-->

# Beudox HR - Repository Analysis Summary

## Project Overview

Beudox HR is a comprehensive Human Resources Management System implemented as a modern React TypeScript application. The system provides complete HR functionality including employee management, performance evaluations, project tracking, invoicing, and organizational administration.

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe component development
- **Vite** build tool with SWC compiler for fast development cycles
- **React Router v6** for client-side routing with protected route patterns
- **Tailwind CSS** with shadcn/ui component library for consistent design
- **React Query** for efficient server state management and caching
- **React Hook Form + Zod** for robust form handling and validation

### Backend Infrastructure
- **Supabase** as backend-as-a-service providing:
  - PostgreSQL database with real-time capabilities
  - Authentication and authorization
  - File storage
  - Edge functions for business logic

### Key Dependencies
- **Tiptap** for rich text editing in HR policies
- **Recharts** for data visualization in dashboards
- **Date-fns** for date manipulation
- **Lucide React** for iconography

## Application Structure

### Routing Architecture
The application implements a comprehensive routing structure with role-based access control:

- **Public Routes**: Login, password recovery
- **Protected Routes**: All business functionality with role-based permissions
- **Role Hierarchy**: CEO → HR Manager → Team Lead → Employee

### Core Features Identified
1. **Employee Management**: Profiles, onboarding, organizational structure
2. **Performance System**: Quarterly evaluations + daily feedback
3. **Project Management**: Full project lifecycle with team assignments
4. **Financial Management**: Client relationships, invoicing with PDF generation
5. **Policy Management**: Rich text HR policies
6. **Administrative Tools**: Settings, holidays, loan management

### Component Architecture
- **Atomic UI Components**: Extensive shadcn/ui component library usage
- **Layout Components**: AppLayout, Sidebar, TopBar for consistent navigation
- **Business Components**: Specialized components for evaluations, employee selection, rich text editing
- **Page Components**: Route-level components following React Router patterns

## Database Design

The system uses 17+ database migrations indicating a mature schema with:
- **Core Entities**: employees, companies, departments, roles
- **Business Tables**: projects, clients, invoices, evaluations, policies
- **Configuration Tables**: settings for attendance, expenses, evaluations

## Development Infrastructure

### Build & Development
- Development server on port 8080
- Hot module replacement configured
- Path aliases (@/ for src/) for clean imports
- ESLint and TypeScript for code quality

### Testing Strategy
- **Unit Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright for integration tests
- **Component Testing**: Focus on UI component reliability

### Configuration Management
- Environment variables for Supabase configuration
- Separate config files for Vite, TypeScript, Tailwind, PostCSS
- Supabase project configuration for backend deployment

## Key Architectural Insights

### Security Model
- JWT-based authentication via Supabase
- Role-based access control with granular permissions
- Row-level security policies in database
- Protected routes with automatic redirects

### Data Management
- React Query for optimistic updates and caching
- Real-time subscriptions for live data updates
- Edge functions for complex business logic (PDF generation, email sending)
- Type-safe database operations with generated types

### User Experience
- Responsive design with mobile-first approach
- Loading states and error handling
- Toast notifications for user feedback
- Consistent navigation with sidebar and breadcrumbs

## Notable Implementation Details

### Evaluation System
- Dual evaluation types: quarterly (formal) and daily (peer feedback)
- Role-based visibility controls
- Timeline visualization of evaluation history
- Integration with employee profiles

### Rich Text Editing
- Tiptap editor for HR policy creation
- Full formatting capabilities (headings, lists, links)
- HTML storage with proper sanitization

### Search Functionality
- Searchable employee selection component
- Real-time filtering with avatar display
- Support for "All" option in multi-select scenarios

## Repository Health

- **158 files** with **116 TypeScript files** indicating strong type coverage
- **178 symbols** with **169 public exports** showing well-structured API
- **17 SQL migrations** demonstrating database evolution
- **Test infrastructure** with Vitest and Playwright configured
- **Modern tooling** with Vite, ESLint, and TypeScript

## Conclusion

Beudox HR represents a well-architected, feature-complete HR management system built with modern web technologies. The codebase demonstrates strong engineering practices with comprehensive type safety, robust testing infrastructure, and scalable architecture patterns. The use of Supabase as a backend platform enables rapid development while maintaining enterprise-grade features like real-time updates and authentication.