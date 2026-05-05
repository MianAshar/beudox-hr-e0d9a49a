<!--
generated_by: tessera
source_sha: 55b76f913056a5a1f57f2afcd0f1dbe37f5b5d46
generated_at: 2026-05-05T18:12:15.069Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built for modern businesses. This frontend application provides a complete suite of HR tools including employee management, attendance tracking, leave management, payroll processing, performance evaluations, and administrative settings.

## Features

### Core HR Functionality
- **Employee Profiles**: Comprehensive employee information management with personal details, job history, and documentation
- **Attendance Management**: Automated attendance tracking with check-in/out, overtime calculation, and analytics dashboard
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.) with balance monitoring
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and overtime pay
- **Performance Reviews**: Employee evaluation system with scheduled reviews and salary increment proposals
- **Project Management**: Team assignment and project tracking capabilities

### Administrative Tools
- **Company Settings**: Configure company information, departments, roles, and policies
- **HR Policies**: Rich text editor for creating and managing company policies
- **Expense Management**: Track and categorize business expenses
- **Login Monitoring**: Track employee login activity and device information

### Analytics & Reporting
- **Attendance Analytics**: Detailed insights into attendance patterns, punctuality, and anomalies
- **Payroll Reports**: Comprehensive payroll summaries and employee-specific reports
- **Finance Overview**: Financial summaries and expense tracking

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL database with real-time capabilities)
- **State Management**: React hooks and context
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Configured for modern hosting platforms

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory to set up the database schema.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile sections
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Route components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
```

## Key Components

### Authentication Flow
- **MandatoryPasswordChange**: Forces password reset on first login
- **Role-based Access**: Different permissions for employees, managers, and admins

### Data Management
- **Supabase Integration**: Real-time database operations
- **Type Safety**: Full TypeScript coverage with generated types

### User Experience
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance**: Optimized with lazy loading and efficient re-renders

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for React and TypeScript best practices
- **Prettier**: Code formatting (via ESLint)

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure responsive design works across devices

## License

This project is proprietary software. All rights reserved.
