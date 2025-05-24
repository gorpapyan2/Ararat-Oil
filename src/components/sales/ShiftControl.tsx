
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShiftControlProps {
  onShiftStart?: () => void;
  onShiftEnd?: () => void;
  isShiftOpen?: boolean;
}

export function ShiftControl({ onShiftStart, onShiftEnd, isShiftOpen = false }: ShiftControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        {isShiftOpen ? "Close Shift" : "Open Shift"}
      </Button>
      <DialogContent 
        className="sm:max-w-[425px]" 
        title={isShiftOpen ? "Close Shift" : "Open Shift"}
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-semibold">
            {isShiftOpen ? "Close Shift" : "Open Shift"}
          </h2>
          <p>Are you sure you want to {isShiftOpen ? "close" : "open"} the shift?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsOpen(false);
              if (isShiftOpen) {
                onShiftEnd?.();
              } else {
                onShiftStart?.();
              }
            }}>
              {isShiftOpen ? "Close Shift" : "Open Shift"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
