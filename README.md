<!--
generated_by: tessera
source_sha: 03da599b9041067096b920d152faa03e7857660f
generated_at: 2026-04-27T11:14:53.808Z
action: update
-->

# Beudox HR Frontend Application

A modern, comprehensive Human Resources Management System built as a React-based frontend application. This application provides a complete suite of HR tools including employee management, attendance tracking, leave management, payroll processing, and organizational settings.

## Features

### Core HR Functionality
- **Employee Management**: Comprehensive employee profiles with personal details, job information, and organizational hierarchy
- **Attendance Tracking**: Automated attendance import from biometric systems, manual entry, and detailed reporting
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, personal)
- **Payroll Processing**: Salary calculations, overtime tracking, and payroll generation
- **Performance Reviews**: Employee evaluations, salary reviews, and increment proposals

### Administrative Tools
- **Company Settings**: Configure departments, roles, leave types, expense categories, and evaluation parameters
- **User Management**: Role-based access control with granular permissions
- **Project Management**: Team assignments and project activity tracking
- **HR Policies**: Rich text editor for policy documents

### User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Notifications**: Instant updates on important HR events
- **Search & Filter**: Advanced search capabilities across all data
- **Data Visualization**: Charts and summaries for HR metrics

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router
- **State Management**: React Query for server state, Zustand for client state
- **Backend Integration**: Supabase (PostgreSQL database, real-time subscriptions, authentication)
- **UI Components**: Custom component library with Radix UI primitives
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with validation
- **Date Handling**: date-fns
- **Icons**: Lucide React

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

5. **Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
# or
bun build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── attendance/     # Attendance-related components
│   ├── employee-profile/ # Employee profile tabs
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   └── ...
├── pages/              # Page components (Next.js style routing)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── main.tsx           # Application entry point
```

## Key Components

### Layout System
- `AppLayout`: Main application layout with sidebar navigation
- `AppSidebar`: Collapsible sidebar with menu items
- `TopBar`: Header with user menu and notifications
- `NotificationBell`: Real-time notification system

### Core Features
- `AttendanceUploadFlow`: Complex attendance import with AI parsing
- `SearchableEmployeeSelect`: Employee search and selection component
- `BeudoxLogo`: Brand logo component with variant support
- `NavLink`: Enhanced navigation link with active state styling

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint)
- **Testing**: Unit tests with Vitest and React Testing Library

### Architecture Patterns

- **Component Composition**: Modular, reusable components
- **Custom Hooks**: Business logic extracted into reusable hooks
- **Type Safety**: Comprehensive TypeScript usage
- **Performance**: React Query for efficient data fetching and caching

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is proprietary software. All rights reserved.