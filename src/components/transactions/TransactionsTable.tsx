
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionsTable({ 
  transactions, 
  isLoading 
}: TransactionsTableProps) {
  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {transaction.created_at 
                ? format(new Date(transaction.created_at), "PPP") 
                : "N/A"}
            </TableCell>
            <TableCell>{transaction.amount.toLocaleString()} ֏</TableCell>
            <TableCell>
              {transaction.payment_method.replace('_', ' ').toUpperCase()}
            </TableCell>
            <TableCell>{transaction.payment_status.toUpperCase()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
