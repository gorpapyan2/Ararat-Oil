import { FillingSystem, deleteFillingSystem } from "@/services/filling-systems";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  EnhancedTable,
  EnhancedHeader,
  EnhancedRow,
  EnhancedCell,
  EnhancedHeaderCell,
  TableBody,
} from "@/components/ui/enhanced-table";

interface FillingSystemListProps {
  fillingSystems: FillingSystem[];
  isLoading: boolean;
  onDelete: () => void;
}

export function FillingSystemList({ fillingSystems, isLoading, onDelete }: FillingSystemListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteFillingSystem(id);
      toast({
        title: "Success",
        description: "Filling system deleted successfully",
      });
      onDelete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete filling system",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <EnhancedTable>
      <EnhancedHeader>
        <EnhancedRow>
          <EnhancedHeaderCell>System Name</EnhancedHeaderCell>
          <EnhancedHeaderCell>Associated Tank</EnhancedHeaderCell>
          <EnhancedHeaderCell className="text-center">Actions</EnhancedHeaderCell>
        </EnhancedRow>
      </EnhancedHeader>
      <TableBody>
        {fillingSystems.map((system) => (
          <EnhancedRow key={system.id}>
            <EnhancedCell>{system.name}</EnhancedCell>
            <EnhancedCell>
              {system.tank ? (
                <span className="flex items-center">
                  {system.tank.name} 
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({system.tank.fuel_type})
                  </span>
                </span>
              ) : 'N/A'}
            </EnhancedCell>
            <EnhancedCell className="text-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(system.id)}
                className="hover:bg-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </EnhancedCell>
          </EnhancedRow>
        ))}
        {fillingSystems.length === 0 && (
          <EnhancedRow>
            <EnhancedCell colSpan={3} className="text-center text-muted-foreground h-32">
              No filling systems found
            </EnhancedCell>
          </EnhancedRow>
        )}
      </TableBody>
    </EnhancedTable>
  );
}
