<!--
generated_by: tessera
source_sha: 5ad27002d46dd144b4404dd6446fd9fca6cca7e0
generated_at: 2026-04-07T20:51:03.221Z
action: create
-->

# Beudox HR - Component Documentation

## Core Components

### Layout Components

#### AppLayout
**Location**: `src/components/layout/AppLayout.tsx`
**Purpose**: Main application wrapper providing consistent layout structure
**Features**:
- Responsive sidebar navigation
- Top bar with user menu
- Content area with proper spacing
- Mobile-responsive design

#### AppSidebar
**Location**: `src/components/layout/AppSidebar.tsx`
**Purpose**: Navigation sidebar with role-based menu items
**Features**:
- Collapsible navigation
- Role-based menu visibility
- Active route highlighting
- Company branding

#### TopBar
**Location**: `src/components/layout/TopBar.tsx`
**Purpose**: Application header with user controls
**Features**:
- User avatar and profile menu
- Notification center
- Quick actions
- Responsive behavior

### UI Components

#### BeudoxLogo
**Location**: `src/components/BeudoxLogo.tsx`
**Purpose**: Configurable logo component for branding
**Props**:
- `variant`: 'default' | 'sidebar' - Logo style variant
- `showWordmark`: boolean - Whether to show text alongside icon
- `size`: number - Logo dimensions in pixels
**Features**:
- Theme-aware variants (light/dark)
- Responsive sizing
- SVG-based for crisp rendering

#### NavLink
**Location**: `src/components/NavLink.tsx`
**Purpose**: Enhanced navigation link with active state styling
**Props**:
- Extends React Router NavLinkProps
- `activeClassName`: string - CSS class for active state
- `pendingClassName`: string - CSS class for pending state
**Features**:
- Active route detection
- Custom styling support
- TypeScript compatibility

### Business Components

#### SearchableEmployeeSelect
**Location**: `src/components/SearchableEmployeeSelect.tsx`
**Purpose**: Advanced employee selection component with search functionality
**Props**:
- `employees`: EmployeeOption[] - List of available employees
- `value`: string - Currently selected employee ID
- `onValueChange`: (id: string) => void - Selection change handler
- `placeholder`: string - Input placeholder text
- `disabled`: boolean - Disable interaction
- `allowAll`: boolean - Include "All Employees" option
- `allLabel`: string - Label for "All" option
**Features**:
- Real-time search filtering
- Avatar display with initials fallback
- Keyboard navigation
- Accessible design

#### EvaluationTimeline
**Location**: `src/components/evaluations/EvaluationTimeline.tsx`
**Purpose**: Chronological display of employee evaluations
**Props**:
- `employeeId`: string - Target employee ID
- `companyId`: string - Company context
**Features**:
- Quarterly and daily evaluation display
- Role-based visibility filtering
- Interactive timeline with links
- Score visualization with star ratings
- Responsive card-based layout

#### RichTextEditor
**Location**: `src/components/hr-policies/RichTextEditor.tsx`
**Purpose**: Full-featured rich text editor for HR policy documents
**Props**:
- `content`: string - HTML content
- `onChange`: (html: string) => void - Content change handler
**Features**:
- Formatting toolbar (bold, italic, underline, headings, lists)
- Link insertion and editing
- HTML output
- ProseMirror-based editing
- Accessible keyboard navigation

### UI Primitive Components

The application includes a comprehensive set of reusable UI components built on Radix UI:

#### Form Controls
- `Button`: Action buttons with variants (primary, secondary, outline, ghost)
- `Input`: Text input fields
- `Textarea`: Multi-line text input
- `Select`: Dropdown selection
- `Checkbox`: Boolean selection
- `RadioGroup`: Single selection from options
- `Switch`: Toggle control

#### Layout Components
- `Card`: Content containers with headers and footers
- `Tabs`: Tabbed interface organization
- `Accordion`: Collapsible content sections
- `Collapsible`: Expandable content areas
- `Separator`: Visual content separation

#### Feedback Components
- `Toast`: Non-intrusive notifications
- `Alert`: Important information display
- `Dialog`: Modal dialogs for confirmations
- `AlertDialog`: Destructive action confirmations
- `Sheet`: Slide-out panels
- `Popover`: Floating content containers

#### Data Display
- `Table`: Data tables with sorting and pagination
- `Chart`: Data visualization (using Recharts)
- `Avatar`: User profile images with fallbacks
- `Badge`: Status and category indicators
- `Progress`: Progress bars and indicators

#### Navigation
- `NavigationMenu`: Complex navigation structures
- `Breadcrumb`: Location context display
- `Pagination`: Data pagination controls

### Component Patterns

#### Controlled Components
Most form components follow controlled patterns:
- Props for value and onChange
- Validation state handling
- Accessibility attributes
- Consistent API design

#### Compound Components
Complex components use compound patterns:
- `Popover` with `PopoverTrigger` and `PopoverContent`
- `Command` with `CommandInput`, `CommandList`, `CommandItem`
- `Form` with `FormField`, `FormLabel`, `FormControl`

#### Custom Hooks Integration
Components integrate with custom hooks:
- `useAuth` for authentication state
- `useToast` for notifications
- React Query hooks for data fetching

### Styling Approach

#### Design System
- **Tailwind CSS**: Utility-first styling
- **CSS Variables**: Theme customization
- **Component Variants**: Consistent visual variants
- **Responsive Design**: Mobile-first approach

#### Theme Support
- Light/dark mode support
- Consistent color palette
- Typography scale
- Spacing system

### Accessibility

All components follow accessibility best practices:
- ARIA attributes and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

### Performance Considerations

- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive computations cached
- **Virtualization**: Large lists optimized
- **Bundle Splitting**: Code split by routes

This component architecture provides a solid foundation for building complex HR management interfaces with consistent UX and maintainable code.