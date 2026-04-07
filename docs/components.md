<!--
generated_by: tessera
source_sha: 8e11b5d7fe7d65cb4672bc4879a4a7d4c01dc9e0
generated_at: 2026-04-07T22:34:23.180Z
action: create
-->

# Beudox HR - Component Architecture

## Component Organization

Beudox HR follows a modular component architecture organized by functionality and reusability. Components are structured in a hierarchical manner with clear separation of concerns.

## Component Layers

### 1. UI Components (`src/components/ui/`)

These are the base reusable components built on Radix UI primitives, following the Shadcn/ui design system.

#### Core UI Components
- **Form Components**: `button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`
- **Layout Components**: `card.tsx`, `separator.tsx`, `scroll-area.tsx`, `resizable.tsx`
- **Navigation**: `navigation-menu.tsx`, `breadcrumb.tsx`, `pagination.tsx`
- **Feedback**: `alert.tsx`, `alert-dialog.tsx`, `toast.tsx`, `progress.tsx`
- **Data Display**: `table.tsx`, `badge.tsx`, `avatar.tsx`, `calendar.tsx`
- **Overlays**: `dialog.tsx`, `sheet.tsx`, `popover.tsx`, `tooltip.tsx`, `hover-card.tsx`

#### Special Components
- **Command**: `command.tsx` - Advanced searchable command palette
- **Carousel**: `carousel.tsx` - Image/content carousel
- **Chart**: `chart.tsx` - Data visualization component
- **Form**: `form.tsx` - Form context and validation display

### 2. Layout Components (`src/components/layout/`)

These provide the application's structural layout and navigation.

#### AppLayout (`AppLayout.tsx`)
```typescript
interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => (
  <div className="min-h-screen flex">
    <AppSidebar />
    <div className="flex-1 flex flex-col ml-16 lg:ml-[240px]">
      <TopBar />
      <main className="flex-1 bg-background p-6">
        <div className="max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  </div>
);
```

**Features:**
- Responsive sidebar with dynamic width
- Fixed top bar
- Centered content area with max-width
- Mobile-responsive adjustments

#### AppSidebar (`AppSidebar.tsx`)
- Collapsible navigation sidebar
- Role-based menu items
- Active route highlighting
- Mobile overlay mode

#### TopBar (`TopBar.tsx`)
- User avatar and menu
- Notification center
- Global search (future enhancement)
- Theme toggle

### 3. Feature Components

Organized by business domain for better maintainability.

#### Evaluation Components (`src/components/evaluations/`)

**EvaluationTimeline (`EvaluationTimeline.tsx`)**
- Displays evaluation history for employees
- Supports quarterly and daily evaluations
- Role-based visibility filtering
- Timeline layout with badges and avatars

**Key Features:**
- Complex visibility logic based on user roles
- Unified timeline for different evaluation types
- Interactive links to evaluation details
- Loading states and empty states

#### HR Policy Components (`src/components/hr-policies/`)

**RichTextEditor (`RichTextEditor.tsx`)**
- Full-featured rich text editor using TipTap
- Toolbar with formatting options
- Link insertion and editing
- Content validation

**Features:**
- Bold, italic, underline formatting
- Headings (H1, H2, H3)
- Lists (ordered and unordered)
- Link management
- HTML output for storage

#### Settings Components (`src/components/settings/`)

**Tab-based organization:**
- `CompanyTab.tsx` - Company information management
- `DepartmentsTab.tsx` - Department structure
- `RolesTab.tsx` - Role definitions
- `AttendanceTab.tsx` - Attendance settings
- `EvaluationParametersTab.tsx` - Evaluation criteria
- `ExpenseCategoriesTab.tsx` - Expense categorization
- `DangerZoneTab.tsx` - Critical operations

#### Shared Components (`src/components/`)

**BeudoxLogo (`BeudoxLogo.tsx`)**
```typescript
interface BeudoxLogoProps {
  variant?: 'default' | 'sidebar';
  showWordmark?: boolean;
  size?: number;
}
```
- Logo component with variants
- Responsive sizing
- SVG-based for crisp rendering

**NavLink (`NavLink.tsx`)**
- Enhanced React Router NavLink
- Active state styling
- TypeScript wrapper with proper typing

**SearchableEmployeeSelect (`SearchableEmployeeSelect.tsx`)**
- Advanced employee selection component
- Search and filtering capabilities
- Avatar display with initials fallback
- Multi-select support (optional)
- "All" option for bulk operations

## Component Patterns

### Data Fetching Pattern
```typescript
// Using React Query for server state
const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => fetchResource(id),
    enabled: !!id,
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;
  
  return <Component data={data} />;
};
```

### Form Component Pattern
```typescript
// React Hook Form with Zod validation
const MyForm = ({ initialData, onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
```

### List Component Pattern
```typescript
// Consistent list/table pattern
const DataList = ({ data, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-32" />;
  }
  
  return (
    <div className="space-y-4">
      {data?.map(item => (
        <Card key={item.id}>
          <CardContent>
            {/* Item content */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

## Component Communication

### Props Interface Pattern
```typescript
interface ComponentProps {
  // Required props
  requiredProp: string;
  
  // Optional props with defaults
  optionalProp?: number;
  
  // Event handlers
  onAction?: (data: ActionData) => void;
  
  // Children
  children?: ReactNode;
}

const Component = ({
  requiredProp,
  optionalProp = defaultValue,
  onAction,
  children
}: ComponentProps) => {
  // Component implementation
};
```

### Custom Hook Pattern
```typescript
// Extract complex logic into custom hooks
const useComponentLogic = (id: string) => {
  const [state, setState] = useState(initialState);
  
  const { data, isLoading } = useQuery({
    queryKey: ['data', id],
    queryFn: () => fetchData(id),
  });
  
  const handleAction = useCallback(() => {
    // Action logic
  }, [data]);
  
  return {
    data,
    isLoading,
    state,
    handleAction,
  };
};
```

## Styling Patterns

### Tailwind CSS Classes
- Utility-first approach
- Consistent spacing scale
- Responsive design utilities
- Dark mode support

### CSS Variables
```css
/* Design system variables */
:root {
  --ff-display: 'Inter', sans-serif;
  --ff-mono: 'JetBrains Mono', monospace;
  
  --radius: 0.5rem;
  
  --color-primary: hsl(var(--primary));
  --color-background: hsl(var(--background));
}
```

### Component Variants
```typescript
// Using class-variance-authority for variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors", 
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## Performance Optimizations

### Memoization
```typescript
// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* content */}</div>;
});
```

### Lazy Loading
```typescript
// Lazy load route components
const Component = lazy(() => import('./Component'));
```

### Callback Optimization
```typescript
// Stable callback references
const handleClick = useCallback(() => {
  // Handle click
}, [dependencies]);
```

## Testing Patterns

### Component Testing
```typescript
// Using React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';

test('renders component correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Hook Testing
```typescript
// Testing custom hooks
import { renderHook } from '@testing-library/react';

test('hook returns correct data', () => {
  const { result } = renderHook(() => useCustomHook());
  expect(result.current.data).toEqual(expectedData);
});
```

## Accessibility

### ARIA Patterns
- Semantic HTML elements
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trapping in modals
- Skip links for navigation

This component architecture provides a scalable, maintainable foundation for the HR management system with consistent patterns and best practices.