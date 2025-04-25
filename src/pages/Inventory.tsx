import { InventoryManager } from "@/components/inventory/InventoryManager";
import { PageLayout } from "@/layouts/PageLayout";
import { Package } from "lucide-react";

const Inventory = () => {
  return (
    <PageLayout
      title="Inventory"
      description="Manage your product inventory and stock levels"
      icon={Package}
    >
      <InventoryManager />
    </PageLayout>
  );
};

export default Inventory;
