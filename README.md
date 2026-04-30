<!--
generated_by: tessera
source_sha: 03c33e5b18f6d72dac28222731f34c9e1c9d51aa
generated_at: 2026-04-30T20:16:37.796Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built for modern companies to streamline employee management, attendance tracking, leave administration, payroll processing, and organizational workflows.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording with check-in/out, working hours calculation, overtime tracking, and comprehensive reporting
- **Leave Management**: Flexible leave request system with multiple leave types, balance tracking, and approval workflows
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, deductions, and payslip generation
- **Performance Reviews**: Employee evaluation system with scheduled reviews, feedback collection, and salary increment proposals

### Administrative Tools
- **Company Settings**: Configure departments, roles, leave types, expense categories, and company policies
- **Project Management**: Team assignment, project tracking, and activity logging
- **Finance Integration**: Invoice generation and financial summary reporting
- **HR Policies**: Rich text editor for creating and managing company policies
- **Login Monitoring**: Track employee login activity and device information

### User Experience
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **Real-time Notifications**: Instant alerts for approvals, reviews, and system updates
- **Search & Filtering**: Advanced search capabilities across employees, records, and data
- **Data Visualization**: Charts and summaries for attendance, payroll, and performance metrics

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** component library for consistent UI components
- **Lucide React** for modern iconography

### Backend & Infrastructure
- **Supabase** for backend-as-a-service:
  - PostgreSQL database with real-time subscriptions
  - Authentication with role-based access control
  - Edge functions for server-side logic
  - File storage for documents and images
- **React Query** for efficient data fetching and caching

### Development Tools
- **ESLint** for code quality
- **Playwright** for end-to-end testing
- **Vitest** for unit testing
- **TypeScript** for type checking

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase project (sign up at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Database Setup**
   
   The application uses Supabase migrations for database schema. The migrations are located in `supabase/migrations/` and will be applied automatically when you run the Supabase CLI commands.
   
   If you're setting up locally:
   ```bash
   npx supabase start
   npx supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui base components
│   ├── layout/         # App layout components (sidebar, header, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── employee-profile/ # Employee profile sections
│   └── ...
├── pages/              # Page components (Next.js-style routing)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for server logic
```

## Key Components

### Authentication Flow
- **MandatoryPasswordChange**: Forces password reset on first login
- **Role-based Access**: Different permissions for HR, managers, and employees

### Attendance System
- **AttendanceSummary**: Comprehensive analytics with working days, attendance rates, overtime tracking
- **AttendanceUploadFlow**: Bulk import of attendance data
- **Real-time Calculations**: Automatic working hours and overtime computation

### Data Management
- **SearchableEmployeeSelect**: Advanced employee search with avatars and designations
- **Rich Text Editor**: For HR policies and documentation
- **Notification System**: Automated alerts for various HR events

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation for any new features or changes
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.