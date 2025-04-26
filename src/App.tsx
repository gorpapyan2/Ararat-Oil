import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/loading";
import { ThemeProvider } from "next-themes";

import Dashboard from "@/pages/Dashboard";
import Tanks from "@/pages/Tanks";
import Employees from "@/pages/Employees";
import FillingSystems from "@/pages/FillingSystems";
import Sales from "@/pages/Sales";
import PetrolProviders from "@/pages/PetrolProviders";
import FuelSupplies from "@/pages/FuelSupplies";
import Expenses from "@/pages/Expenses";
import Auth from "@/pages/Auth";
import Transactions from "@/pages/Transactions";
import Shifts from "@/pages/Shifts";
import Todo from "@/pages/Todo";
import UnifiedData from "@/pages/UnifiedData";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading variant="fullscreen" text="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <MainLayout>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } />
                <Route path="/tanks" element={
                  <RequireAuth>
                    <Tanks />
                  </RequireAuth>
                } />
                <Route path="/filling-systems" element={
                  <RequireAuth>
                    <FillingSystems />
                  </RequireAuth>
                } />
                <Route path="/employees" element={
                  <RequireAuth>
                    <Employees />
                  </RequireAuth>
                } />
                <Route path="/sales" element={
                  <RequireAuth>
                    <Sales />
                  </RequireAuth>
                } />
                <Route path="/shifts" element={
                  <RequireAuth>
                    <Shifts />
                  </RequireAuth>
                } />
                <Route path="/providers" element={
                  <RequireAuth>
                    <PetrolProviders />
                  </RequireAuth>
                } />
                <Route path="/fuel-supplies" element={
                  <RequireAuth>
                    <FuelSupplies />
                  </RequireAuth>
                } />
                <Route path="/expenses" element={
                  <RequireAuth>
                    <Expenses />
                  </RequireAuth>
                } />
                <Route 
                  path="/transactions" 
                  element={
                    <RequireAuth>
                      <Transactions />
                    </RequireAuth>
                  } 
                />
                <Route path="/todo" element={
                  <RequireAuth>
                    <Todo />
                  </RequireAuth>
                } />
                <Route path="/unified-data" element={
                  <RequireAuth>
                    <UnifiedData />
                  </RequireAuth>
                } />
              </Routes>
            </MainLayout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
