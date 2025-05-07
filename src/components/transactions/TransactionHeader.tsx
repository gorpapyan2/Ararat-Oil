
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StandardDialog } from "@/components/ui/composed/dialog";
import { useToast } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@/types";

interface TransactionHeaderProps {
  onCreate: () => void;
}

export function TransactionHeader({ onCreate }: TransactionHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Transactions</h2>
        <p className="text-sm text-muted-foreground">
          Manage all financial transactions
        </p>
      </div>
      <Button onClick={onCreate} className="flex items-center gap-1">
        <Plus className="h-4 w-4" />
        New Transaction
      </Button>
    </div>
  );
}
