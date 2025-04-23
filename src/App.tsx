import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Employees from "@/pages/Employees";
import FillingSystems from "@/pages/FillingSystems";
import Sales from "@/pages/Sales";
import PetrolProviders from "@/pages/PetrolProviders";
import FuelSupplies from "@/pages/FuelSupplies";
import Expenses from "@/pages/Expenses";
import Auth from "@/pages/Auth";
import Transactions from "@/pages/Transactions";
import Tanks from "@/pages/Tanks";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes with PublicLayout */}
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/auth" element={<PublicLayout><Auth /></PublicLayout>} />
            
            {/* Protected routes with MainLayout */}
            <Route path="/dashboard" element={
                <RequireAuth>
                  <MainLayout><Dashboard /></MainLayout>
                </RequireAuth>
              } />
              <Route path="/inventory" element={
                <RequireAuth>
                  <MainLayout><Inventory /></MainLayout>
                </RequireAuth>
              } />
              <Route path="/filling-systems" element={
                <RequireAuth>
                  <MainLayout><FillingSystems /></MainLayout>
                </RequireAuth>
              } />
              <Route path="/employees" element={
                <RequireAuth>
                  <MainLayout><Employees /></MainLayout>
                </RequireAuth>
              } />
              <Route path="/sales" element={
                <RequireAuth>
                  <MainLayout><Sales /></MainLayout>
                </RequireAuth>
              } />
              <Route path="/petrol-providers" element={
                <RequireAuth>
                  <MainLayout><PetrolProviders /></MainLayout>
                </RequireAuth>
              } />
              <Route path="/fuel-supplies" element={
                <RequireAuth>
                  <MainLayout><FuelSupplies /></MainLayout>
                </RequireAuth>
              } />
              <Route path="/expenses" element={
                <RequireAuth>
                  <MainLayout><Expenses /></MainLayout>
                </RequireAuth>
              } />
              <Route 
                path="/transactions" 
                element={
                  <RequireAuth>
                    <MainLayout><Transactions /></MainLayout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/tanks" 
                element={
                  <RequireAuth>
                    <MainLayout><Tanks /></MainLayout>
                  </RequireAuth>
                } 
              />

              {/* Handle not found */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
