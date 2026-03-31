<!--
generated_by: tessera
source_sha: 4b6c7840184af8d9333056cebf98c520375f0140
generated_at: 2026-03-31T23:29:41.406Z
action: create
-->

# Beudox HR - Repository Analysis Summary

## Overview

This is a baseline analysis of the Beudox HR frontend application, a comprehensive Human Resources Management System built with modern React technologies. The repository contains 120 files totaling ~1.1MB, with TypeScript as the primary language.

## Key Findings

### Application Architecture
- **Frontend Framework**: React 18 with TypeScript, built with Vite
- **Routing**: React Router DOM with protected routes and role-based access control
- **State Management**: React Query for server state, Context API for authentication
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL database + authentication + real-time)

### Core Features Identified
1. **Employee Management**: CRUD operations for employee profiles
2. **Attendance & Leave**: Time tracking and vacation management
3. **Financial Management**: Payroll, loans, expenses, and finance tracking
4. **Project & Client Management**: Project tracking and client relationships
5. **System Administration**: Settings, notifications, and HR policies

### Technical Implementation
- **Authentication**: Supabase-based with role-based access control
- **Data Fetching**: React Query for efficient server state management
- **Form Handling**: React Hook Form with Zod validation
- **Component Library**: 40+ reusable UI components from shadcn/ui
- **Testing**: Vitest for unit tests, Playwright for E2E testing

### Architecture Patterns
- **Protected Routes**: Route-level authentication and authorization
- **Layout Components**: Consistent navigation with collapsible sidebar
- **Custom Hooks**: Reusable logic for authentication, toasts, and utilities
- **Component Composition**: Modular, reusable component structure

### Key Files Analyzed
- `src/App.tsx`: Main routing and application structure
- `src/components/layout/AppLayout.tsx`: Primary layout component
- `src/components/layout/AppSidebar.tsx`: Navigation with role-based menu items
- `src/components/layout/TopBar.tsx`: Page title management
- `src/components/BeudoxLogo.tsx`: Brand component with variants
- `package.json`: Comprehensive dependency management

### Navigation Structure
The sidebar organizes features into logical sections:
- **MAIN**: Dashboard
- **PEOPLE**: Employees, Attendance, Holidays, Leave Management
- **FINANCE**: Payroll, Finance Sheet, Loans, Expenses, Outsourcing
- **WORK**: Projects, Clients, Evaluations, HR Policies
- **SYSTEM**: Notifications, Settings

### Security & Access Control
- Authentication required for all protected routes
- Role-based permissions determine feature access
- Supabase RLS policies protect database operations
- Password management for invites and resets

### Development Infrastructure
- Modern build pipeline with Vite and TypeScript
- Comprehensive testing setup (unit + E2E)
- Linting and code quality tools
- Environment-based configuration

## Documentation Generated

Based on this analysis, comprehensive documentation has been created:

1. **README.md**: Project overview, setup instructions, and feature descriptions
2. **llms.txt**: Technical context for AI assistants with detailed architecture information
3. **SUMMARY.md**: This analysis summary

The documentation accurately reflects the actual codebase structure and implementation, providing developers with clear guidance for understanding and contributing to the Beudox HR system.