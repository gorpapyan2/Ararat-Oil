import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ConfirmAddDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
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

export function ConfirmAddDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isLoading,
  data,
}: ConfirmAddDialogStandardizedProps) {
  // Add null check to ensure data is not null before accessing properties
  if (!data) {
    data = {
      quantity: 0,
      price: 0,
      totalCost: 0,
      tankLevel: 0,
      tankCapacity: 0
    };
  }
  
  // Calculate new tank level after the supply
  const tankLevel = Number(data.tankLevel ?? 0);
  const quantity = Number(data.quantity ?? 0);
  const price = Number(data.price ?? 0);
  const totalCost = Number(data.totalCost ?? 0);
  const capacity = Number(data.tankCapacity ?? 0);

  const newLevel = tankLevel + quantity;
  const percentFill = capacity > 0 ? (newLevel / capacity) * 100 : 0;
  const isOverCapacity = capacity > 0 && newLevel > capacity;

  const { t } = useTranslation();

  // Create dialog actions
  const actions = (
    <div className="flex gap-2 justify-end">
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button variant="default" onClick={onConfirm} disabled={isLoading}>
        {isLoading ? "Processing..." : "Confirm Supply"}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Confirm Fuel Supply"
      actions={actions}
    >
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

          <div className="font-medium">{t("common.totalCost")}:</div>
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
    </StandardDialog>
  );
} 