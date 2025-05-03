import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "@/services/transactions";
import { PaymentMethod, PaymentStatus } from "@/types";
import { useToast } from "@/hooks";

interface CreateTransactionParams {
  amount: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  sale_id?: string;
  employee_id: string;
  description?: string; // Added for better invoice details
  entity_type?: "sale" | "expense" | "fuel_supply"; // To track transaction source
  entity_id?: string; // Generic ID for the source entity
}

export function useTransactionCreation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateTransactionParams) => {
      return await createTransaction({
        ...params,
        payment_status: "completed" as PaymentStatus,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });

      // Refresh transactions data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      });
      console.error("Transaction creation error:", error);
    },
  });
}
