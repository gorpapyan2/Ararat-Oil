import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { TankFormData } from "@/hooks/useTankDialog";

interface ConfirmAddTankDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  data: {
    name: string;
    fuelType: string;
    capacity: number;
  };
}

export function ConfirmAddTankDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isLoading,
  data,
}: ConfirmAddTankDialogStandardizedProps) {
  // Create dialog actions
  const actions = (
    <div className="flex gap-2 justify-end">
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button variant="default" onClick={onConfirm} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Tank"}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Confirm New Tank"
      actions={actions}
    >
      <div className="space-y-4">
        <p>Please confirm the details for the new fuel tank:</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="font-medium">Tank Name:</div>
          <div>{data.name}</div>

          <div className="font-medium">Fuel Type:</div>
          <div>{data.fuelType}</div>

          <div className="font-medium">Capacity:</div>
          <div>{data.capacity.toLocaleString()} liters</div>
        </div>

        <p className="text-sm text-muted-foreground">
          After creating this tank, you can associate it with filling systems
          and add fuel supplies to it.
        </p>
      </div>
    </StandardDialog>
  );
} 