<!--
generated_by: tessera
source_sha: 4ecbd4315761424bce1ba20f63480a717ee88eab
generated_at: 2026-04-27T10:58:39.484Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React + TypeScript)  
**Primary Purpose**: Comprehensive Human Resources Management System  
**Technology Stack**: React 18, TypeScript, Vite, Supabase, Tailwind CSS, shadcn/ui

## Key Architectural Insights

### Application Structure
This is a modern, component-driven React application built for HR management. The codebase demonstrates several architectural strengths:

1. **Clear Component Organization**: Components are logically grouped by feature (attendance, employee-profile, leave, payroll, settings, etc.)
2. **Type Safety**: Extensive use of TypeScript interfaces and types, especially for Supabase database integration
3. **Separation of Concerns**: Business logic separated into utility libraries, hooks for state management, and components for UI
4. **Scalable Architecture**: Modular design that can accommodate additional HR features

### Technology Choices
- **React 18** with modern hooks and concurrent features
- **Supabase** as full-stack backend (database, auth, storage, edge functions)
- **shadcn/ui** for consistent, accessible UI components
- **TanStack Query** for robust server state management
- **Vite** for fast development and optimized builds

## Core Business Features Discovered

### 1. Employee Management
- Comprehensive employee profiles with personal, job, and organizational data
- Searchable employee selection components
- Role-based access control throughout the application

### 2. Attendance System
- **Complex Upload Flow**: The `AttendanceUploadFlow` component implements a sophisticated multi-step process:
  - File upload with Excel/CSV parsing
  - AI-powered data extraction using Supabase Edge Functions
  - Employee code matching and validation
  - Overtime and late calculation based on company settings
  - Bulk import with conflict resolution
- Real-time attendance tracking with check-in/check-out times
- Integration with biometric devices (ZKTeco-compatible)

### 3. Leave Management
- Multi-type leave system (annual, sick, maternity, etc.)
- Request submission and approval workflows
- Balance tracking and automatic calculations

### 4. Payroll Processing
- Automated payroll generation from attendance data
- Salary structures with allowances and deductions
- PDF payslip generation

### 5. Performance Management
- Employee evaluations and review cycles
- Salary review and increment proposals
- Review schedule management with automated alerts

### 6. Project Management
- Project creation and team assignment
- Task tracking and activity logging
- Resource management

### 7. Administrative Tools
- Company-wide settings and configurations
- Department and role management
- System audit logs and login tracking
- Expense category management

## Important Files and Their Roles

### Core Application Files
- `src/main.tsx`: Application bootstrap and root rendering
- `src/App.tsx`: Main app component with routing
- `src/pages/Index.tsx`: Primary dashboard/landing page

### Key Business Logic Files
- `src/components/attendance/AttendanceUploadFlow.tsx`: Most complex component - handles bulk attendance import with AI parsing, validation, and database operations
- `src/components/employee-profile/AttendanceTab.tsx`: Employee attendance history display with summary calculations
- `src/lib/attendance-format.ts`: Time formatting utilities for attendance data
- `src/lib/leave-utils.ts`: Leave balance calculation functions
- `src/lib/role-access.ts`: Permission checking and access control

### Infrastructure Files
- `src/integrations/supabase/client.ts`: Supabase client configuration
- `src/integrations/supabase/types.ts`: Database schema types (479 symbols, 354 public)
- `src/hooks/useAuth.ts`: Authentication state management
- `src/hooks/use-toast.ts`: Notification system

### Configuration Files
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration
- `supabase/config.toml`: Backend configuration
- `.env`: Environment variables for Supabase integration

## Database Integration Patterns

### Supabase Usage
- **Real-time Subscriptions**: For live updates on attendance, notifications, etc.
- **Edge Functions**: Complex business logic (AI parsing, payroll generation, PDF creation)
- **Row Level Security**: Company-based data isolation
- **File Storage**: Document and avatar management

### Data Flow Patterns
1. **Attendance Processing**: Raw data → AI parsing → Validation → Calculation → Storage
2. **Payroll Generation**: Attendance aggregation → Calculation → PDF generation → Storage
3. **Leave Management**: Request → Approval workflow → Balance updates → Attendance integration

## Security and Access Control

### Authentication
- Supabase Auth for user management
- JWT-based session handling
- Password reset and email verification

### Authorization
- Role-based permissions (admin, manager, employee)
- Component-level access control
- Database queries filtered by company_id
- API operations validated against user permissions

## Notable Technical Patterns

### Component Design
- **Compound Components**: Many components use multiple sub-components (e.g., searchable selects)
- **Controlled Components**: Form inputs with proper state management
- **Render Props**: For flexible component composition

### State Management
- **Server State**: TanStack Query for API data
- **Local State**: React hooks for UI state
- **Global State**: Context for authentication and app-wide state

### Error Handling
- Toast notifications for user feedback
- Try-catch blocks in async operations
- Graceful fallbacks for failed operations

### Performance Optimizations
- Query caching and background updates
- Lazy loading where appropriate
- Efficient re-renders with proper dependencies

## Testing and Quality Assurance

### Test Coverage
- Unit tests with Vitest
- E2E tests with Playwright
- Component testing with React Testing Library

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Prettier for code formatting

## Scalability Considerations

### Current Strengths
- Modular component architecture
- Database schema designed for growth
- Edge functions for server-side processing
- Real-time capabilities for live updates

### Potential Areas for Enhancement
- Component lazy loading for better initial load times
- Service layer abstraction for API calls
- Error boundary implementation for better error handling
- Progressive Web App features for offline capability

## Development Workflow

### Build Process
- Vite for fast development builds
- TypeScript compilation
- Tailwind CSS processing
- Asset optimization for production

### Deployment
- Static site generation
- CDN-ready build output
- Environment-specific configuration

## Summary

Beudox HR is a well-architected, feature-rich HR management system that demonstrates modern React development practices. The codebase shows careful attention to user experience, performance, security, and maintainability. The most complex component (`AttendanceUploadFlow`) showcases sophisticated data processing capabilities with AI integration, while the overall architecture provides a solid foundation for continued development and scaling.

The application successfully addresses comprehensive HR needs while maintaining clean, maintainable code that follows industry best practices.