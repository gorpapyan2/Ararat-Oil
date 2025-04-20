
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import InventoryForm from "@/pages/InventoryForm";
import Employees from "@/pages/Employees";
import FillingSystems from "@/pages/FillingSystems";
import Sales from "@/pages/Sales";
import PetrolProviders from "@/pages/PetrolProviders";
import FuelSupplies from "@/pages/FuelSupplies";  // Add this line

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/new" element={<InventoryForm />} />
            <Route path="/filling-systems" element={<FillingSystems />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/providers" element={<PetrolProviders />} />
            <Route path="/fuel-supplies" element={<FuelSupplies />} />  {/* Add this line */}
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
