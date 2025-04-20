
import { FillingSystem, deleteFillingSystem } from "@/services/filling-systems";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>System Name</TableHead>
          <TableHead>Associated Tank</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fillingSystems.map((system) => (
          <TableRow key={system.id}>
            <TableCell>{system.name}</TableCell>
            <TableCell>{system.tank?.name || 'N/A'}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(system.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
