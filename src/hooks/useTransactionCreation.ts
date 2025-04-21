
import { useMutation } from "@tanstack/react-query";
import { createTransaction } from "@/services/transactions";
import { PaymentMethod, PaymentStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CreateTransactionParams {
  amount: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  sale_id?: string;
  employee_id: string;
}

export function useTransactionCreation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: CreateTransactionParams) => {
      return await createTransaction({
        ...params,
        payment_status: 'completed' as PaymentStatus,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });
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
