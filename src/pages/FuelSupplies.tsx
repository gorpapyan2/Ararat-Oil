import { FuelSuppliesManager } from "@/components/fuel-supplies/FuelSuppliesManager";
import { PageLayout } from "@/layouts/PageLayout";
import { Fuel } from "lucide-react";

const FuelSupplies = () => {
  return (
    <PageLayout
      title="Fuel Supplies"
      description="Manage fuel supply deliveries and inventory"
      icon={Fuel}
    >
      <FuelSuppliesManager />
    </PageLayout>
  );
};

export default FuelSupplies;
