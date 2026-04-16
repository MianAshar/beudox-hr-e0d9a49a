<!--
generated_by: tessera
source_sha: 939657ec2ede9cca1a4aad08f88592834464cc25
generated_at: 2026-04-16T12:21:14.215Z
action: create
-->

# Beudox HR - Component Documentation

## Overview

The Beudox HR frontend is built with a component-driven architecture using React and TypeScript. Components are organized by reusability and feature domain, following modern React patterns and best practices.

## Component Organization

### Directory Structure

```
src/components/
├── ui/                    # Base reusable components (ShadCN)
├── layout/               # Application layout components
├── [feature]/            # Feature-specific components
│   ├── evaluations/
│   ├── leave/
│   ├── settings/
│   └── ...
└── [standalone]/         # Shared utility components
    ├── BeudoxLogo.tsx
    ├── NavLink.tsx
    └── ...
```

## Base UI Components (ShadCN)

### Design System
- **Consistent API**: All components follow similar prop patterns
- **Accessibility**: Built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **TypeScript**: Fully typed with comprehensive interfaces

### Key UI Components

#### Form Components
```typescript
// Input with validation
<Input
  type="email"
  placeholder="Enter email"
  {...register("email", { required: true })}
/>

// Select with options
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    {options.map(option => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### Layout Components
```typescript
// Card for content organization
<Card>
  <CardHeader>
    <CardTitle>Employee Details</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// Table for data display
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.role}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Layout Components

### AppLayout
**File**: `src/components/layout/AppLayout.tsx`

Main application layout providing the overall structure.

**Props**:
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```

**Structure**:
```typescript
<AppLayout>
  <AppSidebar />     {/* Left navigation */}
  <div className="flex-1 flex flex-col">
    <TopBar />       {/* Top navigation */}
    <main className="flex-1 p-6">
      {children}      {/* Page content */}
    </main>
  </div>
</AppLayout>
```

### AppSidebar
**File**: `src/components/layout/AppSidebar.tsx`

Navigation sidebar with role-based menu items.

**Features**:
- **Responsive**: Collapsible on mobile
- **Role-based**: Menu items filtered by user permissions
- **Active states**: Current route highlighting
- **Icons**: Lucide React icons for visual consistency

### TopBar
**File**: `src/components/layout/TopBar.tsx`

Top navigation bar with user menu and notifications.

**Features**:
- **User menu**: Profile access, logout
- **Notifications**: Bell icon with badge
- **Search**: Global search functionality
- **Breadcrumbs**: Navigation context

## Feature-Specific Components

### Evaluation Components

#### EvaluationTimeline
**File**: `src/components/evaluations/EvaluationTimeline.tsx`

Displays chronological evaluation history for an employee.

**Props**:
```typescript
interface Props {
  employeeId: string;
  companyId: string;
}
```

**Features**:
- **Dual evaluation types**: Quarterly and daily evaluations
- **Role-based filtering**: Different visibility rules per user role
- **Unified timeline**: Sorted chronological view
- **Interactive elements**: Clickable evaluation links
- **Loading states**: Skeleton components during fetch
- **Empty states**: User-friendly messaging

**Data Flow**:
```typescript
// Fetch quarterly evaluations
const { data: quarterly } = useQuery({
  queryKey: ['eval-timeline-quarterly', employeeId, companyId],
  queryFn: async () => { /* Supabase query */ }
});

