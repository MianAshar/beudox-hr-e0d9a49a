<!--
generated_by: tessera
source_sha: 97da8491eab325102f937361539707aa446ff87b
generated_at: 2026-04-27T21:30:43.570Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built as a modern React-based web application. Beudox HR streamlines HR operations including employee management, attendance tracking, leave management, payroll processing, and organizational settings.

## Features

### Core HR Functionality
- **Employee Management**: Complete employee profiles with personal details, documents, and organizational information
- **Attendance Tracking**: Automated attendance import from biometric systems, real-time tracking, and overtime calculations
- **Leave Management**: Request, approve, and track various types of leave (vacation, sick, etc.)
- **Payroll Processing**: Automated payroll generation with salary calculations, allowances, and deductions
- **Performance Reviews**: Employee evaluations, salary reviews, and increment proposals

### Administrative Features
- **Company Settings**: Configure company-wide policies, departments, roles, and permissions
- **Project Management**: Team assignments, project tracking, and activity logging
- **Finance Integration**: Expense categories and financial summaries
- **HR Policies**: Rich text policy documents and guidelines

### User Experience
- **Role-based Access**: Different permission levels for employees, managers, and administrators
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Real-time Notifications**: In-app notifications and preference management
- **Search & Filtering**: Advanced employee search and data filtering capabilities

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: React Query for server state, custom hooks for local state
- **Backend**: Supabase (PostgreSQL database, authentication, edge functions)
- **Deployment**: Modern web standards, deployable to any static hosting

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
   
   The application uses Supabase migrations. Run the SQL migrations in the `supabase/migrations/` directory in order to set up the database schema.

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

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

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
│   ├── settings/       # Admin settings components
│   └── ...
├── pages/              # Page components (Next.js Pages Router style)
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions for AI processing
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex workflow for importing attendance data from Excel files
- **SearchableEmployeeSelect**: Advanced employee selection component with search
- **Employee Profile Tabs**: Modular tabs for different employee information sections

## Contributing

1. Follow the existing code style and component patterns
2. Use TypeScript for all new code
3. Test components thoroughly
4. Update documentation as needed

## License

This project is proprietary software for Beudox HR.