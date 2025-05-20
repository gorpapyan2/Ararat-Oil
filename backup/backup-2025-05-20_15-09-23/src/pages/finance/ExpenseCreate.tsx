import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconArrowLeft } from "@tabler/icons-react";
import { Home, CircleDollarSign, Plus, AlertCircle } from "lucide-react";

// Import components
import { PageHeader } from '@/core/components/ui/page-header';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent } from '@/core/components/ui/card';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { expensesApi, Expense, PaymentStatus, ExpenseCategory, PaymentMethod } from "@/core/api";
import { useToast } from "@/hooks";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

// Import our standalone expense form
import { ExpenseForm, ExpenseFormValues } from "./ExpenseForm";

export default function ExpenseCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<Expense> | null>(null);

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
    { name: t("common.financeManagement"), href: "/finance", icon: <CircleDollarSign className="h-4 w-4" /> },
    { name: t("common.expenses"), href: "/finance/expenses", icon: <CircleDollarSign className="h-4 w-4" /> },
    { 
      name: t("finance.expenses.add", "Add Expense"), 
      href: "/finance/expenses/create", 
      isCurrent: true,
      icon: <Plus className="h-4 w-4" /> 
    }
  ], [t]);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("finance.expenses.add", "Add Expense")
  });

  // Add create expense mutation with proper error handling
  const createExpenseMutation = useMutation({
    mutationFn: expensesApi.createExpense,
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      
      // Show success message
      toast({
        title: t("common.success"),
        description: t("finance.expenses.createSuccess", "Expense record created successfully"),
      });
      
      // Navigate back to the finance page
      navigate("/finance?tab=expenses");
    },
    onError: (error: any) => {
      console.error("Create error:", error);
      toast({
        title: t("common.error"),
        description: error.message || t("finance.expenses.createError", "Failed to create expense record"),
        variant: "destructive",
      });
      setIsConfirmOpen(false);
    },
  });

  // Default values with today's date
  const defaultValues = useMemo(() => ({
    date: new Date().toISOString().split("T")[0],
    payment_status: "pending" as PaymentStatus,
  }), []);

  const handleSubmit = (data: ExpenseFormValues) => {
    // Cast the form values to the expected expense type
    const expenseData: Omit<Expense, "id" | "created_at"> = {
      date: data.date,
      description: data.description,
      amount: data.amount,
      category: data.category as ExpenseCategory,
      payment_status: data.payment_status,
      payment_method: data.payment_method as PaymentMethod | undefined,
      notes: data.notes,
    };
    
    setPendingData(expenseData);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingData) {
      createExpenseMutation.mutate(pendingData as Omit<Expense, "id" | "created_at">);
    }
  };

  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
    setPendingData(null);
  };

  const handleCancel = () => {
    navigate("/finance?tab=expenses");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title={t("finance.expenses.add", "Add Expense")}
        description={t("finance.expenses.createDescription", "Fill in the details to add a new expense record.")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <IconArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Button>
          </div>
        }
      />

      {createExpenseMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {createExpenseMutation.error instanceof Error 
              ? createExpenseMutation.error.message 
              : t("finance.expenses.createError", "Failed to create expense record")}
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <ExpenseForm 
            onSubmit={handleSubmit}
            isSubmitting={createExpenseMutation.isPending}
            defaultValues={defaultValues}
            onConfirm={handleConfirm}
            onConfirmCancel={handleConfirmCancel}
            isConfirmOpen={isConfirmOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
} 