<!--
generated_by: tessera
source_sha: e3b474779bf09d55302d2bc89be1ae87a6a9e9d7
generated_at: 2026-04-27T12:14:30.064Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React/TypeScript)  
**Primary Language**: TypeScript (167 files)  
**Total Files**: 224 (2089KB)  
**Symbols**: 493 total, 368 public

## Application Purpose

Beudox HR is a comprehensive Human Resources Management System designed to handle all aspects of employee management for modern businesses. The application provides tools for attendance tracking, payroll processing, leave management, performance evaluations, and organizational workflows.

## Architecture Insights

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build System**: Vite for development and production builds
- **UI Framework**: Tailwind CSS + shadcn/ui (Radix UI components)
- **Routing**: React Router v6 with protected routes
- **State Management**: React Query for server state, Context API for global state
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest (unit tests), Playwright (E2E tests)

### Key Architectural Patterns
1. **Component-Driven Development**: Extensive use of reusable UI components
2. **Role-Based Access Control**: Granular permissions system
3. **Provider Pattern**: Multiple context providers for different concerns
4. **Custom Hooks**: Business logic abstracted into reusable hooks
5. **Compound Components**: Complex UIs built from simpler primitives

## Core Features Discovered

### 1. Authentication & User Management
- Supabase-based authentication with email/password
- Role-based access control (Admin, HR Manager, Project Manager, Employee)
- Password reset and invite flows
- User profile management with avatar support

### 2. Employee Management
- Comprehensive employee profiles with personal and professional details
- Department and role assignments
- Employee search and filtering capabilities
- Bulk operations and data import/export

### 3. Attendance Tracking
- Automated import from ZKTeco biometric machines
- AI-powered Excel/CSV parsing with error handling
- Working hours calculation with overtime tracking
- Late arrival detection and reporting
- Holiday and weekend recognition
- Batch import with detailed summaries

### 4. Leave Management
- Leave request and approval workflows
- Balance tracking across multiple leave types
- Calendar integration for leave planning
- Automated balance updates

### 5. Payroll Processing
- Automated payroll generation
- Overtime calculations (regular and holiday)
- Tax and deduction handling
- PDF payslip generation
- Salary history and projections

### 6. Performance Management
- Regular performance evaluations
- Daily evaluation system
- Review scheduling and reminders
- Goal setting and tracking
- Performance analytics

### 7. Project & Client Management
- Project creation and team assignment
- Client relationship management
- Project progress tracking
- Resource allocation
- Project activity logging

### 8. Financial Management
- Invoice generation and management
- Client billing and payment tracking
- Financial reporting and analytics
- Expense management
- Loan tracking for employees

### 9. Content Management
- HR policy documents with rich text editing
- Job description management
- Document storage and version control
- Public holiday configuration

### 10. Administrative Tools
- Company settings and configuration
- Department and role management
- System-wide settings
- Audit logs and login tracking
- Notification preferences

## Database Schema Insights

The application uses a multi-tenant PostgreSQL database via Supabase with the following key entities:

- **employees**: Core user data with company associations
- **attendance_records**: Time tracking with status flags and calculations
- **leave_requests**: Vacation and absence management
- **payroll_records**: Compensation and salary data
- **projects**: Project management with team relationships
- **evaluations**: Performance review data
- **company_settings**: Organization-wide configuration
- **public_holidays**: Holiday calendar management

## Notable Technical Implementations

### 1. Attendance Upload Flow
A sophisticated multi-step wizard that:
- Handles Excel/CSV files from various biometric devices
- Uses AI (Supabase Edge Functions) to parse inconsistent data formats
- Performs automatic calculations for working hours and overtime
- Provides detailed preview and error reporting
- Supports batch processing with rollback capabilities

### 2. Role-Based Navigation
Dynamic sidebar navigation that adapts based on user permissions, showing only accessible features.

### 3. Real-time Features
- Live notifications via Supabase real-time subscriptions
- Real-time attendance updates
- Live dashboard metrics

### 4. PDF Generation
Server-side PDF generation for payslips and invoices using Supabase Edge Functions.

### 5. Rich Text Editing
Tiptap-based rich text editor for HR policies and other document content.

## Code Quality Observations

### Strengths
- **Type Safety**: Comprehensive TypeScript usage with strict configuration
- **Component Reusability**: Well-structured component library with shadcn/ui
- **Error Handling**: Proper error boundaries and user feedback
- **Performance**: React Query caching, code splitting, and optimized builds
- **Accessibility**: Radix UI components provide good accessibility foundations
- **Testing**: Unit and E2E test setups with modern tools

### Patterns Used
- Custom hooks for business logic separation
- Utility functions for common operations
- Consistent naming conventions
- Proper component composition
- Environment-based configuration

## Security Considerations

- Supabase Row Level Security (RLS) for data access control
- JWT-based authentication
- Input validation with Zod schemas
- Secure file upload handling
- Role-based API access

## Development Workflow

- Modern development setup with Vite
- ESLint and TypeScript for code quality
- Automated testing with Vitest and Playwright
- Supabase for backend development and deployment
- Environment-based configuration management

## Key Files Analyzed

- `src/App.tsx`: Main application routing and provider setup
- `src/components/attendance/AttendanceUploadFlow.tsx`: Complex attendance import wizard
- `src/components/employee-profile/AttendanceTab.tsx`: Attendance data display
- `src/components/SearchableEmployeeSelect.tsx`: Reusable employee selection component
- `src/components/BeudoxLogo.tsx`: Logo component with theme variants
- `src/components/NavLink.tsx`: Enhanced navigation link component
- `package.json`: Dependencies and build scripts
- `.env`: Environment configuration

## Summary

Beudox HR represents a well-architected, feature-rich HR management system built with modern web technologies. The codebase demonstrates strong engineering practices with proper separation of concerns, comprehensive TypeScript usage, and scalable architecture. The application successfully handles complex business logic for HR operations while maintaining good developer experience and code maintainability.

The analysis reveals a production-ready application with sophisticated features like AI-powered data processing, real-time updates, and comprehensive role-based access control, making it suitable for enterprise HR management needs.