
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
        .select(`
          *,
          filling_system:filling_systems(
            name,
            tank:fuel_tanks(
              fuel_type
            )
          )
        `)
        .eq('shift_id', shift.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching shift sales:', error);
      } else {
        // Transform the data to match the Sale type
        const formattedSales = data.map(item => ({
          id: item.id,
          date: item.date,
          fuel_type: (item.filling_system?.tank?.fuel_type as Sale['fuel_type']) || 'petrol',
          quantity: item.total_sold_liters || 0,
          price_per_unit: item.price_per_unit,
          total_sales: item.total_sales,
          payment_status: item.payment_status as Sale['payment_status'],
          filling_system_name: item.filling_system?.name || 'Unknown',
          created_at: item.created_at,
          meter_start: item.meter_start || 0,
          meter_end: item.meter_end || 0,
          filling_system_id: item.filling_system_id || '',
          employee_id: item.employee_id || '',
          shift_id: item.shift_id
        }));
        
        setSales(formattedSales);
        
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
    <Card className="border-none shadow-sm bg-background">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-text-base">Active Shift Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-secondary/20 p-3">
            <div className="text-sm font-medium text-text-muted">Started</div>
            <div className="text-lg font-semibold text-text-base">
              {new Date(shift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-text-muted">
              {new Date(shift.start_time).toLocaleDateString()}
            </div>
          </div>
          <div className="rounded-lg bg-secondary/20 p-3">
            <div className="text-sm font-medium text-text-muted">Duration</div>
            <div className="text-lg font-semibold text-text-base">
              {shiftDuration()}
            </div>
            <div className="text-xs text-text-muted">Active</div>
          </div>
          <div className="rounded-lg bg-secondary/20 p-3">
            <div className="text-sm font-medium text-text-muted">Opening Cash</div>
            <div className="text-lg font-semibold text-text-base">
              {shift.opening_cash} ֏
            </div>
            <div className="text-xs text-text-muted">Starting balance</div>
          </div>
          <div className="rounded-lg bg-secondary/20 p-3">
            <div className="text-sm font-medium text-text-muted">Expected Cash</div>
            <div className="text-lg font-semibold text-text-base">
              {expectedCash} ֏
            </div>
            <div className="text-xs text-text-muted">
              {sales.length} sales totaling {totalSales} ֏
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium mt-6 text-text-base">Sales During This Shift</h3>
        {isLoading ? (
          <div className="flex justify-center p-6 text-text-muted">Loading shift sales...</div>
        ) : sales.length === 0 ? (
          <div className="text-center p-6 text-text-muted">
            No sales have been recorded during this shift yet.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="text-text-muted">Time</TableHead>
                <TableHead className="text-text-muted">Fuel Type</TableHead>
                <TableHead className="text-text-muted">System</TableHead>
                <TableHead className="text-right text-text-muted">Quantity (L)</TableHead>
                <TableHead className="text-right text-text-muted">Amount (֏)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-secondary/10">
                  <TableCell className="text-text-base">
                    {new Date(sale.created_at || '').toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </TableCell>
                  <TableCell className="capitalize text-text-base">{sale.fuel_type}</TableCell>
                  <TableCell className="text-text-base">{sale.filling_system_name}</TableCell>
                  <TableCell className="text-right text-text-base">{sale.quantity.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-text-base">{sale.total_sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
