import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/primitives/input";
import { useFinance } from "../hooks/useFinance";
import { calculateProfitLoss } from "../services";
import type { ProfitLoss } from "../types/finance.types";

const profitLossSchema = z.object({
  period: z.string().min(1, "Period is required"),
  revenue: z.coerce.number().min(0, "Revenue must be positive"),
  expenses: z.coerce.number().min(0, "Expenses must be positive"),
});

type ProfitLossFormValues = z.infer<typeof profitLossSchema>;

interface ProfitLossManagerStandardizedProps {
  profitLoss: ProfitLoss[];
  isLoading: boolean;
}

export function ProfitLossManagerStandardized({
  profitLoss,
  isLoading,
}: ProfitLossManagerStandardizedProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { refetchAll } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProfitLoss, setSelectedProfitLoss] = useState<ProfitLoss | null>(null);

  // Create the mutations directly with the calculateProfitLoss function
  const createProfitLoss = useMutation({
    mutationFn: (data: { period: string; total_sales: number; total_expenses: number; profit: number }) => 
      calculateProfitLoss(data.period),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profit-loss'] });
      toast.success(t("finance.profitLoss.createSuccess", "Profit & Loss created successfully"));
      refetchAll();
    },
  });

  const updateProfitLoss = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { period: string; total_sales: number; total_expenses: number; profit: number }}) => 
      calculateProfitLoss(data.period),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profit-loss'] });
      toast.success(t("finance.profitLoss.updateSuccess", "Profit & Loss updated successfully"));
      refetchAll();
    },
  });

  const form = useForm<ProfitLossFormValues>({
    resolver: zodResolver(profitLossSchema),
    defaultValues: {
      period: selectedProfitLoss?.period || "",
      revenue: selectedProfitLoss?.total_sales || 0,
      expenses: selectedProfitLoss?.total_expenses || 0,
    },
  });

  const onSubmit = (data: ProfitLossFormValues) => {
    const profit = data.revenue - data.expenses;

    if (selectedProfitLoss) {
      updateProfitLoss.mutate(
        {
          id: selectedProfitLoss.id,
          data: {
            period: data.period,
            total_sales: data.revenue,
            total_expenses: data.expenses,
            profit,
          },
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setSelectedProfitLoss(null);
          },
          onError: (error) => {
            toast.error(t("finance.profitLoss.updateError", "Failed to update Profit & Loss"));
            console.error("Error updating Profit & Loss:", error);
          },
        }
      );
    } else {
      createProfitLoss.mutate(
        {
          period: data.period,
          total_sales: data.revenue,
          total_expenses: data.expenses,
          profit,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast.error(t("finance.profitLoss.createError", "Failed to create Profit & Loss"));
            console.error("Error creating Profit & Loss:", error);
          },
        }
      );
    }
  };

  const handleEdit = (item: ProfitLoss) => {
    setSelectedProfitLoss(item);
    form.reset({
      period: item.period,
      revenue: item.total_sales,
      expenses: item.total_expenses,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProfitLoss(null);
    form.reset({
      period: "",
      revenue: 0,
      expenses: 0,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {t("finance.profitLoss.title", "Profit & Loss")}
        </h2>
        <Button onClick={handleCreate}>
          {t("finance.profitLoss.create", "Create New")}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          {t("common.loading", "Loading...")}
        </div>
      ) : (
        <div className="grid gap-4">
          {profitLoss.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => handleEdit(item)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{item.period}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("finance.profitLoss.revenue", "Revenue")}: {item.total_sales}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("finance.profitLoss.expenses", "Expenses")}: {item.total_expenses}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t("finance.profitLoss.profit", "Profit")}: {item.profit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProfitLoss
                ? t("finance.profitLoss.edit", "Edit Profit & Loss")
                : t("finance.profitLoss.create", "Create Profit & Loss")}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("finance.profitLoss.period", "Period")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("finance.profitLoss.revenue", "Revenue")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("finance.profitLoss.expenses", "Expenses")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button type="submit" disabled={createProfitLoss.isPending || updateProfitLoss.isPending}>
                  {selectedProfitLoss
                    ? t("common.save", "Save")
                    : t("common.create", "Create")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 