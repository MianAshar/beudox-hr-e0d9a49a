import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface EmployeeData {
  employee_id: string;
  full_name: string;
  email: string | null;
  employee_code: string | null;
  designation: string | null;
  department: string | null;
  avatar_url: string | null;
  company_id: string;
  company_name: string;
  company_slug: string;
  /** Highest-priority role (kept for backward compatibility). */
  role_name: string | null;
  /** All roles held by the employee. Permission checks should use this. */
  roles: string[];
  company_logo_url: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  employee: EmployeeData | null;
  loading: boolean;
  mustChangePassword: boolean;
  signOut: () => Promise<void>;
  refreshEmployee: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  employee: null,
  loading: true,
  mustChangePassword: false,
  signOut: async () => {},
  refreshEmployee: () => {},
});

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  employee: null,
  loading: true,
  signOut: async () => {},
  refreshEmployee: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployee = useCallback(async (userId: string) => {
    const [{ data, error }, rolesRes] = await Promise.all([
      supabase.rpc('get_employee_by_auth_id', { _auth_id: userId }),
      supabase.rpc('get_employee_roles_for_auth', { _auth_id: userId }),
    ]);

    if (!error && data && data.length > 0) {
      const base = data[0] as Omit<EmployeeData, 'roles'>;
      const rolesList = (rolesRes.data as string[] | null) ?? [];
      setEmployee({ ...base, roles: rolesList });
    } else {
      // Authenticated session has no matching active employee record.
      // Sign out to avoid an infinite loading spinner in ProtectedRoute.
      setEmployee(null);
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    }
  }, []);

  const refreshEmployee = useCallback(() => {
    if (user) {
      fetchEmployee(user.id);
    }
  }, [user, fetchEmployee]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setEmployee(null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => fetchEmployee(session.user.id), 0);
        } else {
          setEmployee(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchEmployee(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchEmployee]);

  return (
    <AuthContext.Provider value={{ session, user, employee, loading, signOut, refreshEmployee }}>
      {children}
    </AuthContext.Provider>
  );
};
