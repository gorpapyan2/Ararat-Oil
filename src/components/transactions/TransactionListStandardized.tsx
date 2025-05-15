import { Transaction } from "@/core/api";
import { StandardizedDataTable } from "@/components/unified/StandardizedDataTable";
import { formatDate, formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

interface TransactionListStandardizedProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionListStandardized({
  transactions,
  isLoading,
  onEdit,
  onDelete
}: TransactionListStandardizedProps) {
  // Define columns for the data table
  const columns = [
    {
      header: "ID",
      accessorKey: "id" as keyof Transaction,
      cell: (value: string) => <span className="font-mono text-xs">{value.substring(0, 8)}...</span>,
    },
    {
      header: "Date",
      accessorKey: "created_at" as keyof Transaction,
      cell: (value: string) => formatDate(value),
    },
    {
      header: "Amount",
      accessorKey: "amount" as keyof Transaction,
      cell: (value: number) => formatCurrency(value),
    },
    {
      header: "Payment Method",
      accessorKey: "payment_method" as keyof Transaction,
      cell: (value: string) => (
        <span className="capitalize">{value.replace('_', ' ')}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "payment_status" as keyof Transaction,
      cell: (value: string) => {
        const variantMap: Record<string, any> = {
          pending: "warning",
          completed: "success",
          failed: "destructive",
          refunded: "outline",
        };
        
        return (
          <Badge variant={variantMap[value] || "default"} className="capitalize">
            {value}
          </Badge>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description" as keyof Transaction,
      cell: (value: string) => <span className="truncate max-w-[200px]">{value || "N/A"}</span>,
    }
  ];

  return (
    <StandardizedDataTable
      columns={columns}
      data={transactions}
      loading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      exportOptions={{
        enabled: true,
        filename: "transactions-export"
      }}
    />
  );
}
