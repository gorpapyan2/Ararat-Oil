import { useCallback } from "react";
import { useToast } from "@/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/primitives/badge";
import { Check, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { salesApi } from "@/core/api";
import type { FuelSale } from "../types/fuel-sales.types";

interface FuelSalesStatusUpdateProps {
  sale: FuelSale;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  completed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
} as const;

const statusLabels = {
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
} as const;

export function FuelSalesStatusUpdate({ sale }: FuelSalesStatusUpdateProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusChange = useCallback(
    async (newStatus: "pending" | "completed" | "cancelled") => {
      try {
        // Direct API call to update payment status
        const response = await salesApi.updateSale(sale.id, {
          payment_status: newStatus,
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["fuel-sales"] });
        queryClient.invalidateQueries({ queryKey: ["fuel-sale", sale.id] });

        toast({
          title: "Success",
          description: `Payment status updated to ${statusLabels[newStatus]}`,
        });
      } catch (error: unknown) {
        console.error("Error updating fuel sale status:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update fuel sale status.",
          variant: "destructive",
        });
      }
    },
    [sale.id, queryClient, toast]
  );

  // Get current status with fallback
  const currentStatus = sale.payment_status || "pending";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 px-2 ${statusColors[currentStatus as keyof typeof statusColors] || statusColors.pending}`}
        >
          <span className="flex items-center gap-2">
            {statusLabels[currentStatus as keyof typeof statusLabels] || "Pending"}
            <ChevronDown className="h-4 w-4" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(statusLabels).map(([status, label]) => (
          <DropdownMenuItem
            key={status}
            onClick={() =>
              handleStatusChange(status as "pending" | "completed" | "cancelled")
            }
            className="flex items-center gap-2"
          >
            {currentStatus === status && <Check className="h-4 w-4" />}
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
