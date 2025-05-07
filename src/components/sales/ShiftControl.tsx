
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ShiftControl() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
        Open Shift Control
      </Button>
      
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Shift Control</DialogTitle>
            <DialogDescription>
              Manage shift start and end times here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Add your shift control form or content here */}
            <p>Shift control content goes here.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
