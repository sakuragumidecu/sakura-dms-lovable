import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import DashboardPage from "@/pages/DashboardPage";
import UploadPage from "@/pages/UploadPage";
import ArchivePage from "@/pages/ArchivePage";
import ApprovalPage from "@/pages/ApprovalPage";
import RoleManagementPage from "@/pages/RoleManagementPage";
import UserManagementPage from "@/pages/UserManagementPage";
import LogPage from "@/pages/LogPage";
import SettingsPage from "@/pages/SettingsPage";
import VerifyPage from "@/pages/VerifyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isLoggedIn } = useApp();
  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <HomePage />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignUpPage />} />
      <Route path="/verify/:id" element={<VerifyPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/approval" element={<ApprovalPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/roles" element={<RoleManagementPage />} />
        <Route path="/logs" element={<LogPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppWithSettings() {
  return (
    <SettingsProvider>
      <AppRoutes />
    </SettingsProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppWithSettings />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
