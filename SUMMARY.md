<!--
generated_by: tessera
source_sha: 6123843e38979f8a1ef95cb5e2946f901bd685f2
generated_at: 2026-04-23T22:38:10.068Z
action: create
-->

# Beudox HR - Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React SPA)  
**Primary Language**: TypeScript (165 files)  
**Total Files**: 220 (2046KB)  
**Symbols**: 461 total, 343 public

## Architecture Analysis

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6 with protected routes
- **UI**: Radix UI components + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State**: TanStack Query + React Context
- **Forms**: React Hook Form + Zod validation

### Application Structure
- **Entry Points**: `src/main.tsx` (Vite app root), `src/App.tsx` (routing)
- **Pages**: 40+ route components covering all HR functions
- **Components**: 60+ reusable UI components organized by feature
- **Business Logic**: Utility functions in `src/lib/` for HR operations

## Key Features Discovered

### Core HR Functions
1. **Employee Management**: Complete CRUD operations, profiles, roles
2. **Attendance Tracking**: Check-in/out, overtime, late detection
3. **Leave Management**: Multiple leave types, balance tracking, approvals
4. **Payroll Processing**: Automated calculations, payslips, allowances
5. **Performance Evaluations**: Structured reviews, daily assessments
6. **Project Management**: Team assignments, activity logging
7. **Financial Management**: Invoices, expenses, client billing

### Administrative Features
- HR policy management with rich text editing
- Job description templates
- Department and role configuration
- System settings and parameters
- Login tracking and security monitoring

### User Experience
- Role-based access control (Admin/HR/Manager/Employee)
- Responsive design for mobile/desktop
- Real-time notifications and updates
- Comprehensive search and filtering
- Data export capabilities (PDF, Excel)

## Database Integration

### Supabase Backend
- **Database**: PostgreSQL with 30+ migration files
- **Auth**: Email/password authentication with invite system
- **Storage**: Document and image file management
- **Edge Functions**: Server-side processing for complex operations

### Key Tables Identified
- `employees`, `attendance_records`, `leave_requests`
- `payroll_records`, `evaluations`, `projects`
- `clients`, `invoices`, `hr_policies`
- Supporting tables for configuration and relationships

## Component Architecture

### UI Component Library
- 60+ reusable components in `src/components/ui/`
- Feature-specific components (employee-profile/, leave/, etc.)
- Layout components (AppLayout, sidebar, navigation)
- Consistent design system with custom CSS properties

### Key Components Analyzed
- `BeudoxLogo`: Brand component with variant support
- `NavLink`: React Router wrapper with active state
- `SearchableEmployeeSelect`: Advanced employee picker with search
- `AttendanceTab`: Comprehensive attendance display with summaries
- `DocumentsTab`: Placeholder for future document management

## Security & Access Control

### Authentication Flow
- Supabase Auth integration
- Password reset and employee invitation
- Session management with JWT tokens
- Protected routes with role checking

### Authorization Model
- Four user roles with granular permissions
- Route-level and component-level access control
- Database RLS (Row Level Security)
- Audit logging for security events

## Development Infrastructure

### Build & Development
- Vite configuration with React SWC plugin
- Development server on port 8080
- Hot module replacement enabled
- Path aliases (`@/` for `src/`)

### Testing Setup
- Vitest for unit testing
- Playwright for E2E testing
- ESLint for code quality
- TypeScript strict mode

### Configuration Files
- TypeScript configs for app, node, and base
- Tailwind CSS with custom theme
- PostCSS and Autoprefixer
- Supabase project configuration

## Business Logic Insights

### HR Operations
- Automated attendance processing with overtime calculations
- Leave balance management with multiple leave types
- Payroll generation with complex salary computations
- Performance review scheduling and automation
- Notification system for approvals and updates

### Data Processing
- Excel file upload for bulk attendance data
- PDF generation for payslips and invoices
- Rich text processing for policies and documents
- Date/time handling with timezone considerations

## Integration Patterns

### External Services
- Supabase for complete backend solution
- Email notifications via Supabase
- File storage and processing
- Real-time subscriptions for live updates

### Third-party Libraries
- Radix UI for accessible components
- React Query for data fetching
- React Hook Form for form management
- Recharts for data visualization
- Tiptap for rich text editing

## Scalability Considerations

### Code Organization
- Modular component structure
- Feature-based file organization
- Utility function separation
- Type definitions and interfaces

### Performance Optimizations
- Code splitting with dynamic imports
- Query caching and background updates
- Image optimization
- Bundle optimization with Vite

## Documentation Coverage

This baseline analysis provides comprehensive documentation covering:
- Project overview and features
- Technical architecture and stack
- Setup and development instructions
- Component and routing structure
- Database integration details
- Security and access control
- Business logic and operations

The documentation serves as a foundation for developers to understand and contribute to the Beudox HR system.