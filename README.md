<!--
generated_by: tessera
source_sha: aec9a6190690e524f8002384d2c4620a1e2a3b11
generated_at: 2026-04-13T10:35:13.346Z
action: update
-->

# Beudox HR

A comprehensive Human Resources Management System built with modern web technologies. Beudox HR provides organizations with powerful tools to manage employees, track performance, handle payroll, and streamline HR operations.

## Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management including onboarding, profiles, and organizational structure
- **Role-Based Access Control**: Granular permissions system with roles like HR Manager, CEO, Team Lead, and Employee
- **Performance Evaluations**: Quarterly and daily evaluation systems with customizable parameters
- **Leave Management**: Comprehensive leave tracking, balances, and approval workflows

### Financial Management
- **Payroll Processing**: Automated payroll generation with payslips and financial reporting
- **Invoice Management**: Client invoicing with PDF generation and email delivery
- **Loan Management**: Employee loan tracking and management
- **Finance Dashboard**: Comprehensive financial overview and reporting

### Project & Client Management
- **Project Tracking**: Project lifecycle management with team assignments
- **Client Management**: Client profiles and relationship management
- **Time Tracking**: Integration with project and payroll systems

### Administrative Tools
- **HR Policies**: Rich text policy documents with version control
- **Settings Management**: Configurable company settings, departments, roles, and categories
- **Public Holidays**: Holiday calendar management
- **Notifications**: Automated notification system for HR events

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Rich Text Editing**: Tiptap
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beudox-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
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
   ```

4. **Database Setup**
   
   The application uses Supabase migrations. Run the migrations in the `supabase/migrations/` directory in order.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (AppLayout, Sidebar, etc.)
│   ├── evaluations/    # Evaluation-specific components
│   ├── hr-policies/    # HR policy components
│   ├── leave/          # Leave management components
│   └── settings/       # Settings components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── integrations/       # External service integrations (Supabase)
└── test/               # Test files
```

## Key Components

### Authentication & Authorization
- JWT-based authentication via Supabase Auth
- Role-based access control with route protection
- Password reset and invite flows

### Data Management
- React Query for efficient server state management
- Real-time subscriptions for live updates
- Optimistic updates for better UX

### UI/UX
- Responsive design with mobile-first approach
- Dark/light theme support
- Accessible components using Radix UI
- Toast notifications and loading states

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for unit testing and Playwright for end-to-end testing.

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.