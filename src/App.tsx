import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { AdminShell } from "@/layouts/AdminShell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/loading";

import DashboardNew from "@/pages/DashboardNew";
import Tanks from "@/pages/Tanks";
import EmployeesNew from "@/pages/EmployeesNew";
import FillingSystems from "@/pages/FillingSystems";
import SalesNew from "@/pages/SalesNew";
import PetrolProviders from "@/pages/PetrolProviders";
import FuelSupplies from "@/pages/FuelSupplies";
import Expenses from "@/pages/Expenses";
import Auth from "@/pages/Auth";
import Transactions from "@/pages/Transactions";
import Shifts from "@/pages/Shifts";
import Todo from "@/pages/Todo";
import UnifiedData from "@/pages/UnifiedData";
import FuelManagement from "@/pages/FuelManagement";
import Settings from "@/pages/Settings";

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
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AdminShell>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <DashboardNew />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/fuel-management"
                  element={
                    <RequireAuth>
                      <FuelManagement />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/tanks"
                  element={
                    <RequireAuth>
                      <Navigate to="/fuel-management?tab=tanks" replace />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/filling-systems"
                  element={
                    <RequireAuth>
                      <Navigate
                        to="/fuel-management?tab=filling-systems"
                        replace
                      />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/fuel-supplies"
                  element={
                    <RequireAuth>
                      <Navigate
                        to="/fuel-management?tab=fuel-supplies"
                        replace
                      />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <RequireAuth>
                      <EmployeesNew />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/sales"
                  element={
                    <RequireAuth>
                      <SalesNew />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/shifts"
                  element={
                    <RequireAuth>
                      <Shifts />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/providers"
                  element={
                    <RequireAuth>
                      <PetrolProviders />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <RequireAuth>
                      <Expenses />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <RequireAuth>
                      <Transactions />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/todo"
                  element={
                    <RequireAuth>
                      <Todo />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/unified-data"
                  element={
                    <RequireAuth>
                      <UnifiedData />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  }
                />
                {/* Catch-all route to redirect any unmatched paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AdminShell>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
