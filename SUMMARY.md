<!--
generated_by: tessera
source_sha: 0ff6efb7fea87440925f59f47bae0d72be9a80ea
generated_at: 2026-04-01T11:12:52.385Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend React Application  
**Primary Language**: TypeScript (100%)  
**Framework**: React 18 + Vite  
**Database**: Supabase (PostgreSQL)  
**Total Files**: 136 (1305KB)  
**Symbols**: 176 total, 167 public

## Application Purpose

Beudox HR is a comprehensive Human Resources Management System designed to handle:

- **Employee Management**: Profiles, roles, attendance, leave tracking
- **Financial Operations**: Payroll, invoicing, expense management, loans
- **Project Management**: Client projects, team assignments, evaluations
- **Administrative Tools**: HR policies, notifications, company settings

The system implements role-based access control and provides a modern, responsive interface for HR operations.

## Architecture Insights

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite build system
- **UI Framework**: shadcn/ui (Radix UI primitives) + Tailwind CSS
- **Routing**: React Router DOM with protected routes
- **State Management**: React Query for server state, Context API for auth
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: Tiptap editor for HR policies
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Testing**: Vitest (unit), Playwright (E2E)

### Key Architectural Decisions
1. **Component-Based Architecture**: Modular, reusable components following React best practices
2. **Role-Based Security**: Navigation and features filtered by user permissions
3. **Protected Routing**: Authentication and authorization checks at route level
4. **Database Security**: Row Level Security (RLS) policies in Supabase
5. **Optimistic Updates**: Immediate UI feedback with background synchronization

### Code Organization
- **Components**: Feature-based organization (ui/, layout/, hr-policies/)
- **Pages**: Route-based components with CRUD operations
- **Hooks**: Custom hooks for auth, data fetching, and business logic
- **Integrations**: Supabase client and type definitions
- **Utils**: Shared utilities and role access logic

## Key Findings

### Authentication & Authorization
- Supabase Auth integration with email/password and magic links
- Employee data fetched once on login and cached in context
- Role-based navigation filtering using `canAccess()` function
- Protected routes redirect unauthorized users to dashboard

### Database Integration
- 11 database migrations indicating evolved schema
- Supabase Edge Functions for PDF generation and email sending
- TypeScript types auto-generated from database schema
- RLS policies ensure data isolation between companies

### UI/UX Design
- Consistent design system with custom CSS variables (--bx-*)
- Responsive layout with collapsible sidebar
- Rich text editing capabilities for HR content
- Toast notifications and loading states

### Development Practices
- TypeScript for type safety throughout
- ESLint for code quality enforcement
- Comprehensive testing setup (unit + E2E)
- Modern React patterns (hooks, context, suspense)

## Notable Features Discovered

1. **Rich Text Editor**: Tiptap-based editor for HR policy creation with formatting tools
2. **Invoice PDF Generation**: Server-side PDF creation using PDF-lib
3. **Email Integration**: Automated invoice sending via Resend
4. **Role-Based Navigation**: Dynamic sidebar menu based on user permissions
5. **Employee Invitations**: Invite flow with password setup

## Current State

The codebase appears to be a fully functional HR management system beyond the initial foundation phase. It includes comprehensive CRUD operations for employees, projects, invoices, and HR policies, with proper authentication, authorization, and database security measures.

The application demonstrates production-ready code quality with proper error handling, loading states, and user experience considerations.