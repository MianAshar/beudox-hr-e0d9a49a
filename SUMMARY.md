<!--
generated_by: tessera
source_sha: 7ffb1b86e9cd74132ef738aca1165796264a4de4
generated_at: 2026-04-17T15:20:11.501Z
action: create
-->

# Beudox HR - Codebase Analysis Summary

## Repository Overview

**Repository**: MianAshar/beudox-hr-e0d9a49a  
**Type**: Frontend Application (React/TypeScript)  
**Primary Purpose**: Human Resources Management System  
**Lines of Code**: ~1.7MB across 180 files  
**Main Technologies**: React 18, TypeScript, Vite, Supabase, Tailwind CSS

## Key Discoveries

### Application Domain
This is a comprehensive HR management platform with the following core features:
- Employee lifecycle management (onboarding, profiles, roles)
- Performance evaluation system (quarterly + daily feedback)
- Leave management and approval workflows
- Attendance tracking and payroll integration
- Expense claim processing
- HR policy management with rich text editing
- Notification system for HR events

### Architecture Insights

**Frontend Architecture**:
- Single-page application built with React and TypeScript
- Component-based architecture using shadcn/ui for consistent UI
- Client-side routing with React Router DOM
- Server state management via TanStack Query
- Supabase integration for backend services and real-time features

**Backend Integration**:
- Supabase as the backend-as-a-service platform
- PostgreSQL database with Row Level Security (RLS)
- Edge Functions for server-side logic (payroll, PDF generation, notifications)
- Authentication and authorization via Supabase Auth

**Key Architectural Patterns**:
- Role-based access control with four user roles (employee, team_lead, hr_manager, ceo)
- Component composition for complex UI features
- Query-based data fetching with automatic caching
- Event-driven notifications and real-time updates

### Code Quality Observations

**Strengths**:
- Strong TypeScript usage throughout the codebase
- Consistent component patterns and prop interfaces
- Good separation of concerns (components, hooks, utilities)
- Comprehensive UI component library (shadcn/ui)
- Proper error handling and loading states

**Notable Components**:
- `EvaluationTimeline`: Complex component handling multiple evaluation types with role-based visibility
- `SearchableEmployeeSelect`: Reusable component with search, avatars, and filtering
- `RichTextEditor`: Full-featured editor using Tiptap with toolbar
- Layout components with responsive design and role-based navigation

### Database Schema Insights

From the migration files, the system manages:
- Multi-tenant architecture (companies table)
- Complex employee relationships and hierarchies
- Evaluation workflows with different types (quarterly/daily)
- Approval processes for leaves and expenses
- Document management for HR policies
- Attendance and payroll integration

### Technology Ecosystem

**Core Dependencies**:
- React ecosystem: react-router-dom, @tanstack/react-query
- UI/Styling: tailwindcss, shadcn/ui components
- Rich Text: @tiptap/react, @tiptap/starter-kit
- Utilities: date-fns, lucide-react
- Backend: @supabase/supabase-js

**Development Tools**:
- Build: Vite
- Testing: Vitest, Playwright
- Linting: ESLint
- Package Manager: npm/bun (based on lockfiles)

## Documentation Generated

Based on the codebase analysis, I've created comprehensive documentation:

1. **README.md**: Project overview, features, setup instructions, and architecture description
2. **llms.txt**: Technical context for AI assistants, including architecture patterns, key files, and development practices
3. **SUMMARY.md**: This analysis summary

The documentation provides a solid foundation for developers to understand and contribute to the Beudox HR system, covering both high-level concepts and implementation details.