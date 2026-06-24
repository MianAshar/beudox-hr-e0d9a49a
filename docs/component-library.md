<!--
generated_by: tessera
source_sha: 7cd56bd223f184273f03b6c7372dbc65d79d4bbd
generated_at: 2026-04-19T21:20:04.480Z
action: create
-->

# Component Library

## Overview

Beudox HR uses shadcn/ui as its component library, providing 40+ accessible, customizable UI components built on Radix UI primitives. The library is organized into atomic design principles with consistent theming and behavior.

## Core UI Components

### Layout Components

#### AppLayout
**File**: `src/components/layout/AppLayout.tsx`

Main application shell that wraps all authenticated pages.

**Props**:
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```

**Features**:
- Responsive sidebar navigation
- Fixed topbar with breadcrumbs
- Content area with proper spacing
- Mobile-responsive design

#### AppSidebar
**File**: `src/components/layout/AppSidebar.tsx`

Collapsible navigation sidebar with role-based menu items.

**Features**:
- Expandable/collapsible design
- Role-based navigation filtering
- User profile section
- Active route highlighting

#### TopBar
**File**: `src/components/layout/TopBar.tsx`

Page header with title and navigation breadcrumbs.

**Props**:
```typescript
interface TopBarProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
}
```

### Form Components

#### Button
**File**: `src/components/ui/button.tsx`

Customizable button component with multiple variants.

**Variants**:
- `default` - Primary action
- `destructive` - Delete/danger actions
- `outline` - Secondary actions
- `secondary` - Subtle actions
- `ghost` - Minimal styling
- `link` - Text-only links

**Sizes**:
- `default`
- `sm` - Small
- `lg` - Large
- `icon` - Icon-only buttons

#### Input
**File**: `src/components/ui/input.tsx`

Text input component with consistent styling.

**Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Standard HTML input props
}
```

#### Textarea
**File**: `src/components/ui/textarea.tsx`

Multi-line text input component.

#### Select
**File**: `src/components/ui/select.tsx`

Dropdown selection component.

**Usage**:
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Data Display

#### Table
**File**: `src/components/ui/table.tsx`

Data table component with sorting and pagination support.

**Features**:
- Sortable columns
- Custom cell rendering
- Responsive design
- Loading states

#### Card
**File**: `src/components/ui/card.tsx`

Content container with header, body, and footer sections.

**Usage**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Badge
**File**: `src/components/ui/badge.tsx`

Status indicators and labels.

**Variants**:
- `default`
- `secondary`
- `destructive`
- `outline`

### Feedback Components

#### Alert
**File**: `src/components/ui/alert.tsx`

Informational messages and notifications.

**Variants**:
- `default`
- `destructive` - Error messages

#### Skeleton
**File**: `src/components/ui/skeleton.tsx`

Loading state placeholders.

**Usage**:
```tsx
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-4 w-[200px]" />
```

#### Toast
**Files**: `src/components/ui/toast.tsx`, `src/components/ui/toaster.tsx`, `src/hooks/use-toast.ts`

Non-intrusive notifications system.

**Usage**:
```tsx
const { toast } = useToast();

toast({
  title: "Success",
  description: "Operation completed successfully",
});
```

### Navigation Components

#### NavLink
**File**: `src/components/NavLink.tsx`

Enhanced navigation link with active state management.

**Props**:
```typescript
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}
```

### Business Components

#### BeudoxLogo
**File**: `src/components/BeudoxLogo.tsx`

Brand logo component with variant support.

**Props**:
```typescript
interface BeudoxLogoProps {
  variant?: 'default' | 'sidebar';
  showWordmark?: boolean;
  size?: number;
}
```

#### SearchableEmployeeSelect
**File**: `src/components/SearchableEmployeeSelect.tsx`

Advanced employee selection with search and filtering.

**Props**:
```typescript
interface SearchableEmployeeSelectProps {
  employees: EmployeeOption[];
  value: string;
  onValueChange: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowAll?: boolean;
  allLabel?: string;
}
```

#### EvaluationTimeline
**File**: `src/components/evaluations/EvaluationTimeline.tsx`

Performance evaluation history display.

**Features**:
- Quarterly and daily evaluations
- Role-based visibility filtering
- Interactive timeline with links
- Avatar displays and scoring

#### FinanceSummary
**File**: `src/components/finance/FinanceSummary.tsx`

Financial dashboard with charts and metrics.

**Features**:
- 6-month trend visualization
- Month-over-month comparisons
- Interactive charts with tooltips
- Currency formatting

### Utility Components

#### Dialog
**File**: `src/components/ui/dialog.tsx`

Modal dialog for confirmations and forms.

**Usage**:
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <DialogBody>
      {/* Content */}
    </DialogBody>
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Popover
**File**: `src/components/ui/popover.tsx`

Floating content containers.

#### Tooltip
**File**: `src/components/ui/tooltip.tsx`

Informational tooltips on hover.

**Usage**:
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Form Components

#### Form
**File**: `src/components/ui/form.tsx`

Form wrapper with validation support.

**Integration with React Hook Form**:
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(schema),
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Form fields */}
  </form>
</Form>
```

#### Checkbox
**File**: `src/components/ui/checkbox.tsx`

Checkbox input component.

#### Radio Group
**File**: `src/components/ui/radio-group.tsx`

Radio button group component.

### Advanced Components

#### Command
**File**: `src/components/ui/command.tsx`

Search and command palette component.

**Features**:
- Keyboard navigation
- Search filtering
- Customizable item rendering

#### Tabs
**File**: `src/components/ui/tabs.tsx`

Tabbed interface component.

**Usage**:
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
</Tabs>
```

#### Accordion
**File**: `src/components/ui/accordion.tsx`

Collapsible content sections.

#### Calendar
**File**: `src/components/ui/calendar.tsx`

Date picker component using react-day-picker.

## Theming & Styling

### Design Tokens

The application uses CSS custom properties for consistent theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --popover: 0 0% 100%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}
```

### Utility Classes

Common utility functions:

#### `cn()` Function
**File**: `src/lib/utils.ts`

Combines Tailwind classes with clsx:
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Component Patterns

### Loading States
```tsx
{isLoading ? (
  <Skeleton className="h-4 w-[250px]" />
) : (
  <p>{data.content}</p>
)}
```

### Error States
```tsx
{error ? (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
) : (
  /* Content */
)}
```

### Empty States
```tsx
{data.length === 0 ? (
  <div className="text-center py-8">
    <p className="text-muted-foreground">No data available</p>
  </div>
) : (
  /* Data display */
)}
```

## Accessibility

All components follow WCAG guidelines:
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA attributes
- Color contrast compliance

## Performance

### Optimization Techniques
- Tree-shakable imports
- Lazy loading of components
- Memoized expensive computations
- Virtual scrolling for large lists

### Bundle Analysis
Components are organized to minimize bundle size:
- Core UI components in separate chunks
- Feature-specific components lazy loaded
- Icons imported individually

This component library provides a solid foundation for building consistent, accessible, and performant user interfaces throughout the Beudox HR application.