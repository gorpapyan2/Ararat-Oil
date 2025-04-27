import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmAddTankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  data: {
    name: string;
    fuelType: string;
    capacity: number;
  };
}

export function ConfirmAddTankDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  loading,
  data,
}: ConfirmAddTankDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm New Tank</DialogTitle>
        </DialogHeader>
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

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={loading}>
            {loading ? "Creating..." : "Create Tank"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
