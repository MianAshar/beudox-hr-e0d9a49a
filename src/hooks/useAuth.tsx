import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  role_name: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  employee: EmployeeData | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  employee: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployee = async (userId: string) => {
    const { data, error } = await supabase.rpc('get_employee_by_auth_id', {
      _auth_id: userId,
    });
    if (!error && data && data.length > 0) {
      setEmployee(data[0] as EmployeeData);
    } else {
      setEmployee(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setEmployee(null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, employee, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
