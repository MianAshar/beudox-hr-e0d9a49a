<!--
generated_by: tessera
source_sha: 7cd56bd223f184273f03b6c7372dbc65d79d4bbd
generated_at: 2026-04-19T21:20:04.480Z
action: create
-->

# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account and project
- Git for version control

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/MianAshar/beudox-hr-e0d9a49a.git
   cd beudox-hr-e0d9a49a
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Database Setup**
   - Apply migrations in `supabase/migrations/` to your Supabase project
   - Configure authentication providers
   - Set up storage buckets if needed

4. **Start Development Server**
   ```bash
   npm run dev
   # Access at http://localhost:8080
   ```

## Project Structure

### Source Code Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives
│   ├── layout/         # App shell components
│   ├── [feature]/      # Feature-specific components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and business logic
├── integrations/       # External service integrations
└── types/              # TypeScript definitions
```

### Key Directories

- **`components/ui/`**: Atomic design components (buttons, forms, etc.)
- **`components/layout/`**: App shell (sidebar, topbar, layout)
- **`pages/`**: Page-level components mapped to routes
- **`hooks/`**: Custom hooks for data fetching and state management
- **`lib/`**: Pure functions, utilities, and business logic
- **`integrations/`**: Supabase client and type definitions

## Development Workflow

### Component Development

1. **Start with UI Components**
   - Use existing shadcn/ui components when possible
   - Create new components in appropriate feature directories
   - Follow the established naming and structure patterns

2. **Implement Business Logic**
   - Extract logic into custom hooks
   - Use React Query for server state
   - Implement proper error handling and loading states

3. **Add TypeScript Types**
   - Define interfaces for component props
   - Use generated Supabase types for API data
   - Ensure type safety throughout

### Example Component Structure

```tsx
// components/employees/EmployeeCard.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeeCardProps {
  employeeId: string;
}

export function EmployeeCard({ employeeId }: EmployeeCardProps) {
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!employee) return <div>Employee not found</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={employee.avatar_url} />
            <AvatarFallback>
              {employee.full_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {employee.full_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{employee.designation}</p>
        <p>{employee.department}</p>
      </CardContent>
    </Card>
  );
}
```

## Data Fetching Patterns

### React Query Usage

```tsx
// Custom hook for employee data
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useEmployee(employeeId: string) {
  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId, // Only run when employeeId exists
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch employee data
      queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
      // Invalidate employee lists
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
```

### Error Handling

```tsx
// Error boundary component
import { Component, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || 'An unexpected error occurred'}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
```

## Form Handling

### React Hook Form + Zod

```tsx
// Form validation schema
import { z } from 'zod';

const employeeSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  department: z.string().optional(),
  designation: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

// Form component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function EmployeeForm({ onSubmit, initialData }: EmployeeFormProps) {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      full_name: '',
      email: '',
      department: '',
      designation: '',
    },
  });

  const handleSubmit = (data: EmployeeFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Additional fields */}
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Employee'}
        </Button>
      </form>
    </Form>
  );
}
```

## Styling Guidelines

### Tailwind CSS Classes

```tsx
// Consistent spacing
className="space-y-4 p-6"

// Responsive design
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Color usage
className="bg-background text-foreground border-border"

// Interactive states
className="hover:bg-muted focus:ring-2 focus:ring-ring transition-colors"
```

### Custom CSS Variables

```css
/* Use CSS custom properties for theming */
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}
```

## Testing

### Unit Tests with Vitest

```tsx
// Component test
import { render, screen } from '@testing-library/react';
import { EmployeeCard } from './EmployeeCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('EmployeeCard', () => {
  it('renders employee information', async () => {
    render(<EmployeeCard employeeId="123" />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### E2E Tests with Playwright

```typescript
// E2E test
import { test, expect } from '@playwright/test';

test('user can login and view dashboard', async ({ page }) => {
  await page.goto('http://localhost:8080');
  
  // Login flow
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Verify dashboard
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('text=Welcome back')).toBeVisible();
});
```

## Performance Optimization

### Code Splitting

```tsx
// Lazy load route components
import { lazy } from 'react';
const Employees = lazy(() => import('./pages/Employees'));
const EmployeeProfile = lazy(() => import('./pages/EmployeeProfile'));

// In router
<Route path="/employees" element={<Employees />} />
<Route path="/employees/:id" element={<EmployeeProfile />} />
```

### Memoization

```tsx
// Memoize expensive components
import { memo } from 'react';
const EmployeeList = memo(function EmployeeList({ employees }: EmployeeListProps) {
  return (
    <div>
      {employees.map(employee => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
});

// Memoize expensive calculations
import { useMemo } from 'react';
const filteredEmployees = useMemo(() => {
  return employees.filter(employee => 
    employee.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [employees, searchTerm]);
```

## Deployment

### Build Process

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Run linting
npm run lint

# Run tests
npm run test
```

### Environment Variables

```env
# Production environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

### CI/CD Pipeline

```yaml
# Example GitHub Actions workflow
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## Best Practices

### Code Quality
- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Keep components small and focused
- Use custom hooks for reusable logic

### Performance
- Implement proper loading states
- Use React Query for caching
- Optimize images and assets
- Minimize bundle size
- Use lazy loading for routes

### Security
- Validate user input on client and server
- Use RLS policies for data access
- Sanitize data before rendering
- Implement proper error handling
- Never expose sensitive information

### Accessibility
- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation
- Maintain color contrast
- Test with screen readers

This development guide provides the foundation for contributing to Beudox HR. Follow these patterns and practices to maintain code quality and consistency across the application.