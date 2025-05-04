import { Transaction } from "@/types";
import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TransactionsDialogsStandardizedProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionsDialogsStandardized({
  transaction,
  open,
  onOpenChange,
}: TransactionsDialogsStandardizedProps) {
  // Helper function to get badge variant based on status
  const getStatusVariant = (status: string | undefined) => {
    if (!status) return "outline";

    if (
      status.toLowerCase() === "completed" ||
      status.toLowerCase() === "success"
    ) {
      return "success";
    } else if (status.toLowerCase() === "pending") {
      return "warning";
    } else if (
      status.toLowerCase() === "failed" ||
      status.toLowerCase() === "error"
    ) {
      return "destructive";
    }
    return "outline";
  };

  // Create dialog footer actions
  const actions = (
    <Button onClick={() => onOpenChange(false)}>Close</Button>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Transaction Details"
      description={transaction ? `Transaction ID: ${transaction.id}` : ""}
      actions={actions}
      maxWidth="sm:max-w-md"
    >
      {transaction && (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Date
              </p>
              <p className="text-sm font-semibold">
                {transaction.created_at
                  ? format(new Date(transaction.created_at), "PPP")
                  : "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Amount
              </p>
              <p className="text-sm font-semibold">
                {transaction.amount?.toLocaleString() || "0"} ֏
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Payment Method
              </p>
              <p className="text-sm font-semibold">
                {transaction.payment_method
                  ?.replace("_", " ")
                  .toUpperCase() || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge
                variant={getStatusVariant(transaction.payment_status) as any}
              >
                {transaction.payment_status?.toUpperCase() || "N/A"}
              </Badge>
            </div>
          </div>

          {transaction.description && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="text-sm">{transaction.description}</p>
            </div>
          )}
        </div>
      )}
    </StandardDialog>
  );
} 