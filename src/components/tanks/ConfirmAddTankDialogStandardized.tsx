import { ConfirmDialog } from "@/components/ui/dialog";
import { TankFormData } from "@/hooks/useTankDialog";

interface ConfirmAddTankDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  data: TankFormData | null;
}

export function ConfirmAddTankDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isLoading = false,
  data,
}: ConfirmAddTankDialogStandardizedProps) {
  if (!data) return null;
  
  const formattedFuelType = data.fuel_type === "cng" 
    ? "CNG" 
    : data.fuel_type === "petrol" 
      ? "Petrol" 
      : "Diesel";
      
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Confirm New Tank"
      description={
        <div className="space-y-4">
          <p>Please confirm the details for the new fuel tank:</p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="font-medium">Tank Name:</div>
            <div>{data.name}</div>

            <div className="font-medium">Fuel Type:</div>
            <div>{formattedFuelType}</div>

            <div className="font-medium">Capacity:</div>
            <div>{data.capacity.toLocaleString()} liters</div>
            
            {data.current_level > 0 && (
              <>
                <div className="font-medium">Current Level:</div>
                <div>{data.current_level.toLocaleString()} liters</div>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            After creating this tank, you can associate it with filling systems
            and add fuel supplies to it.
          </p>
        </div>
      }
      confirmLabel={isLoading ? "Creating..." : "Create Tank"}
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
} 