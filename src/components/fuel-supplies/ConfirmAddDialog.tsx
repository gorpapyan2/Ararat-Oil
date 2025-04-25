import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export function ConfirmAddDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  onCancel,
  loading, 
  data 
}: ConfirmAddDialogProps) {
  // Calculate new tank level after the supply
  const newLevel = (data.tankLevel ?? 0) + data.quantity;
  const isOverCapacity = data.tankCapacity ? newLevel > data.tankCapacity : false;
  
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
            <div>{data.providerName || 'N/A'}</div>
            
            <div className="font-medium">Tank:</div>
            <div>{data.tankName || 'N/A'}</div>
            
            <div className="font-medium">Quantity:</div>
            <div>{data.quantity.toLocaleString()} liters</div>
            
            <div className="font-medium">Price per liter:</div>
            <div>{data.price.toLocaleString()} ֏</div>
            
            <div className="font-medium">Total cost:</div>
            <div className="font-semibold">{data.totalCost.toLocaleString()} ֏</div>
          </div>
          
          {data.tankCapacity && (
            <div className={`p-3 rounded-md ${isOverCapacity ? 'bg-destructive/10 text-destructive' : 'bg-primary/10'}`}>
              <p className="font-medium">{isOverCapacity ? 'Warning: Tank Capacity Exceeded' : 'Tank Level Impact'}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                <div>Current level:</div>
                <div>{(data.tankLevel || 0).toLocaleString()} L</div>
                
                <div>After supply:</div>
                <div>{newLevel.toLocaleString()} L</div>
                
                <div>Tank capacity:</div>
                <div>{data.tankCapacity.toLocaleString()} L</div>
                
                {isOverCapacity && (
                  <>
                    <div className="font-medium text-destructive">Excess amount:</div>
                    <div className="font-medium text-destructive">{(newLevel - data.tankCapacity).toLocaleString()} L</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="default" onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : "Confirm Supply"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 