// Fetch daily evaluations
const { data: daily } = useQuery({
  queryKey: ['eval-timeline-daily', employeeId, companyId],
  queryFn: async () => { /* Supabase query */ }
});
```

**Rendering Logic**:
```typescript
// Build unified timeline
items.push({
  id: `q-${ev.id}`,
  type: 'quarterly',
  score: ev.overall_score,
  person: ev.evaluator,
  recommendation: isManager ? ev.recommendation : null,
  linkTo: `/evaluations/${ev.id}`
});
```

### Leave Components

#### AllRequestsTab
**File**: `src/components/leave/AllRequestsTab.tsx`

Displays all leave requests with filtering and approval actions.

#### ApplyLeaveModal
**File**: `src/components/leave/ApplyLeaveModal.tsx`

Modal for submitting new leave requests.

#### LeaveBalancesTab
**File**: `src/components/leave/LeaveBalancesTab.tsx`

Shows employee leave balances and usage.

#### MyRequestsTab
**File**: `src/components/leave/MyRequestsTab.tsx`

Personal leave request history and status.

### Settings Components

#### CompanyTab
**File**: `src/components/settings/CompanyTab.tsx`

Company information configuration.

#### DepartmentsTab
**File**: `src/components/settings/DepartmentsTab.tsx`

Department management interface.

#### RolesTab
**File**: `src/components/settings/RolesTab.tsx`

User role configuration.

## Shared Utility Components

### BeudoxLogo
**File**: `src/components/BeudoxLogo.tsx`

Application logo component with variant support.

**Props**:
```typescript
interface BeudoxLogoProps {
  variant?: 'default' | 'sidebar';
  showWordmark?: boolean;
  size?: number;
}
```

**Variants**:
- **default**: Full logo with wordmark
- **sidebar**: Compact version for navigation
- **icon-only**: Logo icon without text

**Usage**:
```typescript
<BeudoxLogo variant="sidebar" showWordmark={false} size={32} />
```

### NavLink
**File**: `src/components/NavLink.tsx`

React Router NavLink wrapper with consistent styling.

**Props**:
```typescript
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}
```

**Features**:
- **Active state styling**: Automatic class application
- **Pending states**: Loading state support
- **TypeScript compatibility**: Proper typing for React Router

### SearchableEmployeeSelect
**File**: `src/components/SearchableEmployeeSelect.tsx`

Advanced employee selection component with search functionality.

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

**Features**:
- **Real-time search**: Client-side filtering
- **Avatar display**: Employee photos with fallback initials
- **Keyboard navigation**: Full accessibility support
- **"All" option**: Optional aggregate selection
- **Popover interface**: Clean dropdown design

**Data Structure**:
```typescript
interface EmployeeOption {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  designation?: string | null;
}
```

### RichTextEditor
**File**: `src/components/hr-policies/RichTextEditor.tsx`

WYSIWYG editor for rich text content creation.

**Props**:
```typescript
interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}
```

**Features**:
- **TipTap integration**: Modern rich text editor
- **Formatting toolbar**: Bold, italic, headings, lists
- **Link support**: URL insertion and editing
- **HTML output**: Clean HTML generation
- **Responsive design**: Mobile-friendly interface

**Editor Configuration**:
```typescript
const editor = useEditor({
  extensions: [
    StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
    Underline,
    Link.configure({ openOnClick: false })
  ],
  content,
  onUpdate: ({ editor }) => onChange(editor.getHTML())
});
```

## Component Patterns & Best Practices

### Props Interface Design
```typescript
// Clear, descriptive prop names
interface ComponentProps {
  data: DataType;           // Primary data
  onAction: (data: DataType) => void;  // Event handlers
  isLoading?: boolean;      // State flags
  className?: string;       // Styling overrides
}
```

### State Management
```typescript
// Local state for UI concerns
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');

// Server state via React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: fetchResource
});
```

### Error Handling
```typescript
// Error boundaries for unexpected errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>

// User-friendly error states
{error && <Alert variant="destructive">{error.message}</Alert>}
```

### Performance Optimization
```typescript
// Memoization for expensive computations
const filteredData = useMemo(() => {
  return data.filter(item => item.name.includes(searchTerm));
}, [data, searchTerm]);

// Callback memoization
const handleClick = useCallback(() => {
  onAction(data);
}, [onAction, data]);
```

### Accessibility
```typescript
// ARIA labels and roles
<Button
  aria-label="Delete item"
  aria-describedby="delete-description"
>
  <TrashIcon />
</Button>

// Keyboard navigation
<div
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
```

## Testing Components

### Unit Testing
```typescript
// Component rendering
test('renders correctly', () => {
  render(<Component {...props} />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});

// User interactions
test('handles click', async () => {
  const mockFn = jest.fn();
  render(<Component onClick={mockFn} />);
  
  await userEvent.click(screen.getByRole('button'));
  expect(mockFn).toHaveBeenCalled();
});
```

### Integration Testing
```typescript
// Full user flows
test('complete employee creation', async () => {
  render(<App />);
  
  // Navigate to form
  await userEvent.click(screen.getByText('Add Employee'));
  
  // Fill form
  await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
  
  // Submit
  await userEvent.click(screen.getByText('Save'));
  
  // Verify result
  expect(screen.getByText('Employee created')).toBeInTheDocument();
});
```

This component documentation provides a comprehensive overview of the Beudox HR system's component architecture, patterns, and implementation details.