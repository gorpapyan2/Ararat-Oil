
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/primitives/badge";
import { Input } from "@/core/components/ui/primitives/input";
import { Skeleton } from "@/core/components/ui/primitives/skeleton";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { fillingSystemsApi } from "@/core/api/endpoints/filling-systems";
import { tanksApi } from "@/core/api/endpoints/tanks";
import { FillingSystemFormStandardized } from "./FillingSystemFormStandardized";
import type { FillingSystem, Tank } from "@/core/api/types";

export function FillingSystemList() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<FillingSystem | null>(null);

  // Fetch filling systems
  const {
    data: fillingSystems = [],
    isLoading: isLoadingSystems,
    refetch: refetchSystems,
  } = useQuery({
    queryKey: ["filling-systems"],
    queryFn: async () => {
      const response = await fillingSystemsApi.getFillingSystems();
      return response.data || [];
    },
  });

  // Fetch tanks for reference
  const { data: tanks = [] } = useQuery({
    queryKey: ["tanks"],
    queryFn: async () => {
      const response = await tanksApi.getTanks();
      return response.data || [];
    },
  });

  // Filter systems based on search term
  const filteredSystems = fillingSystems.filter((system: FillingSystem) =>
    system.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await fillingSystemsApi.deleteFillingSystem(id);
      toast({
        title: "Success",
        description: "Filling system deleted successfully",
      });
      refetchSystems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete filling system",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (system: FillingSystem) => {
    setEditingSystem(system);
  };

  const handleSuccess = () => {
    refetchSystems();
    setIsCreateDialogOpen(false);
    setEditingSystem(null);
  };

  const getTankInfo = (tankId: string) => {
    const tank = tanks.find((t: Tank) => t.id === tankId);
    return tank || { name: "Unknown", fuel_type: "Unknown" };
  };

  if (isLoadingSystems) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Filling Systems</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add System
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search filling systems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSystems.map((system: FillingSystem) => {
          const tankInfo = getTankInfo(system.tank_id || "");
          
          return (
            <Card key={system.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{system.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(system)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(system.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tank:</span>
                    <Badge variant="secondary">{tankInfo.name}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fuel Type:</span>
                    <Badge variant="outline">{String(tankInfo.fuel_type || "Unknown")}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="text-sm">{new Date(system.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSystems.length === 0 && !isLoadingSystems && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No filling systems found</p>
        </div>
      )}

      <FillingSystemFormStandardized
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleSuccess}
      />

      {editingSystem && (
        <FillingSystemFormStandardized
          open={!!editingSystem}
          onOpenChange={() => setEditingSystem(null)}
          fillingSystem={editingSystem}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
