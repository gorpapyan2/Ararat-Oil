import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SalesHeader } from "./SalesHeader";
import { SalesTable } from "./SalesTable";
import { fetchSales, deleteSale, updateSale } from "@/services/sales";
import { Sale } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SalesForm } from "./SalesForm";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { fetchFillingSystems } from "@/services/filling-systems";

export function SalesManager() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [systemId, setSystemId] = useState<string>("");
  const [litersRange, setLitersRange] = useState<[number, number]>([0, 0]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [totalSalesRange, setTotalSalesRange] = useState<[number, number]>([0, 0]);

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sales, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });
  const { data: systems = [] } = useQuery({
    queryKey: ["filling-systems"],
    queryFn: async () => {
      const systemsData = await fetchFillingSystems();
      return systemsData.map(sys => ({ id: sys.id, name: sys.name }));
    }
  });

  const filteredSales = useMemo(() => {
    let filtered = sales || [];
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((sale) =>
        sale.filling_system_name?.toLowerCase().includes(lower) ||
        sale.fuel_type?.toLowerCase().includes(lower) ||
        sale.date?.toString().includes(lower)
      );
    }
    if (date) {
      const filterDate = date.toISOString().slice(0,10);
      filtered = filtered.filter(sale => sale.date?.slice(0,10) === filterDate);
    }
    if (systemId && systemId !== "all") {
      filtered = filtered.filter(sale => sale.filling_system_id === systemId);
    }
    const [litMin, litMax] = litersRange;
    if (litMin > 0 || litMax > 0) {
      filtered = filtered.filter(sale => {
        const q = sale.quantity;
        return (litMin === 0 || q >= litMin) && (litMax === 0 || q <= litMax);
      });
    }
    const [priceMin, priceMax] = priceRange;
    if (priceMin > 0 || priceMax > 0) {
      filtered = filtered.filter(sale => {
        const p = sale.price_per_unit;
        return (priceMin === 0 || p >= priceMin) && (priceMax === 0 || p <= priceMax);
      });
    }
    const [tsMin, tsMax] = totalSalesRange;
    if (tsMin > 0 || tsMax > 0) {
      filtered = filtered.filter(sale => {
        const t = sale.total_sales;
        return (tsMin === 0 || t >= tsMin) && (tsMax === 0 || t <= tsMax);
      });
    }
    return filtered;
  }, [sales, search, date, systemId, litersRange, priceRange, totalSalesRange]);

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

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSaleToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (saleToDelete) {
      deleteMutation.mutate(saleToDelete);
    }
  };

  const handleView = (sale: Sale) => {
    console.log("Viewing sale:", sale);
  };

  return (
    <div className="space-y-6">
      <SalesHeader 
        search={search}
        onSearchChange={setSearch}
        date={date}
        onDateChange={setDate}
        systemId={systemId}
        onSystemChange={setSystemId}
        systems={systems}
        litersRange={litersRange}
        onLitersRangeChange={setLitersRange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        totalSalesRange={totalSalesRange}
        onTotalSalesRangeChange={setTotalSalesRange}
      />
      
      <SalesTable 
        sales={filteredSales}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the sale record and restore the fuel to the tank.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
