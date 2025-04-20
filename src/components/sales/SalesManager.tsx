
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SalesHeader } from "./SalesHeader";
import { SalesTable } from "./SalesTable";
import { fetchSales, deleteSale, updateSale } from "@/services/sales";
import { Sale } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SalesForm } from "./SalesForm";

export function SalesManager() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sales, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast({
        title: "Success",
        description: "Sale deleted successfully",
      });
    },
    onError: () => {
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
      toast({
        title: "Success",
        description: "Sale updated successfully",
      });
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update sale",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleView = (sale: Sale) => {
    // Implement view functionality if needed
    console.log("Viewing sale:", sale);
  };

  return (
    <div className="space-y-6">
      <SalesHeader 
        selectedDate={selectedDate}
        onDateChange={(date) => date && setSelectedDate(date)}
      />
      
      <SalesTable 
        sales={sales || []} 
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <SalesForm 
            sale={selectedSale}
            onSubmit={(data) => {
              if (selectedSale) {
                updateMutation.mutate({
                  id: selectedSale.id,
                  ...data
                });
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
