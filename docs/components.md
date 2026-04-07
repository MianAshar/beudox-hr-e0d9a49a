<!--
generated_by: tessera
source_sha: 1cec2ce393d8f182112788746e7935917c082ccd
generated_at: 2026-04-07T21:17:04.205Z
action: create
-->

# Beudox HR - Component Documentation

## Component Architecture

Beudox HR follows a hierarchical component structure with reusable UI primitives, layout components, and feature-specific components.

## UI Components (shadcn/ui)

### Core Primitives (40+ components)

#### Form Components
- **Button**: Variants (default, destructive, outline, secondary, ghost, link)
- **Input**: Text input with validation states
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Boolean input
- **RadioGroup**: Single selection from options
- **Switch**: Toggle input
- **Label**: Form field labels

#### Layout Components
- **Card**: Content containers with header, content, footer
- **Dialog**: Modal dialogs with overlay
- **Sheet**: Slide-out panels (left, right, top, bottom)
- **Popover**: Floating content containers
- **Tooltip**: Contextual help text
- **Accordion**: Collapsible content sections
- **Tabs**: Tabbed interface navigation

#### Data Display
- **Table**: Data tables with sorting and pagination
- **Badge**: Status indicators and labels
- **Avatar**: User profile images with fallbacks
- **Skeleton**: Loading state placeholders
- **Progress**: Progress bars and indicators

#### Navigation
- **NavigationMenu**: Complex navigation menus
- **Breadcrumb**: Page hierarchy navigation
- **Pagination**: Data pagination controls

#### Feedback
- **Alert**: Status messages and notifications
- **Toast**: Non-intrusive notifications
- **Sonner**: Modern toast notifications

### Usage Patterns

#### Consistent API Design
```typescript
// All components follow similar patterns
<Button variant="default" size="sm" onClick={handleClick}>
  Click me
</Button>

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

#### Theme Integration
```typescript
// Components respect CSS custom properties
--background, --foreground
--primary, --primary-foreground
--muted, --muted-foreground
--border, --input, --ring
```

## Layout Components

### AppLayout

Main application layout with sidebar and topbar:

```typescript
// src/components/layout/AppLayout.tsx
interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => (
  <div className="flex h-screen bg-background">
    <AppSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  </div>
);
```

### AppSidebar

Role-based navigation sidebar:

```typescript
// src/components/layout/AppSidebar.tsx
const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['all'] },
  { path: '/employees', label: 'Employees', icon: Users, roles: ['hr_manager', 'finance_manager', 'ceo'] },
  // ... more items
];
```

### TopBar

Application header with user menu and notifications:

```typescript
// src/components/layout/TopBar.tsx
const TopBar = () => (
  <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="flex h-14 items-center px-4">
      <div className="flex items-center space-x-4">
        {/* Logo and navigation */}
      </div>
      <div className="ml-auto flex items-center space-x-4">
        {/* User menu, notifications */}
      </div>
    </div>
  </header>
);
```

## Feature Components

### BeudoxLogo

Brand logo component with variant support:

```typescript
// src/components/BeudoxLogo.tsx
interface BeudoxLogoProps {
  variant?: 'default' | 'sidebar';
  showWordmark?: boolean;
  size?: number;
}

const BeudoxLogo = ({ 
  variant = 'default', 
  showWordmark = true, 
  size = 36 
}: BeudoxLogoProps) => {
  if (!showWordmark) {
    return <img src="/assets/beudox-icon-256.svg" alt="Beudox" height={size} />;
  }

  const src = variant === 'sidebar' 
    ? '/assets/beudox-logo-reversed.svg' 
    : '/assets/beudox-logo-primary.svg';

  return <img src={src} alt="Beudox" height={size} />;
};
```

### NavLink

Enhanced React Router NavLink with active state styling:

```typescript
// src/components/NavLink.tsx
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  }
);
```

### SearchableEmployeeSelect

Advanced employee selection with search and filtering:

```typescript
// src/components/SearchableEmployeeSelect.tsx
interface EmployeeOption {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  designation?: string | null;
}

interface SearchableEmployeeSelectProps {
  employees: EmployeeOption[];
  value: string;
  onValueChange: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowAll?: boolean;
  allLabel?: string;
}
```

Features:
- Real-time search filtering
- Avatar display with initials fallback
- "All Employees" option support
- Keyboard navigation
- Accessible design

### EvaluationTimeline

Complex evaluation display component:

```typescript
// src/components/evaluations/EvaluationTimeline.tsx
interface Props {
  employeeId: string;
  companyId: string;
}

const EvaluationTimeline = ({ employeeId, companyId }: Props) => {
  // Quarterly evaluations query
  const { data: quarterly } = useQuery({
    queryKey: ['eval-timeline-quarterly', employeeId, companyId],
    // ... query logic
  });

  // Daily evaluations query
  const { data: daily } = useQuery({
    queryKey: ['eval-timeline-daily', employeeId, companyId],
    // ... query logic
  });

  // Unified timeline with role-based filtering
  // ... complex business logic
};
```

Features:
- Combines quarterly and daily evaluations
- Role-based visibility (managers see recommendations)
- Timeline sorting and limiting
- Rich evaluation display with scores and comments

### RichTextEditor

Tiptap-based rich text editor for HR policies:

```typescript
// src/components/hr-policies/RichTextEditor.tsx
interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Toolbar with formatting options
  // Bold, italic, underline, headings, lists, links
};
```

## Settings Components

### Modular Settings Architecture

```typescript
// src/components/settings/
├── CompanyTab.tsx       // Company information
├── DepartmentsTab.tsx   // Department management
├── RolesTab.tsx         // Role configuration
├── AttendanceTab.tsx    // Attendance settings
├── EvaluationParametersTab.tsx  // Evaluation criteria
├── ExpenseCategoriesTab.tsx     // Expense categories
└── DangerZoneTab.tsx    // Critical operations
```

Each settings tab follows consistent patterns:
- Form validation with Zod
- Optimistic updates
- Confirmation dialogs for destructive actions
- Role-based field visibility

## Component Patterns

### Data Fetching Pattern

```typescript
// Consistent React Query usage
const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => api.getResource(id),
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <Component data={data} />;
};
```

### Form Pattern

```typescript
// React Hook Form + Zod validation
const MyForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const mutation = useMutation({
    mutationFn: api.updateResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource'] });
      toast.success('Updated successfully');
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

### Error Handling Pattern

```typescript
// Consistent error display
const ErrorMessage = ({ error }: { error: Error }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      {error.message || 'Something went wrong'}
    </AlertDescription>
  </Alert>
);
```

## Performance Optimizations

### Component-Level Optimizations

#### Memoization
```typescript
// Memoize expensive computations
const filteredData = useMemo(() => 
  data.filter(item => item.status === 'active'),
  [data]
);
```

#### Lazy Loading
```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

#### Callback Optimization
```typescript
// Stable function references
const handleClick = useCallback(() => {
  // handle click logic
}, []);
```

### Bundle Optimization

#### Dynamic Imports
```typescript
// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

#### Component Libraries
- Tree-shakable imports from Radix UI
- Optimized bundle with Vite
- CSS-in-JS elimination with Tailwind

## Accessibility

### ARIA Compliance
- Semantic HTML elements
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trapping in modals
- Skip links for navigation

### Color and Contrast
- WCAG compliant color ratios
- Dark mode support
- High contrast mode compatibility

This component architecture provides a solid foundation for building complex HR management features with consistency, performance, and accessibility in mind.