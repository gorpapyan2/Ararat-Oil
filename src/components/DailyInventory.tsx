
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { 
  fetchDailyInventoryRecords, 
  fetchFuelTanks,
  fetchEmployees,
  type DailyInventoryRecord,
  type FuelTank,
  type Employee
} from "@/services/supabase";

export function DailyInventory() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  const { data: records, isLoading: isLoadingRecords } = useQuery({
    queryKey: ['daily-inventory', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => fetchDailyInventoryRecords(format(selectedDate, 'yyyy-MM-dd')),
  });

  const { data: tanks } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks,
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </div>
        <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Daily Inventory Record</DialogTitle>
            </DialogHeader>
            {/* Form will be added in the next iteration */}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Inventory Records - {format(selectedDate, 'PP')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRecords ? (
            <div>Loading records...</div>
          ) : records && records.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tank</TableHead>
                  <TableHead className="text-right">Opening Stock</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Closing Stock</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead>Employee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.tank?.name}</TableCell>
                    <TableCell className="text-right">{record.opening_stock}</TableCell>
                    <TableCell className="text-right">{record.received}</TableCell>
                    <TableCell className="text-right">{record.sold}</TableCell>
                    <TableCell className="text-right">{record.closing_stock}</TableCell>
                    <TableCell className="text-right">${record.unit_price.toFixed(2)}</TableCell>
                    <TableCell>{record.employee?.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              No records found for this date.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
