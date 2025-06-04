import { Button } from "@/core/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TankFormDialog } from "@/features/tanks/components/TankFormDialog";
import { tanksApi, fuelTypesApi } from "@/core/api";

interface SalesControllerProps {
  onSuccess?: () => void;
  className?: string;
  buttonText?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

export function SalesController({
  onSuccess,
  className,
  buttonText = "Add New Sale",
  variant = "default",
  size = "default",
  showIcon = true,
}: SalesControllerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch fuel types
  const { data: fuelTypesData = [] } = useQuery({
    queryKey: ["fuel-types"],
    queryFn: async () => {
      const response = await fuelTypesApi.getFuelTypes();
      return response.data || [];
    },
  });

  // Transform fuel types to match expected format
  const fuelTypes = fuelTypesData.map(ft => ({
    id: ft.id,
    name: (ft as any).name || 'Unknown',
  }));

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className={className}
        variant={variant}
        size={size}
      >
        {showIcon && <Plus className="h-4 w-4 mr-2" />}
        {buttonText}
      </Button>

      <TankFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        fuelTypes={fuelTypes}
        onSuccess={onSuccess}
      />
    </>
  );
}
