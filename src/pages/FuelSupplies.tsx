import { FuelSuppliesManager } from "@/components/fuel-supplies/FuelSuppliesManager";
import { PageLayout } from "@/layouts/PageLayout";
import { Fuel } from "lucide-react";
import { useState } from "react";

const FuelSupplies = () => {
  const [action, setAction] = useState<React.ReactNode>(null);

  return (
    <PageLayout
      title="Fuel Supplies"
      description="Manage fuel supply deliveries and inventory"
      icon={Fuel}
      action={action}
    >
      <FuelSuppliesManager onRenderAction={setAction} />
    </PageLayout>
  );
};

export default FuelSupplies;
