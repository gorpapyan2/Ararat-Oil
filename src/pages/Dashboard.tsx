
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  fetchSales, 
  fetchExpenses, 
  fetchInventory,
  type Sale,
  type Expense,
  type InventoryItem
} from "@/services/supabase";

export default function Dashboard() {
  const { data: salesData, isLoading: isSalesLoading } = useQuery<Sale[]>({
    queryKey: ['sales'],
    queryFn: fetchSales,
  });

  const { data: expensesData, isLoading: isExpensesLoading } = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  const { data: inventoryData, isLoading: isInventoryLoading } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  // Calculate total sales with proper type checking
  const totalSales = salesData?.reduce((sum, sale) => 
    sum + Number(sale.total_sales || 0), 0) || 0;
  
  // Calculate total expenses with proper type checking
  const totalExpenses = expensesData?.reduce((sum, expense) => 
    sum + Number(expense.amount || 0), 0) || 0;
  
  // Calculate net profit
  const netProfit = totalSales - totalExpenses;
  
  // Calculate inventory value with proper type checking
  const inventoryValue = inventoryData?.reduce((sum, item) => 
    sum + (Number(item.closing_stock || 0) * Number(item.unit_price || 0)), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isSalesLoading ? "Loading..." : `${totalSales.toLocaleString()} ֏`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isExpensesLoading ? "Loading..." : `${totalExpenses.toLocaleString()} ֏`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {isSalesLoading || isExpensesLoading ? "Loading..." : `${netProfit.toLocaleString()} ֏`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isInventoryLoading ? "Loading..." : `${inventoryValue.toLocaleString()} ֏`}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
