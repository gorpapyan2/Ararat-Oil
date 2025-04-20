
import { useQuery } from "@tanstack/react-query";
import { fetchInventory, type InventoryItem } from "@/services/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Inventory() {
  const { data: inventoryData, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
      </div>
      
      {isLoading ? (
        <div>Loading inventory data...</div>
      ) : inventoryData && inventoryData.length > 0 ? (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Fuel Type</th>
                      <th className="text-right p-2">Opening Stock</th>
                      <th className="text-right p-2">Received</th>
                      <th className="text-right p-2">Sold</th>
                      <th className="text-right p-2">Closing Stock</th>
                      <th className="text-right p-2">Unit Price</th>
                      <th className="text-right p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="p-2">{item.fuel_type}</td>
                        <td className="text-right p-2">{item.opening_stock}</td>
                        <td className="text-right p-2">{item.received}</td>
                        <td className="text-right p-2">{item.sold}</td>
                        <td className="text-right p-2">{item.closing_stock}</td>
                        <td className="text-right p-2">${item.unit_price.toFixed(2)}</td>
                        <td className="text-right p-2">${(item.closing_stock * item.unit_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-6">
          <p>No inventory data available.</p>
        </div>
      )}
    </div>
  );
}
