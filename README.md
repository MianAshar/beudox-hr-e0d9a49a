<!--
generated_by: tessera
source_sha: 2a26b34948f18deb6f98a39c116758461a197ea5
generated_at: 2026-04-23T22:51:32.806Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with tools to manage employee data, attendance tracking, leave management, payroll processing, performance evaluations, and more.

## Features

### Employee Management
- **Employee Profiles**: Comprehensive employee information including personal details, job descriptions, and organizational hierarchy
- **Attendance Tracking**: Real-time attendance monitoring with check-in/check-out, overtime calculation, and absence management
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.) with balance monitoring
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and deductions
- **Document Management**: Secure storage and organization of employee documents

### HR Operations
- **Performance Reviews**: Scheduled evaluations with customizable parameters and review cycles
- **Project Management**: Team assignments, project tracking, and activity logging
- **Finance Overview**: Financial summaries and expense tracking
- **Notifications**: Automated alerts for reviews, approvals, and important HR events

### Administrative Tools
- **Settings Management**: Configure departments, roles, leave types, expense categories, and company policies
- **User Access Control**: Role-based permissions and login tracking
- **Audit Logs**: Comprehensive logging of system activities and user actions

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **State Management**: React Query for server state
- **Routing**: React Router
- **Testing**: Vitest + Playwright for E2E testing
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   bun install
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
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Development Server**
   ```bash
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
bun run build
```

The built files will be in the `dist/` directory.

### Testing

- **Unit Tests**: `bun run test`
- **E2E Tests**: `bun run test:e2e`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── employee-profile/  # Employee profile related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and business logic
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── ...

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for backend logic
```

## Contributing

1. Follow the existing code style and component patterns
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.