
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSale, updateSale } from "@/services/sales";
import { useToast } from "@/hooks/use-toast";
import { Sale } from "@/types";

export function useSalesMutations() {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });

      toast({
        title: "Success",
        description: "Sale deleted successfully and tank level restored",
      });
      setIsDeleteDialogOpen(false);
      setSaleToDelete(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete sale",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      queryClient.invalidateQueries({ queryKey: ["latest-sale"] });

      toast({
        title: "Success",
        description: "Sale updated successfully and tank level adjusted",
      });
      setIsEditDialogOpen(false);
      setSelectedSale(null);
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update sale",
        variant: "destructive",
      });
    },
  });

  // Clean up state when dialog is closed
  const setIsEditDialogOpenWrapper = useCallback((isOpen: boolean) => {
    setIsEditDialogOpen(isOpen);
    if (!isOpen) {
      setSelectedSale(null);
    }
  }, []);

  const setIsDeleteDialogOpenWrapper = useCallback((isOpen: boolean) => {
    setIsDeleteDialogOpen(isOpen);
    if (!isOpen) {
      setSaleToDelete(null);
    }
  }, []);

  // handlers
  const handleEdit = useCallback((sale: Sale) => {
    setSelectedSale(sale);
    setIsEditDialogOpen(true);
  }, []);
  
  const handleDelete = useCallback((id: string) => {
    setSaleToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);
  
  const confirmDelete = useCallback(() => {
    if (saleToDelete) {
      deleteMutation.mutate(saleToDelete);
    }
  }, [saleToDelete, deleteMutation]);

  return {
    selectedSale,
    setSelectedSale,
    isEditDialogOpen,
    setIsEditDialogOpen: setIsEditDialogOpenWrapper,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen: setIsDeleteDialogOpenWrapper,
    saleToDelete,
    setSaleToDelete,
    deleteMutation,
    updateMutation,
    handleEdit,
    handleDelete,
    confirmDelete,
  };
}
