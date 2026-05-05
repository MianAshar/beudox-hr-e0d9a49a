<!--
generated_by: tessera
source_sha: e0496de59cca92e2d12ac55c15b817a035863b66
generated_at: 2026-05-05T12:42:35.680Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built with modern web technologies. This application provides organizations with tools to manage employee data, track attendance, handle leave requests, process payroll, and oversee various HR operations.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with personal information, job details, and organizational hierarchy
- **Attendance Tracking**: Automated attendance recording with check-in/check-out, overtime calculation, and analytics
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and deductions
- **Performance Reviews**: Employee evaluation system with scheduled reviews and salary adjustments

### Administrative Tools
- **Company Settings**: Configure departments, roles, leave types, expense categories, and project categories
- **User Management**: Role-based access control with customizable permissions
- **Reporting**: Comprehensive analytics and reporting for HR metrics
- **Document Management**: Secure storage and management of employee documents

### Additional Features
- **Project Management**: Assign employees to projects and track project activities
- **Expense Tracking**: Manage and approve employee expense claims
- **Notification System**: Automated notifications for important HR events
- **Multi-tenant Architecture**: Support for multiple companies/organizations

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL database + real-time features)
- **Authentication**: Supabase Auth
- **State Management**: React hooks and context
- **Routing**: React Router
- **Forms**: React Hook Form with validation
- **Charts**: Recharts
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and update the Supabase configuration:
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
   
   If using Supabase CLI:
   ```bash
   supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (default Vite port)

### First-Time Setup

1. Create an admin account through Supabase Auth
2. Set up your company information in the settings
3. Configure departments, roles, and leave types
4. Add employees and assign roles
5. Import attendance data if available

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── employee-profile/ # Employee profile sections
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components (routes)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team or create an issue in the repository.