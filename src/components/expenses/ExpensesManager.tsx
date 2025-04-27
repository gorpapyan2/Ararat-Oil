import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenses } from "@/services/expenses";
import { Expense } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpensesForm } from "./ExpensesForm";
import { CategoryManager } from "./CategoryManager";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  DollarSign,
  CreditCard,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { UnifiedDataTable } from "@/components/unified/UnifiedDataTable";
import { MetricCard } from "@/components/ui-custom/data-card";

const DEFAULT_CATEGORIES = [
  "Rent",
  "Utilities",
  "Salaries",
  "Maintenance",
  "Supplies",
  "Marketing",
  "Insurance",
  "Taxes",
  "Travel",
  "Fuel",
  "Other",
];

export function ExpensesManager() {
  // State for add/edit form and category manager
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryMgrOpen, setCategoryMgrOpen] = useState(false);

  // Categories (stub: in memory, replace with backend persistence as needed)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Unified filters state
  const [filters, setFilters] = useState({
    search: "",
    date: undefined,
    dateRange: [undefined, undefined] as [Date | undefined, Date | undefined],
    provider: "all",
    expenseCategory: "all",
    paymentMethod: "all",
    paymentStatus: "all",
    quantityRange: [0, 1000000] as [number, number],
    priceRange: [0, 10000] as [number, number],
    totalRange: [0, 10000000] as [number, number],
  });

  // Fetch expenses data
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  // TODO: Add create/update/deleteExpense mutations here

  const handleAdd = () => {
    setSelectedExpense(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  };

  // Categories
  const onAddCategory = (name: string) => {
    if (!categories.includes(name)) setCategories([...categories, name]);
  };

  const onDeleteCategory = (name: string) => {
    setCategories(categories.filter((c) => c !== name));
  };

  // Handle filter changes
  const handleFiltersChange = (updates: any) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  // Create category options for filter
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      id: category,
      name: category,
    }));
  }, [categories]);

  // Calculate summary metrics
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const largestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => expense.amount))
      : 0;

  // Define table columns
  const columns: ColumnDef<Expense, any>[] = [
    {
      accessorKey: "date",
      header: () => (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => format(new Date(row.getValue("date")), "MMM dd, yyyy"),
    },
    {
      accessorKey: "category",
      header: () => "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("category")}
        </Badge>
      ),
    },
    {
      accessorKey: "description",
      header: () => "Description",
      cell: ({ row }) => row.getValue("description"),
    },
    {
      accessorKey: "amount",
      header: () => (
        <div className="flex items-center">
          <DollarSign className="mr-2 h-4 w-4" />
          <span>Amount (֏)</span>
        </div>
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {Number(row.getValue("amount")).toLocaleString()} ֏
        </span>
      ),
    },
    {
      accessorKey: "payment_method",
      header: () => (
        <div className="flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Payment</span>
        </div>
      ),
      cell: ({ row }) => row.getValue("payment_method") || "-",
    },
    {
      accessorKey: "invoice_number",
      header: () => "Invoice#",
      cell: ({ row }) => row.getValue("invoice_number") || "-",
    },
    {
      accessorKey: "notes",
      header: () => "Notes",
      cell: ({ row }) => row.getValue("notes") || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(expense);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Summary component
  const ExpensesSummaryComponent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricCard
        title="Total Expenses"
        value={`${totalExpenses.toLocaleString()} ֏`}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <MetricCard
        title="Average Expense"
        value={`${avgExpense.toLocaleString()} ֏`}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <MetricCard
        title="Largest Expense"
        value={`${largestExpense.toLocaleString()} ֏`}
        icon={<DollarSign className="h-4 w-4" />}
      />
    </div>
  );

  // Category breakdown component
  const CategoryBreakdownComponent = (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Category Breakdown</CardTitle>
      </CardHeader>
      <div className="p-4">
        <div className="flex flex-col space-y-2">
          {Object.entries(
            expenses.reduce(
              (acc, expense) => {
                const category = expense.category || "Other";
                acc[category] = (acc[category] || 0) + expense.amount;
                return acc;
              },
              {} as Record<string, number>,
            ),
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm capitalize">{category}</span>
                <span className="text-sm font-semibold">
                  {amount.toLocaleString()} ֏
                </span>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Expense Management</CardTitle>
              <CardDescription>
                Track, add, or organize your business expenses
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCategoryMgrOpen(true)}
              >
                Manage Categories
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-primary hover:bg-primary/90 animate-fade-in text-neutral-950"
              >
                <Plus className="mr-2" /> New Expense
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Expenses Data Table with Unified Components */}
      <UnifiedDataTable
        title="Expenses"
        columns={columns}
        data={expenses}
        isLoading={isLoading}
        onEdit={handleEdit}
        providers={[]}
        categories={categoryOptions}
        onFiltersChange={handleFiltersChange}
        filters={filters}
        searchColumn="description"
        searchPlaceholder="Search expenses..."
        summaryComponent={
          <>
            {ExpensesSummaryComponent}
            {CategoryBreakdownComponent}
          </>
        }
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedExpense ? "Edit Expense" : "Add Expense"}
            </DialogTitle>
          </DialogHeader>
          <ExpensesForm
            categories={categories}
            expense={selectedExpense}
            onSubmit={() => {
              setIsDialogOpen(false);
              // after mutation, invalidate and refetch
              queryClient.invalidateQueries({
                queryKey: ["expenses"],
              });
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <CategoryManager
        categories={categories}
        onAdd={onAddCategory}
        onDelete={onDeleteCategory}
        open={categoryMgrOpen}
        setOpen={setCategoryMgrOpen}
      />
    </div>
  );
}
