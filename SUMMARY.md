<!--
generated_by: tessera
source_sha: 6de9f53b095a7eb1412b4e47f3213ed1d5192eeb
generated_at: 2026-04-27T10:11:52.423Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend React Application  
**Primary Language**: TypeScript (165 files)  
**Total Files**: 221 (2065KB)  
**Symbols**: 470 total, 352 public

## Application Purpose

Beudox HR is a comprehensive Human Resources Management System designed to handle all aspects of employee lifecycle management, from onboarding to payroll. The application provides tools for managing employees, tracking attendance, processing payroll, managing leave requests, conducting evaluations, and overseeing projects.

## Architecture & Technology Stack

### Frontend Framework
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool for fast development and optimized production builds
- **React Router DOM** for client-side routing with protected routes
- **TanStack Query** for efficient server state management and caching

### UI & Styling
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **Custom CSS variables** for theming and design system

### Backend & Data
- **Supabase** as the backend-as-a-service platform
- **PostgreSQL** database with 31 migration files
- **Supabase Auth** for user authentication and authorization
- **Real-time subscriptions** for live updates
- **Edge Functions** for server-side processing (payroll, PDF generation)

### Development Tools
- **TypeScript** with strict configuration
- **ESLint** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **React Testing Library** for component testing

## Key Features Discovered

### 1. Employee Management
- Comprehensive employee profiles with personal and professional details
- Role-based access control with granular permissions
- Employee search and selection components
- Profile tabs for attendance, leave, payroll, documents, etc.

### 2. Attendance & Time Tracking
- Automated attendance recording with check-in/out functionality
- Overtime calculation (regular and holiday OT)
- Monthly attendance summaries and reporting
- Late arrival tracking and status indicators

### 3. Leave Management
- Multiple leave types with balance tracking
- Leave request and approval workflows
- Calendar integration for leave planning
- Remaining balance calculations

### 4. Payroll & Compensation
- Automated payroll generation
- Salary history and increment tracking
- Payslip generation and distribution
- Multiple compensation components (allowances, deductions)

### 5. Performance Management
- Regular performance evaluations
- Daily evaluation system
- Customizable evaluation parameters
- Review scheduling and alerts

### 6. Project Management
- Project creation and team assignment
- Task tracking and progress monitoring
- Two versions of project management (legacy and v2)
- Project activity logging

### 7. Financial Management
- Invoice generation with PDF export
- Client management
- Finance overview and reporting
- Loan tracking and management

### 8. Administrative Tools
- Company settings and configuration
- Department and role management
- HR policy creation with rich text editing
- Job description management
- Public holiday configuration

## Code Organization

### Component Structure
- **Feature-based organization**: Components grouped by domain (employee-profile, settings, projects)
- **UI components**: Reusable shadcn/ui components in `src/components/ui/`
- **Layout components**: AppLayout, Sidebar, TopBar for consistent navigation
- **Page components**: Route-level components in `src/pages/`

### Key Architectural Insights

1. **Protected Routing System**: Sophisticated authentication with role-based access control
2. **Component Composition**: Extensive use of compound components and custom hooks
3. **Data Fetching Strategy**: TanStack Query for efficient API calls and caching
4. **Form Management**: React Hook Form with Zod validation for robust forms
5. **Real-time Features**: Supabase subscriptions for live updates
6. **Modular Design**: Clear separation between UI, business logic, and data layers

## Database Schema Insights

Based on the 31 SQL migration files, the database includes:
- Employee and user management tables
- Attendance and time tracking tables
- Payroll and compensation structures
- Project and task management
- Leave and holiday systems
- Evaluation and performance data
- Document and file storage
- Notification and audit systems

## Notable Implementation Details

### Authentication & Security
- Multi-step authentication flow with password reset
- Role-based permissions with `canAccess` utility
- Secure route protection with loading states
- Invite-based user onboarding

### UI/UX Patterns
- Consistent design system with custom CSS variables
- Responsive design with mobile considerations
- Loading states and error handling
- Toast notifications for user feedback
- Modal and drawer patterns for complex interactions

### Performance Optimizations
- Query caching and invalidation strategies
- Lazy loading and code splitting potential
- Optimized re-renders with proper dependency arrays
- Efficient data structures for large datasets

## Development Workflow

The codebase follows modern React development practices:
- TypeScript for type safety
- Component testing with Vitest
- E2E testing with Playwright
- ESLint for code quality
- Git hooks for automated checks (implied by Tessera integration)

## Areas for Future Enhancement

1. **Document Management**: Currently shows placeholder, coming soon
2. **Advanced Reporting**: Analytics and dashboard enhancements
3. **Mobile App**: Potential for React Native companion
4. **API Documentation**: OpenAPI specs for backend integration
5. **Multi-tenancy**: Support for multiple organizations

## Conclusion

Beudox HR represents a well-architected, feature-rich HR management system with modern development practices. The codebase demonstrates strong separation of concerns, comprehensive feature coverage, and scalable architecture suitable for enterprise HR operations. The use of TypeScript, modern React patterns, and robust backend integration makes it maintainable and extensible for future enhancements.