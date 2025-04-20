
import { useQuery } from "@tanstack/react-query";
import { fetchFuelSupplies } from "@/services/fuel-supplies";
import { FuelSuppliesManager } from "@/components/fuel-supplies/FuelSuppliesManager";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FuelSupplies = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fuel Supplies Management</CardTitle>
          <CardDescription>View and manage fuel supply records</CardDescription>
        </CardHeader>
      </Card>
      <FuelSuppliesManager />
    </div>
  );
};

export default FuelSupplies;
