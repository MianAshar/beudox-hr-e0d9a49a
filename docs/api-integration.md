<!--
generated_by: tessera
source_sha: 1cec2ce393d8f182112788746e7935917c082ccd
generated_at: 2026-04-07T21:17:04.205Z
action: create
-->

# Beudox HR - API Integration Documentation

## Backend Architecture

Beudox HR uses Supabase as its backend, providing database, authentication, real-time subscriptions, and edge functions.

## Supabase Integration

### Client Configuration

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Authentication

#### Auth Hooks
```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchEmployeeProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchEmployeeProfile(session.user.id);
        } else {
          setEmployee(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ... auth methods
};
```

#### Auth Methods
```typescript
// Login
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Logout
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
```

## Database Operations

### React Query Integration

#### Query Pattern
```typescript
// src/hooks/useEmployees.ts
export const useEmployees = (companyId: string) => {
  return useQuery({
    queryKey: ['employees', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', companyId)
        .order('full_name');

      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });
};
```

#### Mutation Pattern
```typescript
// src/hooks/useCreateEmployee.ts
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: EmployeeInput) => {
      const { data, error } = await supabase
        .from('employees')
        .insert(employee)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create employee: ${error.message}`);
    },
  });
};
```

### Complex Queries

#### Employee with Relations
```typescript
// Fetch employee with department and role
const { data: employee } = await supabase
  .from('employees')
  .select(`
    *,
    department:departments(id, name),
    role:roles(id, name, permissions)
  `)
  .eq('id', employeeId)
  .single();
```

#### Evaluation Timeline
```typescript
// Complex evaluation query with joins
const { data: evaluations } = await supabase
  .from('evaluations')
  .select(`
    id, period, overall_score, comments, recommendation, created_at,
    evaluator:employees!evaluations_evaluated_by_fkey(id, full_name, avatar_url)
  `)
  .eq('company_id', companyId)
  .eq('employee_id', employeeId)
  .order('created_at', { ascending: false })
  .limit(20);
```

## Real-time Subscriptions

### Live Data Updates

```typescript
// Real-time employee updates
useEffect(() => {
  const channel = supabase
    .channel('employees')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'employees',
      filter: `company_id=eq.${companyId}`,
    }, (payload) => {
      console.log('Employee change:', payload);
      queryClient.invalidateQueries({ queryKey: ['employees', companyId] });
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [companyId]);
```

### Notification System

```typescript
// Real-time notifications
const { data: notifications } = useQuery({
  queryKey: ['notifications'],
  queryFn: async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data;
  },
});

// Subscribe to new notifications
useEffect(() => {
  const channel = supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      // Handle new notification
      toast(payload.new.message);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [userId]);
```

## Edge Functions

### Server-side Business Logic

#### Payroll Processing
```typescript
// supabase/functions/generate-payroll/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { employeeId, period } = await req.json();

  // Complex payroll calculation logic
  const payrollData = await calculatePayroll(employeeId, period);

  // Generate PDF payslip
  const pdfBuffer = await generatePayslipPDF(payrollData);

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="payslip.pdf"',
    },
  });
});
```

#### Invoice Generation
```typescript
// supabase/functions/generate-invoice-pdf/index.ts
serve(async (req) => {
  const { invoiceId } = await req.json();

  // Fetch invoice data with relations
  const invoice = await getInvoiceWithDetails(invoiceId);

  // Generate PDF with custom styling
  const pdf = await generateInvoicePDF(invoice);

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
    },
  });
});
```

#### Email Notifications
```typescript
// supabase/functions/send-invoice-email/index.ts
serve(async (req) => {
  const { invoiceId, recipientEmail } = await req.json();

  // Generate PDF attachment
  const pdfAttachment = await generateInvoicePDF(invoiceId);

  // Send email with attachment
  await sendEmail({
    to: recipientEmail,
    subject: 'Invoice from Beudox HR',
    attachments: [pdfAttachment],
  });

  return new Response(JSON.stringify({ success: true }));
});
```

## File Storage

### Avatar Upload

```typescript
// Upload employee avatar
const uploadAvatar = async (file: File, employeeId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${employeeId}/avatar.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Update employee record
  await supabase
    .from('employees')
    .update({ avatar_url: publicUrl })
    .eq('id', employeeId);

  return publicUrl;
};
```

### Document Storage

```typescript
// Upload HR policy documents
const uploadPolicyDocument = async (file: File, policyId: string) => {
  const fileName = `${policyId}/${file.name}`;

  const { data, error } = await supabase.storage
    .from('policy-documents')
    .upload(fileName, file);

  if (error) throw error;

  return supabase.storage
    .from('policy-documents')
    .getPublicUrl(fileName);
};
```

## Error Handling

### API Error Patterns

```typescript
// Consistent error handling
const handleApiError = (error: any) => {
  if (error?.code === 'PGRST116') {
    return 'Record not found';
  }
  if (error?.code === '23505') {
    return 'Duplicate entry';
  }
  if (error?.message?.includes('JWT')) {
    return 'Authentication expired';
  }
  return error?.message || 'An unexpected error occurred';
};
```

### Network Error Recovery

```typescript
// React Query error recovery
const query = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  retry: (failureCount, error) => {
    // Retry network errors, not auth errors
    if (error?.status === 401) return false;
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

## Security

### Row Level Security (RLS)

```sql
-- Example RLS policy for employees table
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view their company" ON employees
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "HR can manage employees" ON employees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = auth.uid()
      AND e.role_name IN ('hr_manager', 'ceo')
      AND e.company_id = employees.company_id
    )
  );
```

### Authentication Middleware

```typescript
// API route protection
const requireAuth = async (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('Invalid token');
  }

  return user;
};
```

## Performance Optimization

### Query Optimization

```typescript
// Efficient pagination
const { data, error } = await supabase
  .from('employees')
  .select('id, full_name, department(name)')
  .range(from, to)
  .order('full_name');
```

### Caching Strategy

```typescript
// React Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

### Connection Pooling

Supabase handles connection pooling automatically, but for high-traffic applications:

```typescript
// Connection optimization
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-my-custom-header': 'value',
    },
  },
});
```

This API integration provides a robust, secure, and performant backend for the Beudox HR application.