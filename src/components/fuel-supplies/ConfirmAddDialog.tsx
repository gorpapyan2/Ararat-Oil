import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FuelTank } from "@/types";

interface ConfirmAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  data: {
    quantity: number;
    price: number;
    totalCost: number;
    providerName?: string;
    tankName?: string;
    tankCapacity?: number;
    tankLevel?: number;
  };
}

// Helper function to safely format numbers
const formatNumber = (value: any, decimals = 1): string => {
  if (value === undefined || value === null) return "0";
  const num = Number(value);
  if (isNaN(num)) return "0";

  const formattedValue = num.toFixed(decimals);
  return Number(formattedValue).toLocaleString();
};

export function ConfirmAddDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  loading,
  data,
}: ConfirmAddDialogProps) {
  // Calculate new tank level after the supply
  const tankLevel = Number(data.tankLevel ?? 0);
  const quantity = Number(data.quantity ?? 0);
  const price = Number(data.price ?? 0);
  const totalCost = Number(data.totalCost ?? 0);
  const capacity = Number(data.tankCapacity ?? 0);

  const newLevel = tankLevel + quantity;
  const percentFill = capacity > 0 ? (newLevel / capacity) * 100 : 0;
  const isOverCapacity = capacity > 0 && newLevel > capacity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Fuel Supply</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Please confirm the following fuel supply details:</p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="font-medium">Provider:</div>
            <div>{data.providerName || "N/A"}</div>

            <div className="font-medium">Tank:</div>
            <div>{data.tankName || "N/A"}</div>

            <div className="font-medium">Quantity:</div>
            <div>{formatNumber(quantity)} liters</div>

            <div className="font-medium">Price per liter:</div>
            <div>{formatNumber(price, 0)} ֏</div>

            <div className="font-medium">Total cost:</div>
            <div className="font-semibold">{formatNumber(totalCost, 0)} ֏</div>
          </div>

          {capacity > 0 && (
            <div
              className={`p-3 rounded-md ${isOverCapacity ? "bg-destructive/10 text-destructive" : "bg-primary/10"}`}
            >
              <p className="font-medium">
                {isOverCapacity
                  ? "Warning: Tank Capacity Exceeded"
                  : "Tank Level Impact"}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                <div>Current level:</div>
                <div>{formatNumber(tankLevel)} L</div>

                <div>After supply:</div>
                <div>
                  {formatNumber(newLevel)} L ({formatNumber(percentFill, 1)}% of
                  capacity)
                </div>

                <div>Tank capacity:</div>
                <div>{formatNumber(capacity)} L</div>

                {isOverCapacity && (
                  <>
                    <div className="font-medium text-destructive">
                      Excess amount:
                    </div>
                    <div className="font-medium text-destructive">
                      {formatNumber(newLevel - capacity)} L
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : "Confirm Supply"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
