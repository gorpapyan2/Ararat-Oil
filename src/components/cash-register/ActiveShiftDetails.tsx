
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Shift, Sale } from "@/types";

interface ActiveShiftDetailsProps {
  shift: Shift;
}

export function ActiveShiftDetails({ shift }: ActiveShiftDetailsProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [expectedCash, setExpectedCash] = useState(0);

  useEffect(() => {
    const fetchShiftSales = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('shift_id', shift.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching shift sales:', error);
      } else {
        setSales(data as Sale[]);
        
        // Calculate totals
        const salesTotal = data.reduce((sum, sale) => sum + (sale.total_sales || 0), 0);
        setTotalSales(salesTotal);
        setExpectedCash(shift.opening_cash + salesTotal);
      }
      
      setIsLoading(false);
    };

    if (shift?.id) {
      fetchShiftSales();
    }
  }, [shift]);

  const shiftDuration = () => {
    const start = new Date(shift.start_time);
    const end = new Date();
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Active Shift Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-muted p-3">
            <div className="text-sm font-medium text-muted-foreground">Started</div>
            <div className="text-lg font-semibold">
              {new Date(shift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(shift.start_time).toLocaleDateString()}
            </div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-sm font-medium text-muted-foreground">Duration</div>
            <div className="text-lg font-semibold">
              {shiftDuration()}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-sm font-medium text-muted-foreground">Opening Cash</div>
            <div className="text-lg font-semibold">
              {shift.opening_cash} ֏
            </div>
            <div className="text-xs text-muted-foreground">Starting balance</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-sm font-medium text-muted-foreground">Expected Cash</div>
            <div className="text-lg font-semibold">
              {expectedCash} ֏
            </div>
            <div className="text-xs text-muted-foreground">
              {sales.length} sales totaling {totalSales} ֏
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium mt-6">Sales During This Shift</h3>
        {isLoading ? (
          <div className="flex justify-center p-6">Loading shift sales...</div>
        ) : sales.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            No sales have been recorded during this shift yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>System</TableHead>
                <TableHead className="text-right">Quantity (L)</TableHead>
                <TableHead className="text-right">Amount (֏)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {new Date(sale.created_at || '').toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </TableCell>
                  <TableCell className="capitalize">{sale.fuel_type}</TableCell>
                  <TableCell>{sale.filling_system_name}</TableCell>
                  <TableCell className="text-right">{sale.quantity.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{sale.total_sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
