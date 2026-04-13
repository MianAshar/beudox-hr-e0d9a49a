<!--
generated_by: tessera
source_sha: 46dfb6ac3a974a552a857eb52d0e4225e2601dd1
generated_at: 2026-04-13T10:27:21.841Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend React Application  
**Primary Language**: TypeScript (132 files)  
**Total Files**: 180 (1676KB)  
**Symbols**: 304 total, 261 public

## Architecture & Technology Stack

### Core Framework
- **React 18** with TypeScript for type-safe component development
- **Vite** as build tool with SWC for fast compilation
- **React Router v6** for client-side routing with protected routes

### State Management & Data Fetching
- **TanStack Query (React Query)** for server state management and caching
- **React Context** for authentication state
- **Supabase** as backend-as-a-service (database, auth, storage, edge functions)

### UI & Styling
- **Shadcn UI** built on Radix UI primitives for accessible components
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **Recharts** for data visualization

### Forms & Validation
- **React Hook Form** for performant form handling
- **Zod** for schema validation and type inference

### Rich Content
- **Tiptap** rich text editor for HR policies and content creation

## Application Features

### HR Core Functionality
1. **Employee Management** - Complete employee lifecycle (CRUD operations, profiles)
2. **Leave Management** - Request/approval workflows with balance tracking
3. **Payroll Processing** - Automated salary calculation and payslip generation
4. **Performance Evaluations** - Quarterly formal reviews + daily feedback system
5. **HR Policies** - Centralized policy management with rich text editing

### Business Operations
6. **Project Management** - Project tracking with client and employee associations
7. **Client Management** - Client profiles and relationship management
8. **Invoice Management** - Professional billing and invoice tracking
9. **Loan Management** - Employee loan processing and repayment
10. **Finance Sheets** - Financial reporting and analytics

### Administrative Features
11. **Settings Management** - Company configuration (departments, roles, parameters)
12. **Public Holidays** - Centralized holiday calendar management
13. **Notifications** - Automated system for important events

## Key Architectural Insights

### Route Structure & Access Control
- **Role-based routing** with 4 user roles: CEO, HR Manager, Team Lead, Employee
- **Protected routes** implemented via `ProtectedRoute` component
- **Permission checking** through `canAccess()` utility function
- **36 distinct routes** covering all major features

### Component Organization
- **Atomic design** with base UI components in `src/components/ui/`
- **Feature-based grouping** (evaluations/, leave/, settings/)
- **Layout components** for consistent app shell (AppLayout, Sidebar, TopBar)
- **Reusable components** like SearchableEmployeeSelect, EvaluationTimeline

### Data Layer
- **Supabase integration** with typed client and generated types
- **23 SQL migrations** indicating evolved database schema
- **Edge functions** for complex business logic (payroll, notifications, PDF generation)
- **Real-time capabilities** for live updates

### Development Infrastructure
- **Comprehensive testing** setup with Vitest (unit) and Playwright (E2E)
- **ESLint + TypeScript** for code quality
- **Path aliases** (@/ for src/) for clean imports
- **Development server** on port 8080 with HMR

## Business Logic Patterns

### Evaluation System
- **Dual evaluation types**: Quarterly (formal) and Daily (quick feedback)
- **Visibility controls**: Role-based access to evaluation data
- **Structured feedback**: Scores, comments, recommendations

### Leave Management
- **Balance tracking**: Multiple leave types with accrual logic
- **Approval workflows**: Hierarchical approval routing
- **Calendar integration**: Conflict prevention

### Payroll Processing
- **Automated calculations**: Base salary + allowances + overtime
- **Overtime handling**: Regular and holiday rates
- **PDF generation**: Payslip creation and email delivery

## Code Quality Observations

### Strengths
- **Type safety** throughout with TypeScript
- **Consistent patterns** for components and data fetching
- **Accessible UI** using Radix primitives
- **Performance optimized** with query caching and code splitting
- **Well-organized** file structure following React best practices

### Notable Components
- **EvaluationTimeline**: Complex component handling multiple evaluation types with filtering
- **RichTextEditor**: Full-featured editor using Tiptap with custom toolbar
- **SearchableEmployeeSelect**: Advanced select with search, avatars, and multi-selection
- **App routing**: Comprehensive route protection and redirection logic

## Database Schema Insights

Based on migration files, the system manages:
- **Multi-tenant architecture** with company isolation
- **Complex relationships** between employees, projects, clients
- **Audit trails** for evaluations and approvals
- **Financial data** for payroll and invoicing
- **Document storage** for policies and attachments

## Development Readiness

The codebase appears **production-ready** with:
- Comprehensive feature set covering major HR operations
- Robust error handling and loading states
- Responsive design for multiple devices
- Security considerations (authentication, authorization)
- Testing infrastructure in place
- Build optimization for performance

This analysis reveals a well-architected, feature-rich HR management system built with modern React patterns and a solid foundation for enterprise use.