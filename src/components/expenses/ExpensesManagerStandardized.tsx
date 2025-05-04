import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenses } from "@/services/expenses";
import { Expense } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks";
import { StandardDialog } from "@/components/ui/dialog";
import { ExpensesFormStandardized } from "./ExpensesFormStandardized";
import { CategoryManagerStandardized } from "./CategoryManagerStandardized";
import { ExpensesTable } from "./ExpensesTable";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Plus,
  DollarSign,
} from "lucide-react";
import { MetricCard } from "@/components/ui/composed/cards";
import { useDialog } from "@/hooks/useDialog";

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

const DEFAULT_PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "Credit Card",
  "Check",
  "Mobile Payment",
];

export function ExpensesManagerStandardized() {
  // State for add/edit form and category manager
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  
  // Use dialog hooks for state management
  const expenseDialog = useDialog();
  const categoryDialog = useDialog();

  // Categories (stub: in memory, replace with backend persistence as needed)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [paymentMethods] = useState(DEFAULT_PAYMENT_METHODS);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Unified filters state
  const [filters, setFilters] = useState({
    search: "",
    date: undefined,
    dateRange: [undefined, undefined] as [Date | undefined, Date | undefined],
    category: "all",
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

  const handleAdd = useCallback(() => {
    setSelectedExpense(null);
    expenseDialog.open();
  }, [expenseDialog]);

  const handleEdit = useCallback((id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setSelectedExpense(expense);
      expenseDialog.open();
    }
  }, [expenses, expenseDialog]);

  const handleDelete = useCallback((id: string) => {
    // TODO: Implement delete functionality
    console.log("Delete expense with ID:", id);
  }, []);

  const handleFiltersChange = useCallback((updates: any) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const onAddCategory = useCallback((name: string) => {
    if (!categories.includes(name)) setCategories([...categories, name]);
  }, [categories]);

  const onDeleteCategory = useCallback((name: string) => {
    setCategories(categories.filter((c) => c !== name));
  }, [categories]);

  // Create category options for filter
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      id: category,
      name: category,
    }));
  }, [categories]);

  // Create payment method options for filter
  const paymentMethodOptions = useMemo(() => {
    return paymentMethods.map((method) => ({
      id: method,
      name: method,
    }));
  }, [paymentMethods]);

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
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={handleAdd}
            className="shadow-sm"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={categoryDialog.open}
          >
            Manage Categories
          </Button>
        </div>
      </div>

      {/* Summary and Category Breakdown */}
      {ExpensesSummaryComponent}
      {CategoryBreakdownComponent}

      {/* Expenses Table */}
      <ExpensesTable
        expenses={expenses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        categories={categoryOptions}
        paymentMethods={paymentMethodOptions}
        onFiltersChange={handleFiltersChange}
      />

      {/* Add/Edit Expense Dialog - Standardized */}
      <StandardDialog
        open={expenseDialog.isOpen}
        onOpenChange={expenseDialog.onOpenChange}
        title={selectedExpense ? "Edit Expense" : "Add New Expense"}
        description={selectedExpense 
          ? "Update the details of this expense record."
          : "Enter details to add a new expense record."}
        maxWidth="sm:max-w-[600px]"
      >
        <ExpensesFormStandardized
          expense={selectedExpense}
          onCancel={expenseDialog.close}
          onSubmit={(formData) => {
            console.log("Form submitted:", formData);
            // TODO: Submit to API
            expenseDialog.close();
          }}
          categories={categories}
        />
      </StandardDialog>

      {/* Category Manager Dialog */}
      <CategoryManagerStandardized
        open={categoryDialog.isOpen}
        onOpenChange={categoryDialog.onOpenChange}
        categories={categories}
        onAdd={onAddCategory}
        onDelete={onDeleteCategory}
      />
    </div>
  );
} 