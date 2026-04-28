<!--
generated_by: tessera
source_sha: 05edf419b373dcd66367c68c70f2f45ed63615f7
generated_at: 2026-04-28T22:00:13.131Z
action: create
-->

# Beudox HR Portal - Code Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React/TypeScript)  
**Primary Language**: TypeScript (166 files)  
**Total Files**: 225 (2067KB)  
**Symbols**: 473 total, 348 public

## What I Discovered

### Application Purpose
This is a comprehensive Human Resources Management System called "Beudox HR Portal" (also referred to as "Forte HR Portal" in some components). It provides a modern web interface for managing all aspects of HR operations including employee profiles, attendance tracking, leave management, payroll processing, performance evaluations, and system administration.

### Technology Stack Analysis
- **Frontend Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL database, Authentication, Edge Functions)
- **Routing**: React Router v6
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Package Manager**: Supports both npm and bun

### Architecture Insights

#### Component Architecture
- **Atomic Design**: UI primitives in `src/components/ui/` (70+ components)
- **Feature-based Organization**: Business components grouped by domain
- **Layout System**: AppLayout provides consistent navigation structure
- **Custom Hooks**: Reusable logic extracted for state management

#### Key Features Identified
1. **Employee Management**: Comprehensive profiles with salary history, reviews, and increment proposals
2. **Attendance System**: Complex upload flow with Excel parsing and AI processing
3. **Leave Management**: Request system with balance tracking and approvals
4. **Payroll Processing**: Automated calculations with overtime and allowances
5. **Performance Evaluations**: Timeline-based tracking and scheduling
6. **Project Management**: Team assignments and activity logging
7. **System Administration**: Company settings, roles, departments, policies

#### Database Integration
- Direct Supabase client usage throughout the application
- Multi-tenant architecture (company-based data isolation)
- Edge Functions for complex server-side operations (attendance parsing)
- Authentication with mandatory password change on first login

### Notable Implementation Details

#### Attendance Upload Flow
The `AttendanceUploadFlow` component is particularly sophisticated:
- Excel file upload with SheetJS library
- AI-powered parsing via Supabase Edge Function
- Automatic calculation of working hours, overtime, and late status
- Batch processing with conflict resolution
- Unmatched employee code handling

#### Authentication Flow
- Supabase Auth integration
- Custom `MandatoryPasswordChange` modal for initial setup
- Password strength validation
- Session refresh and employee data synchronization

#### UI/UX Patterns
- Consistent design system with custom fonts and colors
- Responsive layouts with mobile considerations
- Loading states and error handling
- Toast notifications for user feedback
- Modal dialogs for complex operations

### Code Quality Observations
- **TypeScript Usage**: Strict typing throughout, proper interfaces defined
- **Component Patterns**: Forward refs, proper prop typing, accessibility considerations
- **Error Handling**: Try-catch blocks, user-friendly error messages
- **Performance**: Efficient re-renders, memoization where appropriate
- **Testing**: Basic test setup with Vitest, E2E with Playwright

### Configuration and Environment
- Environment variables for Supabase configuration
- TypeScript configuration for React/Vite setup
- ESLint configuration for code quality
- Tailwind configuration with custom theme
- Playwright configuration for E2E testing

## Key Files Analyzed

### Core Components
- `src/components/MandatoryPasswordChange.tsx`: Authentication flow
- `src/components/AttendanceUploadFlow.tsx`: Complex file upload system
- `src/components/SearchableEmployeeSelect.tsx`: Reusable employee picker
- `src/components/BeudoxLogo.tsx`: Branding component
- `src/components/NavLink.tsx`: Router integration

### Configuration
- `.env`: Supabase credentials
- `package.json`: Dependencies and scripts
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration

## Business Logic Insights

### HR Domain Knowledge
- **Leave Calculations**: Working day calculations excluding weekends/holidays
- **Payroll Processing**: Overtime rates, allowances, tax considerations
- **Review Scheduling**: Automated review cycles with status tracking
- **Attendance Processing**: Time zone handling (Karachi +05:00), shift calculations

### Data Flow Patterns
- Real-time data fetching from Supabase
- Optimistic updates for better UX
- Batch operations for bulk data handling
- Proper error boundaries and fallback states

## Recommendations for Documentation

Based on the analysis, I've generated comprehensive documentation covering:
- Setup instructions and prerequisites
- Feature overview and technology stack
- Project structure and key components
- Technical architecture details
- Business logic explanations

The documentation provides both developer onboarding information and technical context for AI assistants working with this codebase.

## Conclusion

This is a well-architected, feature-rich HR management system built with modern React patterns. The codebase demonstrates good separation of concerns, proper TypeScript usage, and comprehensive business logic implementation. The documentation generated provides a solid foundation for understanding and maintaining this system.