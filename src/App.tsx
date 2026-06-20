import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { canAccess } from "@/lib/role-access";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MandatoryPasswordChange from "./components/MandatoryPasswordChange";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeForm from "./pages/EmployeeForm";
import Settings from "./pages/Settings";
import PublicHolidays from "./pages/PublicHolidays";
import Projects from "./pages/Projects";

import ProjectForm from "./pages/ProjectForm";
import ProjectDetail from "./pages/ProjectDetail";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Invoices from "./pages/Invoices";
import InvoiceForm from "./pages/InvoiceForm";
import InvoiceDetail from "./pages/InvoiceDetail";
import HrPolicies from "./pages/HrPolicies";
import HrPolicyDetail from "./pages/HrPolicyDetail";
import HrPolicyForm from "./pages/HrPolicyForm";
import JobDescriptions from "./pages/JobDescriptions";
import JobDescriptionDetail from "./pages/JobDescriptionDetail";
import JobDescriptionForm from "./pages/JobDescriptionForm";
import Evaluations from "./pages/Evaluations";
import EvaluationForm from "./pages/EvaluationForm";
import EvaluationDetail from "./pages/EvaluationDetail";
import DailyEvaluations from "./pages/DailyEvaluations";
import DailyEvaluationForm from "./pages/DailyEvaluationForm";
import DailyEvaluationDetail from "./pages/DailyEvaluationDetail";
import Loans from "./pages/Loans";
import Payroll from "./pages/Payroll";
import MyPayslip from "./pages/MyPayslip";
import FinanceSheet from "./pages/FinanceSheet";
import LeaveManagement from "./pages/LeaveManagement";
import MyProfile from "./pages/MyProfile";
import MyTasks from "./pages/MyTasks";
import Attendance from "./pages/Attendance";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, employee, mustChangePassword } = useAuth();
  const location = useLocation();

  // 1. Loading auth or employee data → show spinner, never flash content
  if (loading || (session && !employee)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Not authenticated → login
  if (!session) return <Navigate to="/login" replace />;

  // 3. Must change password → block all routes, show only the modal overlay
  if (mustChangePassword === true) {
    return <MandatoryPasswordChange />;
  }

  // 4. Authenticated but role not allowed → dashboard
  // /my-profile is universally accessible to all authenticated users.
  if (location.pathname !== '/my-profile' && !canAccess(employee?.roles, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 5. Authenticated and allowed → render
  return <AppLayout>{children}</AppLayout>;
};

const RootRedirect = () => {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
            <Route path="/set-password" element={<Navigate to="/login" replace />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
            <Route path="/employees/new" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
            <Route path="/employees/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
            <Route path="/employees/:id/edit" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
            <Route path="/holidays" element={<ProtectedRoute><PublicHolidays /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            
            <Route path="/projects/new" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/projects/:id/edit" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/invoices/new" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />
            <Route path="/invoices/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
            <Route path="/invoices/:id/edit" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />
            <Route path="/hr-policies" element={<ProtectedRoute><HrPolicies /></ProtectedRoute>} />
            <Route path="/hr-policies/new" element={<ProtectedRoute><HrPolicyForm /></ProtectedRoute>} />
            <Route path="/hr-policies/:id" element={<ProtectedRoute><HrPolicyDetail /></ProtectedRoute>} />
            <Route path="/hr-policies/:id/edit" element={<ProtectedRoute><HrPolicyForm /></ProtectedRoute>} />
            <Route path="/job-descriptions" element={<ProtectedRoute><JobDescriptions /></ProtectedRoute>} />
            <Route path="/job-descriptions/new" element={<ProtectedRoute><JobDescriptionForm /></ProtectedRoute>} />
            <Route path="/job-descriptions/:id" element={<ProtectedRoute><JobDescriptionDetail /></ProtectedRoute>} />
            <Route path="/job-descriptions/:id/edit" element={<ProtectedRoute><JobDescriptionForm /></ProtectedRoute>} />
            <Route path="/evaluations" element={<ProtectedRoute><Evaluations /></ProtectedRoute>} />
            <Route path="/evaluations/new" element={<ProtectedRoute><EvaluationForm /></ProtectedRoute>} />
            <Route path="/evaluations/:id" element={<ProtectedRoute><EvaluationDetail /></ProtectedRoute>} />
            <Route path="/evaluations/:id/edit" element={<ProtectedRoute><EvaluationForm /></ProtectedRoute>} />
            <Route path="/evaluations/daily" element={<ProtectedRoute><DailyEvaluations /></ProtectedRoute>} />
            <Route path="/evaluations/daily/new" element={<ProtectedRoute><DailyEvaluationForm /></ProtectedRoute>} />
            <Route path="/evaluations/daily/:id" element={<ProtectedRoute><DailyEvaluationDetail /></ProtectedRoute>} />
            <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
            <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
            <Route path="/my-payslip" element={<ProtectedRoute><MyPayslip /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><FinanceSheet /></ProtectedRoute>} />
            <Route path="/leave" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
            <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
