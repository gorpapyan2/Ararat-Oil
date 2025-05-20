import { Button } from "@/core/components/ui/primitives/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TankFormDialog } from "./TankFormDialog";
import { tanksService } from "../services/tanksService";

interface TankControllerProps {
  onSuccess?: () => void;
  className?: string;
  buttonText?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

/**
 * TankController - Component for managing tank creation and editing
 * 
 * This component provides a button to trigger the tank creation dialog
 * and handles the display of the TankFormDialog.
 */
export function TankController({
  onSuccess,
  className,
  buttonText = "Add New Tank",
  variant = "default",
  size = "default",
  showIcon = true,
}: TankControllerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch fuel types
  const { data: fuelTypes = [] } = useQuery({
    queryKey: ["fuel-types"],
    queryFn: tanksService.getFuelTypes,
  });

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