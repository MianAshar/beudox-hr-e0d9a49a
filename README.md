<!--
generated_by: tessera
source_sha: 6a87e37253401fc78156c356eff42199bb63082e
generated_at: 2026-04-30T00:21:33.820Z
action: update
-->

# Beudox HR Portal

A comprehensive Human Resources Management System built as a modern React frontend application. This portal provides employees and HR administrators with tools to manage attendance, leave requests, payroll, evaluations, and more.

## Features

### Employee Dashboard
- **Attendance Tracking**: Upload and manage attendance records with AI-powered parsing
- **Leave Management**: Apply for leave, track balances, and manage requests
- **Payroll Overview**: View salary history, pending increments, and payroll summaries
- **Evaluations**: Participate in performance reviews and track evaluation timelines
- **Profile Management**: Update personal information and notification preferences

### HR Administration
- **Employee Management**: Search and manage employee records
- **Attendance Upload**: Bulk import attendance data from Excel files
- **Leave Types & Policies**: Configure leave categories and approval workflows
- **Payroll Processing**: Generate and manage payroll data
- **Company Settings**: Configure departments, roles, expense categories, and evaluation parameters

### System Features
- **Role-based Access Control**: Different permissions for employees, managers, and admins
- **Real-time Notifications**: Automated alerts for leave approvals, reviews, etc.
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: Supabase-powered auth with mandatory password changes

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **State Management**: React hooks and context
- **Routing**: React Router
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Forms**: React Hook Form (implied by form components)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

   Configure your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   VITE_SUPABASE_PROJECT_ID=your-project-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App layout components
│   ├── attendance/     # Attendance-related components
│   ├── leave/          # Leave management components
│   ├── payroll/        # Payroll components
│   ├── evaluations/    # Evaluation components
│   └── ...
├── pages/              # Page components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
└── main.tsx           # Application entry point
```

## Key Components

- **AppLayout**: Main application layout with sidebar navigation
- **AttendanceUploadFlow**: Complex flow for uploading and parsing attendance Excel files
- **MandatoryPasswordChange**: Modal for first-time password setup
- **SearchableEmployeeSelect**: Employee selection dropdown with search
- **BeudoxLogo**: Logo component with different variants

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Testing

```bash
npm run test
```

### Code Quality

The project uses ESLint for code linting and follows TypeScript strict mode for type safety.

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Use shadcn/ui components for consistent UI
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is proprietary software. All rights reserved.