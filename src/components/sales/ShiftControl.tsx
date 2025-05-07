import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ShiftControl() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <DialogTrigger asChild>
        <Button variant="outline">Open Shift Control</Button>
      </DialogTrigger>
      
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Shift Control" // Add missing title prop
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
