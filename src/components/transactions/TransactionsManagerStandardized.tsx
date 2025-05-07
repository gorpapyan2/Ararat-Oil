import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/services/transactions";
import { Transaction } from "@/types";
import { TransactionListStandardized } from "./TransactionListStandardized";
import { TransactionHeader } from "./TransactionHeader";
import { TransactionDialogStandardized } from "./TransactionDialogStandardized";
import { useToast } from "@/hooks";

export function TransactionsManagerStandardized() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<
    Transaction | null
  >(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      setIsDeleteDialogOpen(false); // Close the dialog on success
      setTransactionToDelete(null); // Clear the transaction to delete
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  const handleCreate = async (transactionData: Omit<Transaction, "id">) => {
    await createMutation.mutateAsync(transactionData);
  };

  const handleUpdate = async (
    id: string,
    transactionData: Omit<Transaction, "id">,
  ) => {
    await updateMutation.mutateAsync({ id, ...transactionData });
  };

  // Convert the transaction parameter to string ID
  const handleDelete = (transaction: Transaction | string) => {
    const id = typeof transaction === 'string' ? transaction : transaction.id;
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await deleteMutation.mutateAsync(transactionToDelete);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setTransactionToEdit(null);
  };

  return (
    <div className="space-y-6">
      <TransactionHeader onCreate={() => {}} />
      <TransactionListStandardized
        transactions={transactions || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TransactionDialogStandardized
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        transaction={transactionToEdit}
        onSubmit={handleUpdate}
        onClose={closeEditDialog}
      />
    </div>
  );
}
