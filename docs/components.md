<!--
generated_by: tessera
source_sha: 387391b56870e1f87a0608cfe39642ec2a98d0ba
generated_at: 2026-04-21T11:07:06.081Z
action: create
-->

# Beudox HR - Component Architecture

## Overview

Beudox HR implements a comprehensive component system with 100+ reusable components organized by domain and functionality. The architecture follows modern React patterns with TypeScript, composition, and accessibility-first design.

## Component Organization

### Directory Structure

```
src/components/
├── ui/                    # Base UI primitives (60+ components)
├── layout/               # Application shell components
├── employee-profile/     # Employee-specific components
├── finance/             # Financial components
├── evaluations/         # Performance components
├── projects/            # Project management
├── leave/               # Leave management
├── payroll/             # Payroll components
├── settings/            # Administrative components
├── hr-policies/         # Policy components
└── shared/              # Cross-domain utilities
```

## UI Component Library

### Base Components (shadcn/ui Pattern)
Located in `src/components/ui/`, these are the foundation:

#### Form Components
- **Button**: Variants (default, outline, ghost, destructive)
- **Input**: Text input with validation states
- **Select**: Dropdown with search and multi-select
- **Textarea**: Multi-line text input
- **Checkbox**: Boolean input
- **RadioGroup**: Single selection from options
- **Switch**: Toggle component

#### Layout Components
- **Card**: Content container with header/body/footer
- **Sheet**: Slide-out panel (left/right/bottom)
- **Dialog**: Modal overlay
- **Popover**: Floating content
- **Tabs**: Tabbed interface
- **Accordion**: Collapsible content sections

#### Data Display
- **Table**: Data table with sorting and pagination
- **Badge**: Status indicators
- **Avatar**: User/profile images
- **Skeleton**: Loading placeholders
- **Progress**: Progress bars
- **Chart**: Data visualization (Recharts integration)

#### Feedback
- **Alert**: Status messages
- **Toast**: Non-intrusive notifications
- **AlertDialog**: Confirmation dialogs
- **HoverCard**: Rich tooltips

#### Navigation
- **NavigationMenu**: Complex navigation
- **Breadcrumb**: Location indicator
- **Pagination**: Page navigation

### Component API Patterns

#### Props Interface
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}
```

#### Composition with Slots
```typescript
interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => <div className="card">{children}</div>;
const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="card-header">{children}</div>
);
```

## Feature Components

### Employee Profile Components
Located in `src/components/employee-profile/`:

- **AttendanceTab**: Monthly attendance view with summaries
- **PayrollTab**: Salary history and payslip access
- **LeaveTab**: Leave balances and request history
- **DocumentsTab**: Document management (placeholder)
- **PendingIncrementCard**: Salary increase proposals
- **ProposeIncrementModal**: Increment proposal form
- **ReviewScheduleSection**: Performance review scheduling
- **SalaryHistoryTab**: Historical salary data

### Layout Components
Core application shell in `src/components/layout/`:

- **AppLayout**: Main application wrapper
- **AppSidebar**: Collapsible navigation sidebar
- **TopBar**: Top navigation bar
- **NotificationBell**: Notification dropdown
- **UserMenu**: User account menu

### Specialized Components

#### SearchableEmployeeSelect
Advanced employee picker with:
- Search functionality
- Avatar display
- Designation info
- "All" option support
- Keyboard navigation

#### BeudoxLogo
Brand logo component with:
- Variant support (default/sidebar)
- Wordmark toggle
- Size customization
- SVG optimization

#### NavLink
Enhanced router link with:
- Active state styling
- Pending state handling
- TypeScript integration

## Component Patterns

### Custom Hooks Integration
Components use custom hooks for logic separation:

```typescript
// Component
const AttendanceTab = ({ employeeId }: { employeeId: string }) => {
  const { data: records, isLoading } = useAttendanceRecords(employeeId);
  // ... render logic
};

// Custom Hook
const useAttendanceRecords = (employeeId: string) => {
  return useQuery({
    queryKey: ['attendance', employeeId],
    queryFn: () => fetchAttendance(employeeId),
  });
};
```

### Error Boundaries
```typescript
class ErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    logError(error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Loading States
Consistent loading patterns:
```typescript
{isLoading ? (
  <Skeleton className="h-10" />
) : (
  <DataComponent data={data} />
)}
```

## Styling Architecture

### Tailwind CSS Integration
- **Utility Classes**: Direct class application
- **Custom Properties**: CSS variables for theming
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: CSS variable switching

### Design System
```css
:root {
  --bx-primary: hsl(220 89% 56%);
  --bx-success: hsl(142 76% 36%);
  --bx-warning: hsl(38 92% 50%);
  --bx-danger: hsl(0 84% 60%);
  /* ... more variables */
}
```

### Component Styling
```typescript
const Button = ({ variant = 'default', className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'border border-input bg-background hover:bg-accent': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
};
```

## Accessibility (a11y)

### ARIA Integration
- **Labels**: Proper aria-labels and aria-labelledby
- **Roles**: Semantic roles for screen readers
- **States**: aria-expanded, aria-selected, etc.
- **Live Regions**: Dynamic content announcements

### Keyboard Navigation
- **Focus Management**: Proper tab order
- **Keyboard Shortcuts**: Common actions
- **Escape Handling**: Modal dismissal

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy
- **Alt Text**: Image descriptions
- **Hidden Content**: screen reader only content

## Performance Optimizations

### Memoization
```typescript
const MemoizedComponent = memo(({ data }: Props) => {
  return <ExpensiveRender data={data} />;
});
```

### Lazy Loading
```typescript
const LazyComponent = lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<Skeleton />}>
    <LazyComponent />
  </Suspense>
);
```

### Virtualization
For large lists:
```typescript
import { FixedSizeList as List } from 'react-window';
```

## Testing Patterns

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';

test('Button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Custom Hook Testing
```typescript
import { renderHook } from '@testing-library/react';

test('useAttendanceRecords fetches data', () => {
  const { result } = renderHook(() => useAttendanceRecords('123'));
  expect(result.current.isLoading).toBe(true);
});
```

## Component Lifecycle

### Development Workflow
1. **Design**: Figma/component library reference
2. **Implementation**: TypeScript + Tailwind
3. **Testing**: Unit tests + accessibility
4. **Integration**: Storybook documentation
5. **Usage**: Import and compose in features

### Maintenance
- **Versioning**: Semantic versioning for breaking changes
- **Deprecation**: Gradual migration path
- **Documentation**: Inline JSDoc + Storybook

This component architecture provides a scalable, accessible, and maintainable foundation for the Beudox HR application, enabling rapid development of complex HR features while maintaining consistency and quality.