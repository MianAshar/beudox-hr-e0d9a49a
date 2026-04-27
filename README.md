<!--
generated_by: tessera
source_sha: 53323254fc69ce8ff4487eef81676ac10a41cd73
generated_at: 2026-04-27T22:14:28.131Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built for modern businesses. Beudox HR streamlines employee management, attendance tracking, leave requests, payroll processing, and organizational workflows.

## Features

### Employee Management
- **Employee Profiles**: Complete employee information including personal details, job descriptions, and organizational hierarchy
- **Attendance Tracking**: Automated attendance monitoring with manual upload capabilities and real-time status updates
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, personal)
- **Payroll Processing**: Automated payroll calculations including overtime, deductions, and salary reviews
- **Performance Reviews**: Scheduled evaluations and salary increment proposals

### Organizational Tools
- **Company Settings**: Configure departments, roles, leave types, expense categories, and company policies
- **Project Management**: Assign employees to projects and track team activities
- **HR Policies**: Rich text editor for creating and managing company policies
- **Notifications**: Automated notifications for important HR events and deadlines

### Analytics & Reporting
- **Finance Dashboard**: Overview of payroll expenses and financial summaries
- **Attendance Analytics**: Detailed reports on employee attendance patterns
- **Payroll Reports**: Comprehensive payroll summaries and historical data

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL database + real-time subscriptions)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
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
   bun install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and update the Supabase credentials:
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
   npm run dev
   # or
   bun run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── employee-profile/ # Employee profile related components
│   ├── attendance/     # Attendance management components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── settings/       # Settings and configuration components
│   └── ...
├── pages/              # Next.js pages (Pages Router)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
└── main.tsx           # Application entry point
```

## Key Components

### Core Components
- **AppLayout**: Main application layout with sidebar navigation
- **BeudoxLogo**: Brand logo component with variant support
- **NavLink**: Enhanced navigation link with active state styling
- **SearchableEmployeeSelect**: Employee selection component with search functionality

### Feature Components
- **AttendanceUploadFlow**: Complex attendance data upload with AI parsing
- **AttendanceTab**: Employee attendance history and analytics
- **LeaveBalancesTab**: Leave balance management
- **PayrollSummary**: Payroll calculation and display
- **EvaluationTimeline**: Performance review timeline

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
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint)
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

## Deployment

The application can be deployed to any static hosting service that supports SPA routing:

- **Vercel**: Recommended for Next.js compatibility
- **Netlify**: Good alternative with built-in form handling
- **AWS S3 + CloudFront**: For AWS-based deployments

### Environment Variables for Production

Ensure these environment variables are set in your deployment platform:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

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