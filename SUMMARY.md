<!--
generated_by: tessera
source_sha: 515930ff3a33e7977abd9ba55d1f7267034c26cd
generated_at: 2026-04-07T11:38:47.773Z
action: create
-->

# Beudox HR - Documentation Analysis Summary

## Repository Overview

This is a baseline analysis of **Beudox HR**, a comprehensive Human Resources Management System. The repository contains a modern React/TypeScript frontend application with 154 files (1445KB) and 178 symbols, primarily focused on HR operations.

## Key Findings

### Application Purpose
Beudox HR is a full-featured HR management platform that enables organizations to:
- Manage employee lifecycles and profiles
- Conduct performance evaluations (quarterly and daily)
- Maintain HR policies with rich text editing
- Track projects, clients, and invoicing
- Configure company settings and role-based permissions

### Architecture Insights
- **Frontend-First Design**: React application with Supabase backend integration
- **Component Architecture**: Well-structured component hierarchy with reusable UI elements
- **Role-Based Security**: Hierarchical access control (hr_manager > ceo > team_lead > employee)
- **Modern Tech Stack**: TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query

### Business Logic Highlights
- **Evaluation System**: Sophisticated performance tracking with visibility controls
- **Rich Content Management**: TipTap-based rich text editing for HR policies
- **Financial Integration**: Invoice generation and PDF export capabilities
- **Real-time Features**: Live updates through Supabase subscriptions

## Technical Architecture

### Core Technologies
- **React 18** with TypeScript for type-safe development
- **Vite** for fast build times and development experience
- **Supabase** for authentication, database, and serverless functions
- **Tailwind CSS + shadcn/ui** for consistent, accessible UI components
- **TanStack Query** for efficient data fetching and caching

### Key Components Analyzed
- **AppLayout**: Main application shell with responsive sidebar navigation
- **EvaluationTimeline**: Complex component handling evaluation display with role-based filtering
- **RichTextEditor**: Full-featured editor for HR policy creation
- **NavLink**: Custom navigation component with active state management
- **BeudoxLogo**: Flexible logo component with variant support

### Routing Structure
The application features comprehensive routing for:
- Authentication flows (login, password reset)
- Core HR functions (employees, evaluations, policies)
- Business operations (projects, clients, invoices)
- Administrative settings

## Data Flow & State Management

- **Authentication**: Supabase Auth with custom role-based access control
- **Data Fetching**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Real-time Updates**: Supabase real-time subscriptions

## Security & Access Control

- **Protected Routes**: All business routes require authentication
- **Role-Based Permissions**: Hierarchical access with specific route restrictions
- **Data Visibility**: Evaluation recommendations hidden from employees
- **Session Management**: Automatic redirects and loading states

## Development & Deployment

- **Build System**: Vite with optimized production builds
- **Testing**: Vitest for unit tests, Playwright for E2E testing
- **Code Quality**: ESLint with TypeScript and React rules
- **Environment**: Supabase environment variables required

## Notable Implementation Details

- **Evaluation Filtering**: Complex logic for showing/hiding evaluations based on user roles and relationships
- **Rich Text Integration**: TipTap editor with custom toolbar and link handling
- **Responsive Design**: Mobile-friendly layout with collapsible sidebar
- **Loading States**: Comprehensive loading indicators to prevent content flashing

This baseline analysis provides a comprehensive foundation for understanding the Beudox HR system's architecture, features, and implementation patterns.