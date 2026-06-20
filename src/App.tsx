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

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
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
  return <AppLayout>{children ?? <Outlet />}</AppLayout>;
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

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/:id" element={<EmployeeProfile />} />
              <Route path="/employees/:id/edit" element={<EmployeeForm />} />
              <Route path="/holidays" element={<PublicHolidays />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/new" element={<ProjectForm />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/projects/:id/edit" element={<ProjectForm />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/new" element={<InvoiceForm />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/invoices/:id/edit" element={<InvoiceForm />} />
              <Route path="/hr-policies" element={<HrPolicies />} />
              <Route path="/hr-policies/new" element={<HrPolicyForm />} />
              <Route path="/hr-policies/:id" element={<HrPolicyDetail />} />
              <Route path="/hr-policies/:id/edit" element={<HrPolicyForm />} />
              <Route path="/job-descriptions" element={<JobDescriptions />} />
              <Route path="/job-descriptions/new" element={<JobDescriptionForm />} />
              <Route path="/job-descriptions/:id" element={<JobDescriptionDetail />} />
              <Route path="/job-descriptions/:id/edit" element={<JobDescriptionForm />} />
              <Route path="/evaluations" element={<Evaluations />} />
              <Route path="/evaluations/new" element={<EvaluationForm />} />
              <Route path="/evaluations/:id" element={<EvaluationDetail />} />
              <Route path="/evaluations/:id/edit" element={<EvaluationForm />} />
              <Route path="/evaluations/daily" element={<DailyEvaluations />} />
              <Route path="/evaluations/daily/new" element={<DailyEvaluationForm />} />
              <Route path="/evaluations/daily/:id" element={<DailyEvaluationDetail />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/my-payslip" element={<MyPayslip />} />
              <Route path="/finance" element={<FinanceSheet />} />
              <Route path="/leave" element={<LeaveManagement />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/my-tasks" element={<MyTasks />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
