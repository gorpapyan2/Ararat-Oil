
import { useQuery } from "@tanstack/react-query";
import { fetchInventory, type InventoryItem } from "@/services/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Fuel Type</TableHead>
                      <TableHead className="text-right">Opening Stock</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      <TableHead className="text-right">Sold</TableHead>
                      <TableHead className="text-right">Closing Stock</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>{item.fuel_type}</TableCell>
                        <TableCell className="text-right">{item.opening_stock}</TableCell>
                        <TableCell className="text-right">{item.received}</TableCell>
                        <TableCell className="text-right">{item.sold}</TableCell>
                        <TableCell className="text-right">{item.closing_stock}</TableCell>
                        <TableCell className="text-right">${item.unit_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.closing_stock * item.unit_price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
