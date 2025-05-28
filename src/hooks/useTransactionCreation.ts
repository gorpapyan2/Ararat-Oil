import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi, Transaction } from "@/core/api";
import { PaymentMethod } from "@/types";
import { useToast } from "./use-toast";

interface CreateTransactionParams {
  amount: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  sale_id?: string;
  employee_id: string;
  description: string; // Required for transaction details
  entity_type: "sale" | "expense" | "fuel_supply"; // Required to track transaction source
  entity_id: string; // Required ID for the source entity
  type: "expense" | "income"; // Must match the expected transaction types
  created_by: string; // Required for audit trail
}

export function useTransactionCreation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateTransactionParams) => {
      return await transactionsApi.createTransaction({
        ...params,
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
