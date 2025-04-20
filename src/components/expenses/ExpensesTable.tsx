
import { Expense } from "@/types";
import { Pencil, Trash2, FileText, DollarSign, CreditCard, Calendar as CalendarIcon } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ExpensesTableProps {
  expenses: Expense[];
  categories: string[];
  loading?: boolean;
  onEdit: (expense: Expense) => void;
}

export function ExpensesTable({ expenses, loading, onEdit }: ExpensesTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><CalendarIcon className="inline mr-1" size={16}/> Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead><DollarSign className="inline mr-1" size={16}/> Amount (֏)</TableHead>
            <TableHead><CreditCard className="inline mr-1" size={16}/> Payment</TableHead>
            <TableHead>Invoice#</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          ) : expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No expenses found.
              </TableCell>
            </TableRow>
          ) : (
            expenses.map(exp => (
              <TableRow key={exp.id}>
                <TableCell>{exp.date ? new Date(exp.date).toLocaleDateString() : ""}</TableCell>
                <TableCell>{exp.category}</TableCell>
                <TableCell>{exp.description}</TableCell>
                <TableCell>
                  {Number(exp.amount).toLocaleString()} ֏
                </TableCell>
                <TableCell>{exp.payment_method || ""}</TableCell>
                <TableCell>{exp.invoice_number || ""}</TableCell>
                <TableCell>{exp.notes || ""}</TableCell>
                <TableCell className="text-center flex gap-2 justify-center">
                  <Button variant="outline" size="icon" onClick={() => onEdit(exp)}>
                    <Pencil size={16} />
                  </Button>
                  {/* <Button variant="destructive" size="icon"><Trash2 size={16}/></Button> */}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
