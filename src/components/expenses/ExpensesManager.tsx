
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenses } from "@/services/expenses";
import { Expense } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExpensesTable } from "./ExpensesTable";
import { ExpensesForm } from "./ExpensesForm";
import { CategoryManager } from "./CategoryManager";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";

const DEFAULT_CATEGORIES = [
  "Rent", "Utilities", "Salaries", "Maintenance", "Supplies", "Marketing", "Insurance", "Taxes", "Travel", "Fuel", "Other"
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

  const { data: expenses, isLoading } = useQuery({
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
    setCategories(categories.filter(c => c !== name));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Expense Management</CardTitle>
              <CardDescription>Track, add, or organize your business expenses</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCategoryMgrOpen(true)}>
                Manage Categories
              </Button>
              <Button onClick={handleAdd} className="bg-primary text-white hover:bg-primary/90 animate-fade-in">
                <Plus className="mr-2" /> New Expense
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <ExpensesTable
        expenses={expenses || []}
        categories={categories}
        onEdit={handleEdit}
        loading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <ExpensesForm
            categories={categories}
            expense={selectedExpense}
            onSubmit={() => {
              setIsDialogOpen(false);
              // after mutation, invalidate and refetch
              queryClient.invalidateQueries({ queryKey: ["expenses"] });
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
