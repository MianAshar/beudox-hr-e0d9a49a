<!--
generated_by: tessera
source_sha: ad247ba42a3f2e8b8b3fd155bdb9eb108cfdb6bc
generated_at: 2026-03-27T02:41:05.990Z
action: update
-->

# Beudox HR Management System

A comprehensive Human Resources Management System built with modern web technologies. This application provides a complete suite of HR tools for managing employees, attendance, payroll, leave requests, projects, and more.

## Features

### Employee Management
- Employee profiles with personal and professional details
- Role-based access control
- Salary and allowance management
- Employee evaluations and performance tracking

### Attendance & Time Tracking
- Daily attendance recording
- Overtime tracking (regular and holiday)
- Attendance imports from external systems
- Late arrival and early departure monitoring

### Leave Management
- Multiple leave types (annual, sick, etc.)
- Leave request workflow with approvals
- Leave balance tracking
- Carry-over and proration rules

### Payroll Processing
- Automated payroll calculations
- Salary components (basic, allowances, bonuses)
- Overtime and deduction calculations
- Payment processing and tracking

### Project Management
- Project creation and assignment
- Client management
- Project categories and priorities
- Invoice generation and tracking

### Financial Management
- Client invoicing
- Payment tracking
- Office expense management
- Loan management for employees

### Reporting & Analytics
- Comprehensive HR reports
- Attendance and payroll analytics
- Performance evaluations

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest with Playwright for E2E

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   └── NavLink.tsx  # Custom navigation component
├── pages/           # Page components
├── integrations/    # External service integrations
│   └── supabase/    # Supabase client and types
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── main.tsx         # Application entry point
```

## Database Schema

The application uses a comprehensive PostgreSQL database with the following main entities:

- **companies**: Multi-tenant company management
- **employees**: Employee profiles and information
- **attendance_records**: Daily attendance tracking
- **payroll_records**: Monthly payroll processing
- **leave_requests**: Leave management system
- **projects**: Project management
- **clients**: Client relationship management
- **invoices**: Billing and invoicing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is private and proprietary.