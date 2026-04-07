<!--
generated_by: tessera
source_sha: c146e39c807c2d7590e3e1eb1fcb10f3b06bbef7
generated_at: 2026-04-07T11:17:15.541Z
action: create
-->

# Beudox HR - Component Architecture

## Component Library Overview

Beudox HR uses a comprehensive component system built on shadcn/ui and Radix UI primitives, providing consistent, accessible, and reusable UI elements.

## Core UI Components (shadcn/ui)

### Layout Components
- **Accordion** - Collapsible content sections
- **AspectRatio** - Maintains consistent aspect ratios
- **Resizable** - Resizable panel layouts
- **ScrollArea** - Custom scrollbars with momentum
- **Separator** - Visual content separators
- **Tabs** - Tabbed interface navigation

### Form Components
- **Button** - Various button variants and sizes
- **Checkbox** - Form checkbox inputs
- **Input** - Text input fields
- **Label** - Accessible form labels
- **RadioGroup** - Radio button groups
- **Select** - Dropdown select components
- **Switch** - Toggle switch inputs
- **Textarea** - Multi-line text inputs
- **Form** - Form wrapper with validation

### Data Display
- **Avatar** - User avatar displays
- **Badge** - Status and category indicators
- **Card** - Content containers with headers/footers
- **Table** - Data tables with sorting/pagination
- **Chart** - Data visualization components

### Feedback Components
- **Alert** - Status messages and notifications
- **Dialog** - Modal dialogs and confirmations
- **Drawer** - Slide-out panels
- **Popover** - Floating content containers
- **Sheet** - Side panel overlays
- **Skeleton** - Loading state placeholders
- **Toast** - Non-intrusive notifications
- **Tooltip** - Contextual help text

### Navigation Components
- **Breadcrumb** - Navigation hierarchy display
- **Command** - Search and command interfaces
- **ContextMenu** - Right-click context menus
- **DropdownMenu** - Dropdown navigation menus
- **Menubar** - Desktop-style menu bars
- **NavigationMenu** - Site navigation menus
- **Pagination** - Page navigation controls

## Feature-Specific Components

### Layout Components

#### AppLayout (`src/components/layout/AppLayout.tsx`)
Main application layout wrapper:
- Provides sidebar and top bar structure
- Responsive margins that adapt to sidebar state
- Maximum content width (1280px) for optimal reading
- Flex layout for full-height application

#### AppSidebar (`src/components/layout/AppSidebar.tsx`)
Collapsible navigation sidebar:
- Role-based menu item visibility
- Expandable/collapsible functionality
- Logo display with variant switching
- Active route highlighting

#### TopBar (`src/components/layout/TopBar.tsx`)
Top navigation bar:
- User profile menu
- Notification center
- Search functionality
- Mobile-responsive design

### Evaluation Components

#### EvaluationTimeline (`src/components/evaluations/EvaluationTimeline.tsx`)
Complex evaluation display component:
- Fetches and combines quarterly/daily evaluations
- Role-based visibility filtering
- Unified timeline with sorting
- Loading states with skeleton UI
- Responsive card-based layout
- Interactive evaluation links

### HR Policy Components

#### RichTextEditor (`src/components/hr-policies/RichTextEditor.tsx`)
TipTap-based rich text editor:
- Full formatting toolbar
- HTML content management
- Link insertion functionality
- Keyboard accessibility
- Content synchronization

### Settings Components

#### Settings Tab Components
Located in `src/components/settings/`:
- **CompanyTab** - Company information management
- **DepartmentsTab** - Department CRUD operations
- **RolesTab** - Role configuration
- **AttendanceTab** - Attendance policy settings
- **DangerZoneTab** - Critical operations (deletion, etc.)

### Utility Components

#### BeudoxLogo (`src/components/BeudoxLogo.tsx`)
Flexible logo component:
- Multiple display variants (default, sidebar)
- Configurable size and wordmark visibility
- SVG-based for crisp rendering

#### NavLink (`src/components/NavLink.tsx`)
Enhanced navigation link:
- React Router integration
- Active state styling
- Accessibility attributes
- TypeScript forwardRef pattern

## Component Patterns

### Composition Pattern
Components use React's composition pattern for flexibility:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Employee Details</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### forwardRef Pattern
Many components use `forwardRef` for proper ref forwarding:
```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
);
```

### Variant Pattern
Components support multiple variants through class variance authority:
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
  }
);
```

### Custom Hook Integration
Components integrate with custom hooks for state management:
```tsx
const { toast } = useToast();
const { data, isLoading } = useQuery({
  queryKey: ['employees'],
  queryFn: fetchEmployees,
});
```

## Accessibility Features

### ARIA Attributes
- Proper ARIA labels and descriptions
- Screen reader support
- Keyboard navigation
- Focus management

### Semantic HTML
- Correct heading hierarchy
- Semantic form elements
- Proper button and link usage

### Color Contrast
- WCAG compliant color ratios
- Dark mode support
- High contrast mode compatibility

## Responsive Design

### Mobile-First Approach
- Mobile-optimized layouts
- Touch-friendly interaction targets
- Responsive typography
- Adaptive navigation patterns

### Breakpoint System
- Tailwind CSS responsive utilities
- Component-specific responsive behavior
- Sidebar collapse on mobile
- Table responsiveness

## Performance Optimizations

### Lazy Loading
- Component code splitting
- Image lazy loading
- Route-based chunking

### Memoization
- React.memo for expensive components
- useMemo for computed values
- useCallback for event handlers

### Bundle Optimization
- Tree shaking of unused components
- Dynamic imports for large libraries
- Asset optimization

## Development Patterns

### TypeScript Integration
- Strict typing for all component props
- Generic type support
- Interface definitions for complex props

### Testing Support
- Data attributes for testing
- Consistent component APIs
- Mock-friendly component design

### Documentation
- Prop interface documentation
- Usage examples
- Accessibility notes

This component architecture provides a solid foundation for building complex user interfaces with consistency, accessibility, and maintainability at its core.