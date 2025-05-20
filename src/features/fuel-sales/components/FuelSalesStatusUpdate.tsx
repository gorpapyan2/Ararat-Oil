import { useCallback } from "react";
import { useToast } from "@/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import { Button } from "@/core/components/ui/button";
import { Badge } from '@/core/components/ui/badge';
import { Check, ChevronDown } from "lucide-react";
import { useFuelSales } from "../hooks/useFuelSales";
import type { FuelSale } from "../types/fuel-sales.types";

interface FuelSalesStatusUpdateProps {
  sale: FuelSale;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  completed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  failed: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
} as const;

const statusLabels = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
} as const;

export function FuelSalesStatusUpdate({ sale }: FuelSalesStatusUpdateProps) {
  const { toast } = useToast();
  const { updateSale } = useFuelSales();

  const handleStatusChange = useCallback(async (newStatus: typeof sale.payment_status) => {
    try {
      await updateSale.mutateAsync({
        id: sale.id,
        data: { payment_status: newStatus },
      });
      toast({
        title: "Success",
        description: `Payment status updated to ${statusLabels[newStatus]}`,
      });
    } catch (error: any) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update payment status",
        variant: "destructive",
      });
    }
  }, [sale.id, updateSale, toast]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 px-2 ${statusColors[sale.payment_status]}`}
        >
          <span className="flex items-center gap-2">
            {statusLabels[sale.payment_status]}
            <ChevronDown className="h-4 w-4" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(statusLabels).map(([status, label]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status as typeof sale.payment_status)}
            className="flex items-center gap-2"
          >
            {sale.payment_status === status && (
              <Check className="h-4 w-4" />
            )}
            <Badge
              variant="outline"
              className={statusColors[status as keyof typeof statusColors]}
            >
              {label}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 