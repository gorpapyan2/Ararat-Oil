import { useState, useEffect } from "react";
import { StandardDialog } from "@/core/components/ui/composed/dialog";
import { Button } from "@/core/components/ui/button";

interface ShiftControlProps {
  onShiftStart: () => void;
  onShiftEnd: () => void;
  isShiftOpen: boolean;
}

export function ShiftControl({ onShiftStart, onShiftEnd, isShiftOpen }: ShiftControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Add console log to debug component props
  useEffect(() => {
    console.log("ShiftControl component props:", { isShiftOpen, dialogOpen: isOpen });
  }, [isShiftOpen, isOpen]);

  return (
    <div>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        {isShiftOpen ? "Close Shift" : "Open Shift"}
      </Button>
      
      <StandardDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={isShiftOpen ? "Close Shift" : "Open Shift"}
        actions={
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsOpen(false);
              if (isShiftOpen) {
                onShiftEnd();
              } else {
                onShiftStart();
              }
            }}>
              {isShiftOpen ? "Close Shift" : "Open Shift"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col space-y-4">
          <p>Are you sure you want to {isShiftOpen ? "close" : "open"} the shift?</p>
        </div>
      </StandardDialog>
    </div>
  );
} 