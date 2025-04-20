
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SalesForm } from "./SalesForm";
import { useState } from "react";

interface SalesHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function SalesHeader({ selectedDate, onDateChange }: SalesHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    // TODO: Implement sale creation
    console.log('New sale:', data);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
        <p className="text-muted-foreground">
          View and manage fuel sales
        </p>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>New Sale</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <SalesForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
