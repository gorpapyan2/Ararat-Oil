import { useMemo } from "react";
import { Transaction } from "@/types";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Calendar,
  CreditCard,
  BadgeCheck,
  Eye,
  Edit,
} from "lucide-react";
import { UnifiedDataTable } from "@/components/unified/UnifiedDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onViewDetails?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  isLoading,
  onViewDetails,
  onEdit,
}: TransactionsTableProps) {
  // Define columns for the UnifiedDataTable
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: "created_at",
        header: () => <div className="text-left font-medium">Date</div>,
        accessorKey: "created_at",
        cell: ({ row }) => {
          const date = row.getValue("created_at");
          return (
            <div className="flex items-center gap-2 py-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {date && typeof date === "string"
                  ? format(new Date(date), "PPP")
                  : "N/A"}
              </span>
            </div>
          );
        },
      },
      {
        id: "amount",
        header: () => <div className="text-right font-medium">Amount</div>,
        accessorKey: "amount",
        cell: ({ row }) => {
          const amount = row.getValue("amount");
          const formattedAmount =
            amount !== undefined && amount !== null
              ? Number(amount).toLocaleString()
              : "0";

          return (
            <div className="text-right font-medium tabular-nums">
              <span className="font-semibold text-primary">
                {formattedAmount} ֏
              </span>
            </div>
          );
        },
      },
      {
        id: "payment_method",
        header: () => (
          <div className="text-left font-medium">Payment Method</div>
        ),
        accessorKey: "payment_method",
        cell: ({ row }) => {
          const method = row.getValue("payment_method") as string;
          return (
            <div className="flex items-center gap-2 py-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {method ? method.replace("_", " ").toUpperCase() : "N/A"}
              </span>
            </div>
          );
        },
      },
      {
        id: "payment_status",
        header: () => <div className="text-left font-medium">Status</div>,
        accessorKey: "payment_status",
        cell: ({ row }) => {
          const status = row.getValue("payment_status") as string;

          let badgeVariant = "outline";
          if (status) {
            if (
              status.toLowerCase() === "completed" ||
              status.toLowerCase() === "success"
            ) {
              badgeVariant = "success";
            } else if (status.toLowerCase() === "pending") {
              badgeVariant = "warning";
            } else if (
              status.toLowerCase() === "failed" ||
              status.toLowerCase() === "error"
            ) {
              badgeVariant = "destructive";
            }
          }

          return (
            <div className="flex items-center gap-2 py-2">
              <BadgeCheck className="h-4 w-4 text-muted-foreground" />
              <Badge variant={badgeVariant as any}>
                {status ? status.toUpperCase() : "N/A"}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center font-medium">Actions</div>,
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <div className="flex justify-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => onViewDetails?.(transaction)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(transaction)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Transaction
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onViewDetails, onEdit],
  );

  // Define payment method options for filtering
  const paymentMethods = [
    { id: "cash", name: "Cash" },
    { id: "credit_card", name: "Credit Card" },
    { id: "bank_transfer", name: "Bank Transfer" },
    { id: "mobile_payment", name: "Mobile Payment" },
  ];

  // Define status options for filtering
  const statuses = [
    { id: "completed", name: "Completed" },
    { id: "pending", name: "Pending" },
    { id: "failed", name: "Failed" },
  ];

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <UnifiedDataTable
      title="Transactions"
      columns={columns}
      data={transactions}
      isLoading={isLoading}
      providers={paymentMethods}
      categories={statuses}
      onFiltersChange={() => {}}
      filters={{
        search: "",
        provider: "all",
        category: "all",
        quantityRange: [0, 10000],
        priceRange: [0, 10000],
        totalRange: [0, 10000000],
      }}
      searchColumn="id"
      searchPlaceholder="Search by transaction ID..."
    />
  );
}
