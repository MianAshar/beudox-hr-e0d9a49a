<!--
generated_by: tessera
source_sha: 7ffb1b86e9cd74132ef738aca1165796264a4de4
generated_at: 2026-04-17T15:16:01.082Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend React Application  
**Primary Language**: TypeScript  
**Total Files**: 180 (1674KB)  
**Symbols**: 298 total, 255 public

## Application Purpose

Beudox HR is a comprehensive Human Resources management system designed to streamline employee management, leave tracking, performance evaluations, and company policy administration. The application serves multiple user roles (CEO, HR Manager, Team Lead, Employee) with appropriate permissions and interfaces.

## Architecture Insights

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build System**: Vite for fast development and optimized production builds
- **Routing**: React Router with custom navigation components
- **State Management**: TanStack Query for server state, React Context for auth
- **UI Library**: shadcn/ui components with Tailwind CSS styling

### Backend Integration
- **Database**: Supabase (PostgreSQL) with 23 migration files
- **Authentication**: Supabase Auth with role-based access control
- **Edge Functions**: Custom Supabase functions for business logic (payroll, invoices, notifications)
- **Real-time**: Live updates via Supabase subscriptions

### Component Organization
- **Layout Components**: AppLayout, AppSidebar, TopBar for consistent navigation
- **Feature Components**: Modular components for leave, evaluations, settings, policies
- **UI Components**: 50+ reusable shadcn/ui components
- **Business Logic**: Utility functions for leave calculations, notifications, role management

## Key Features Discovered

1. **Employee Management**
   - Profile management with avatars and role assignments
   - Searchable employee selection components
   - Department and role configuration

2. **Leave Management**
   - Leave request system with approval workflows
   - Balance tracking and calendar integration
   - Multiple leave types (vacation, sick, etc.)

3. **Performance Evaluations**
   - Quarterly evaluations with scoring and recommendations
   - Daily feedback system with peer reviews
   - Timeline visualization of evaluation history
   - Role-based visibility controls

4. **HR Policies**
   - Rich text policy creation and management
   - Tiptap-based editor with formatting options

5. **Company Settings**
   - Multi-tab configuration interface
   - Departments, roles, attendance rules
   - Expense categories and notification settings

6. **Notifications**
   - In-app notification system
   - Real-time updates with bell indicator
   - Automated notifications for approvals and evaluations

## Technical Patterns

### Data Fetching
- Consistent use of TanStack Query for all API calls
- Proper loading states and error handling
- Optimistic updates for better user experience

### Authentication & Permissions
- Role-based UI rendering (employee vs manager views)
- Permission checks before API operations
- Secure environment variable management

### Component Design
- Functional components with hooks
- Proper prop typing with TypeScript interfaces
- Reusable components with customizable variants
- Consistent naming conventions

### Styling Approach
- Utility-first CSS with Tailwind
- CSS custom properties for theming
- Responsive design patterns
- Consistent spacing and typography

## Database Schema Insights

Based on migration files and component usage:

- **employees**: Core user table with profile information
- **leave_requests**: Request tracking with approval status
- **evaluations**: Quarterly performance data
- **daily_evaluations**: Peer feedback system
- **hr_policies**: Document storage
- **departments** & **roles**: Organizational structure
- **notifications**: Communication system
- **expense_categories**: Financial tracking

## Notable Implementation Details

1. **Evaluation System**: Sophisticated visibility rules based on user roles - managers see recommendations, employees see limited views

2. **Rich Text Editor**: Custom Tiptap integration with toolbar for policy creation

3. **Searchable Select**: Advanced employee picker with avatar display and search functionality

4. **Timeline Component**: Unified view combining quarterly and daily evaluations with proper sorting

5. **Logo Component**: Flexible logo rendering with variant support for different contexts

## Development Environment

- **Package Manager**: npm/bun support
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Linting**: ESLint configuration
- **Type Checking**: TypeScript with strict settings
- **CSS Processing**: Tailwind with PostCSS

## Areas for Potential Enhancement

1. **Testing Coverage**: Basic test setup exists but limited test files
2. **Error Boundaries**: No visible error boundary components
3. **Performance**: Could benefit from code splitting and lazy loading
4. **Accessibility**: UI components may need ARIA improvements
5. **Internationalization**: No i18n setup detected

## Conclusion

This is a well-structured, feature-rich HR management application with modern React patterns, comprehensive Supabase integration, and a polished user interface. The codebase demonstrates good separation of concerns, consistent coding practices, and scalable architecture suitable for enterprise HR operations.