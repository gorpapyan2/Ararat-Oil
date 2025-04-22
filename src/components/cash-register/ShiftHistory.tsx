
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Shift } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export function ShiftHistory() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchShifts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('employee_id', user.id)
        .eq('status', 'CLOSED')
        .order('end_time', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching shifts:', error);
      } else {
        setShifts(data as Shift[]);
      }
      setIsLoading(false);
    };

    fetchShifts();
  }, [user]);

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Recent Shift History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">Loading shift history...</div>
        ) : shifts.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            No closed shifts found in your history.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Opening Cash</TableHead>
                <TableHead className="text-right">Closing Cash</TableHead>
                <TableHead className="text-right">Sales Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell>{new Date(shift.start_time).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {shift.end_time 
                      ? `${formatDuration(new Date(shift.start_time), new Date(shift.end_time))}`
                      : 'Open'}
                  </TableCell>
                  <TableCell className="text-right">{shift.opening_cash} ֏</TableCell>
                  <TableCell className="text-right">{shift.closing_cash || '-'} ֏</TableCell>
                  <TableCell className="text-right">{shift.sales_total || 0} ֏</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function formatDuration(start: Date, end: Date): string {
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}
