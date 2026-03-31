import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { canAccess } from "@/lib/role-access";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import SetPassword from "./pages/SetPassword";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeForm from "./pages/EmployeeForm";
import Settings from "./pages/Settings";
import PublicHolidays from "./pages/PublicHolidays";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, passwordMode, clearPasswordMode, employee } = useAuth();
  const location = useLocation();

  // 1. Loading auth or employee data → show spinner, never flash content
  if (loading || (session && !employee)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Intercept invite/recovery before showing dashboard
  if (session && passwordMode) {
    return <SetPassword mode={passwordMode} onComplete={clearPasswordMode} />;
  }

  // 2. Not authenticated → login
  if (!session) return <Navigate to="/login" replace />;

  // 3. Authenticated but role not allowed → dashboard
  if (!canAccess(employee?.role_name, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Authenticated and allowed → render
  return <AppLayout>{children}</AppLayout>;
};

const RootRedirect = () => {
  const { session, loading, passwordMode, clearPasswordMode } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  // Intercept at root too
  if (session && passwordMode) {
    return <SetPassword mode={passwordMode} onComplete={clearPasswordMode} />;
  }
  return <Navigate to={session ? "/dashboard" : "/login"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
            <Route path="/employees/new" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
            <Route path="/employees/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
            <Route path="/employees/:id/edit" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
