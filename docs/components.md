<!--
generated_by: tessera
source_sha: 91a7ddffb5c8bb2e9463683161eacd0d041403f9
generated_at: 2026-04-12T19:31:32.730Z
action: create
-->

# Component Documentation

## Core Components

### Layout Components

#### AppLayout
**File**: `src/components/layout/AppLayout.tsx`

Main application layout wrapper that provides:
- Responsive sidebar navigation
- Top bar with user menu and notifications
- Content area with proper spacing
- Mobile-responsive design

**Props**: Accepts children components

#### AppSidebar
**File**: `src/components/layout/AppSidebar.tsx`

Navigation sidebar with:
- Role-based menu items
- Collapsible design
- Active route highlighting
- Company branding

**Features**:
- Different menu items based on user role
- Icon-based navigation
- Keyboard accessibility

#### TopBar
**File**: `src/components/layout/TopBar.tsx`

Top navigation bar containing:
- User avatar and dropdown menu
- Notification bell with count
- Search functionality (future)
- Logout option

#### NotificationBell
**File**: `src/components/layout/NotificationBell.tsx`

Notification system component:
- Real-time notification count
- Dropdown with recent notifications
- Mark as read functionality
- Link to full notifications page

### Feature Components

#### EvaluationTimeline
**File**: `src/components/evaluations/EvaluationTimeline.tsx`

Displays evaluation history for an employee:

**Props**:
- `employeeId: string` - Target employee ID
- `companyId: string` - Company context

**Features**:
- Quarterly evaluations (formal reviews with recommendations)
- Daily evaluations (peer feedback)
- Role-based visibility (managers see recommendations, employees don't)
- Timeline layout with avatars and star ratings
- Pagination for large datasets

**Data Sources**:
- `evaluations` table for quarterly reviews
- `daily_evaluations` table for peer feedback

#### RichTextEditor
**File**: `src/components/hr-policies/RichTextEditor.tsx`

Full-featured rich text editor for HR policies:

**Props**:
- `content: string` - HTML content
- `onChange: (html: string) => void` - Content change handler

**Features**:
- Formatting toolbar with common options
- Headings (H1, H2, H3)
- Text formatting (bold, italic, underline)
- Lists (bulleted, numbered)
- Link insertion and editing
- HTML output for database storage

**Dependencies**: Tiptap editor with extensions

#### SearchableEmployeeSelect
**File**: `src/components/SearchableEmployeeSelect.tsx`

Advanced employee selection component:

**Props**:
- `employees: EmployeeOption[]` - Array of employee data
- `value: string` - Selected employee ID
- `onValueChange: (id: string) => void` - Selection handler
- `placeholder?: string` - Placeholder text
- `disabled?: boolean` - Disable state
- `allowAll?: boolean` - Show "All Employees" option
- `allLabel?: string` - Custom label for "All" option

**Features**:
- Search by name or designation
- Avatar display with fallback initials
- Keyboard navigation
- Accessible design with ARIA labels

**EmployeeOption Interface**:
```typescript
interface EmployeeOption {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  designation?: string | null;
}
```

### UI Components

The application uses shadcn/ui components built on Radix UI primitives:

#### Form Components
- **Button**: Various variants (default, outline, ghost, destructive)
- **Input**: Text input with validation states
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection component
- **Checkbox**: Boolean input
- **RadioGroup**: Single selection from options

#### Layout Components
- **Card**: Content container with header, content, footer
- **Dialog**: Modal dialogs for forms and confirmations
- **Sheet**: Slide-out panels for mobile navigation
- **Tabs**: Tabbed interface for organizing content
- **Accordion**: Collapsible content sections

#### Data Display
- **Table**: Data tables with sorting and pagination
- **Badge**: Status indicators and labels
- **Avatar**: User profile images with fallbacks
- **Skeleton**: Loading state placeholders

#### Feedback Components
- **Alert**: Status messages and notifications
- **Toast**: Non-intrusive notifications
- **Progress**: Progress indicators
- **Spinner**: Loading indicators

### Utility Components

#### NavLink
**File**: `src/components/NavLink.tsx`

Enhanced navigation link component:
- React Router integration
- Active state styling
- Pending state handling
- Custom className and activeClassName props

#### BeudoxLogo
**File**: `src/components/BeudoxLogo.tsx`

Company logo component:
- Multiple variants (default, sidebar)
- Wordmark toggle
- Configurable size
- SVG-based for crisp rendering

## Component Patterns

### Compound Components
Used for complex UI patterns like forms and data tables where multiple related components work together.

### Render Props
Used for flexible components like dropdowns and popovers where consumers can customize rendering.

### Custom Hooks
Business logic is extracted into custom hooks for reusability:
- `useAuth`: Authentication state
- `useToast`: Notification system
- `useForm`: Form state management

### Higher-Order Components
Used sparingly for cross-cutting concerns like error boundaries and loading states.

## Styling Patterns

### CSS Classes
- Tailwind CSS for utility-first styling
- Custom CSS variables for design tokens
- Component-specific styles in `.module.css` files

### Theme Support
- CSS custom properties for theming
- Dark/light mode support (future)
- Consistent spacing and color scales

### Responsive Design
- Mobile-first approach
- Breakpoint-based responsive utilities
- Flexible grid and flexbox layouts

## Accessibility

All components follow WCAG guidelines:
- Semantic HTML elements
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## Performance Considerations

### Optimization Techniques
- React.memo for expensive components
- useMemo for computed values
- useCallback for event handlers
- Lazy loading for route components
- Virtual scrolling for large lists

### Bundle Splitting
- Route-based code splitting
- Dynamic imports for heavy components
- Tree shaking for unused exports

This component architecture provides a solid foundation for building complex HR management features with consistent UX and maintainable code.