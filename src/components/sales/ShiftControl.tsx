import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShiftControlProps {
  onShiftStart: () => void;
  onShiftEnd: () => void;
  isShiftOpen: boolean;
}

export function ShiftControl({ onShiftStart, onShiftEnd, isShiftOpen }: ShiftControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {isShiftOpen ? "Close Shift" : "Open Shift"}
        </Button>
      </DialogTrigger>
      <DialogContent title="Open Shift" className="sm:max-w-[425px]">
        <div className="flex flex-col space-y-4">
          <p>Are you sure you want to {isShiftOpen ? "close" : "open"} the shift?</p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
