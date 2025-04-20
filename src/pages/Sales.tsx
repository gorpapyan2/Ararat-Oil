
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SalesManager } from "@/components/sales/SalesManager";

const Sales = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Management</CardTitle>
          <CardDescription>View and manage fuel sales records</CardDescription>
        </CardHeader>
      </Card>
      <SalesManager />
    </div>
  );
};

export default Sales;
