<!--
generated_by: tessera
source_sha: 078d3cfb3785a1e59cbcffe650e6c48b188663a4
generated_at: 2026-04-27T22:33:33.194Z
action: update
-->

# Beudox HR - Employee Management System

Beudox HR is a comprehensive web-based Human Resources management application built with modern web technologies. It provides organizations with tools to manage employee data, track attendance, handle leave requests, process payroll, conduct evaluations, and maintain company policies.

## Features

### Core HR Functionality
- **Employee Profiles**: Comprehensive employee information management including personal details, job descriptions, salary history, and performance reviews
- **Attendance Management**: Automated attendance tracking with Excel import capabilities, overtime calculations, and shift management
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.) with balance tracking
- **Payroll Processing**: Automated payroll generation with overtime calculations and salary history tracking
- **Performance Evaluations**: Structured evaluation processes with customizable parameters and review scheduling

### Administrative Tools
- **Company Settings**: Configure departments, roles, expense categories, and company-wide policies
- **User Management**: Role-based access control with granular permissions
- **Finance Tracking**: Expense management and financial summaries
- **Project Management**: Team assignments and project activity tracking
- **HR Policies**: Rich text editor for creating and maintaining company policies

### Advanced Features
- **AI-Powered Data Processing**: Intelligent parsing of attendance data from various formats
- **Real-time Notifications**: Automated alerts for reviews, approvals, and system events
- **Audit Logging**: Comprehensive tracking of user activities and system changes
- **Multi-tenant Architecture**: Support for multiple companies within a single instance

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Backend**: Supabase (PostgreSQL database with real-time capabilities)
- **Authentication**: Supabase Auth
- **State Management**: React Query for server state, custom hooks for local state
- **Routing**: React Router
- **Forms**: React Hook Form with validation
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns
- **Icons**: Lucide React

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
   
   Copy the `.env` file and update the Supabase configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

4. **Database Setup**
   
   The application uses Supabase migrations. If setting up a new project:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Apply migrations
   supabase db push
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist` directory.

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
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components (Next.js Pages Router style)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── main.tsx            # Application entry point

supabase/
├── migrations/         # Database schema migrations
├── functions/          # Edge functions for AI processing
└── config.toml         # Supabase configuration
```

## Key Components

### Core Components
- **AppLayout**: Main application layout with sidebar navigation
- **BeudoxLogo**: Brand logo component with variant support
- **NavLink**: Enhanced navigation link with active state styling
- **SearchableEmployeeSelect**: Employee selection component with search functionality

### Feature Components
- **AttendanceUploadFlow**: Complex workflow for importing attendance data from Excel files
- **AttendanceTab**: Employee attendance records display with filtering
- **LeaveBalancesTab**: Leave balance tracking and requests
- **PayrollSummary**: Payroll data visualization
- **EvaluationTimeline**: Performance evaluation tracking

## API Integration

The application integrates with Supabase for:
- **Authentication**: User login/logout and session management
- **Database**: PostgreSQL database with real-time subscriptions
- **Storage**: File uploads for documents and avatars
- **Edge Functions**: Serverless functions for AI-powered attendance parsing

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Component naming follows React conventions

### State Management
- React Query for server state (API data)
- Local component state for UI interactions
- Custom hooks for shared logic

### Testing
- Vitest for unit testing
- Playwright for end-to-end testing
- Component testing with React Testing Library

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