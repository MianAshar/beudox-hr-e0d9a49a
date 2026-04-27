<!--
generated_by: tessera
source_sha: a1bff7edbae84e80501fe849fd7caafe65784f2f
generated_at: 2026-04-27T22:53:31.948Z
action: create
-->

# Beudox HR Portal - Analysis Summary

## Repository Overview

This is a comprehensive Human Resources Management System built as a modern React/TypeScript frontend application. The codebase contains 224 files with 468 symbols, primarily focused on HR operations including employee management, attendance tracking, leave requests, payroll, and organizational settings.

## Key Discoveries

### Application Scope
- **Full HR Suite**: Complete HR management platform with employee profiles, attendance, leave, payroll, evaluations, and project management
- **Multi-tenant**: Company-based architecture supporting multiple organizations
- **Role-based Access**: Comprehensive permission system with different user roles
- **Real-time Features**: Live notifications and data updates using Supabase subscriptions

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React hooks + context
- **Routing**: React Router
- **Forms**: React Hook Form
- **Charts**: Recharts
- **File Processing**: SheetJS for Excel parsing

### Architecture Patterns
- **Component-based**: Extensive reusable component library
- **Feature-based**: Components organized by domain (attendance, leave, payroll, etc.)
- **Custom Hooks**: Business logic abstracted into reusable hooks
- **Utility Functions**: Shared logic in dedicated lib files
- **Type Safety**: Full TypeScript coverage with generated types from Supabase

## Important Files and Roles

### Core Application Files
- `src/main.tsx`: Application entry point with routing setup
- `src/pages/Index.tsx`: Main dashboard page
- `src/App.tsx`: Root component with authentication routing

### Key Components
- `src/components/layout/AppLayout.tsx`: Main application layout
- `src/components/layout/AppSidebar.tsx`: Navigation sidebar
- `src/components/MandatoryPasswordChange.tsx`: Password reset flow
- `src/components/attendance/AttendanceUploadFlow.tsx`: Complex file upload with AI parsing
- `src/components/SearchableEmployeeSelect.tsx`: Employee selection component

### Business Logic
- `src/lib/role-access.ts`: Permission and access control
- `src/lib/notifications.ts`: Notification system
- `src/lib/attendance-format.ts`: Time formatting utilities
- `src/lib/leave-utils.ts`: Leave balance calculations
- `src/hooks/useAuth.ts`: Authentication state

### Configuration
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration
- `supabase/config.toml`: Database configuration
- `.env`: Environment variables

## Architectural Insights

### Data Flow
1. **Authentication**: Supabase Auth with custom user management
2. **Data Access**: Direct Supabase client usage with RLS
3. **Real-time Updates**: Subscriptions for live data
4. **File Processing**: Client-side Excel parsing with AI assistance
5. **State Management**: Local component state with server sync

### Security Model
- Row-level security on all database tables
- Role-based permissions (admin, manager, employee)
- Authentication required for all operations
- Secure file uploads and processing

### Performance Considerations
- Lazy loading of components
- Efficient database queries
- Image optimization
- Bundle splitting
- Real-time subscriptions (used judiciously)

## Notable Features

### Attendance System
- Excel file upload with AI-powered parsing
- Automatic overtime calculation
- Late arrival detection
- Weekend/holiday handling
- Bulk import with conflict resolution

### Leave Management
- Multiple leave types (vacation, sick, etc.)
- Balance tracking and validation
- Approval workflows
- Integration with attendance

### Employee Profiles
- Comprehensive profile management
- Document storage
- Salary history
- Performance reviews
- Project assignments

### Settings and Configuration
- Company-wide settings
- Department management
- Role configuration
- Leave type customization
- Expense categories

## Development Quality

- **Type Safety**: Full TypeScript implementation
- **Code Organization**: Clear file structure and naming
- **Component Reusability**: Extensive use of shared components
- **Error Handling**: Comprehensive error states and user feedback
- **Testing**: Unit tests with Vitest and Playwright e2e
- **Code Quality**: ESLint configuration and consistent formatting

## Integration Points

- **Supabase**: Primary backend with database, auth, and storage
- **Email Notifications**: Automated HR notifications
- **File Storage**: Document and image management
- **PDF Generation**: Payslip and report generation
- **Excel Processing**: Attendance data import

This codebase represents a production-ready HR management system with enterprise-level features and modern development practices.