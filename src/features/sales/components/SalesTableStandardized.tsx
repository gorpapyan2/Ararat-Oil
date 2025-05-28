import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { FileText, Eye } from "lucide-react";
import {
  StandardizedDataTable,
  createBadgeCell,
  createDateCell,
  createCurrencyCell,
  createNumberCell,
} from "@/shared/components/unified/StandardizedDataTable";
import { DropdownMenuItem } from "@/core/components/ui/primitives/dropdown-menu";
import { Sale } from "../types";

interface SalesTableStandardizedProps {
  sales: Sale[];
  isLoading: boolean;
  onEdit?: (sale: Sale) => void;
  onDelete?: (id: string) => void;
  onView?: (sale: Sale) => void;
  onGenerateReceipt?: (sale: Sale) => void;
}

export function SalesTableStandardized({
  sales,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onGenerateReceipt,
}: SalesTableStandardizedProps) {
  const { t } = useTranslation(["sales", "common"]);

  // Custom handler to map ID to full sale object for edit/view
  const handleEdit = (id: string) => {
    const sale = sales.find((s) => s.id === id);
    if (sale && onEdit) onEdit(sale);
  };

  const handleView = useCallback((id: string) => {
    const sale = sales.find((s) => s.id === id);
    if (sale && onView) onView(sale);
  }, [sales, onView]);

  const handleGenerateReceipt = useCallback((id: string) => {
    const sale = sales.find((s) => s.id === id);
    if (sale && onGenerateReceipt) onGenerateReceipt(sale);
  }, [sales, onGenerateReceipt]);

  // Define custom actions for the dropdown menu
  const customActions = useMemo(() => {
    const actions = [];

    if (onView) {
      actions.push({
        element: (id: string) => (
          <DropdownMenuItem key="view" onClick={() => handleView(id)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>{t("common:view")}</span>
          </DropdownMenuItem>
        ),
      });
    }

    if (onGenerateReceipt) {
      actions.push({
        element: (id: string) => (
          <DropdownMenuItem
            key="receipt"
            onClick={() => handleGenerateReceipt(id)}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>{t("sales:generateReceipt")}</span>
          </DropdownMenuItem>
        ),
      });
    }

    return actions;
  }, [onView, onGenerateReceipt, t, handleView, handleGenerateReceipt]);

  // Define column structure
  const columns = useMemo(
    () => [
      {
        header: t("sales:fields.saleDate"),
        accessorKey: "saleDate" as keyof Sale,
        cell: (value: string) => createDateCell(value),
        enableSorting: true,
      },
      {
        header: t("sales:fields.fuelType"),
        accessorKey: "fuelType" as keyof Sale,
        cell: (value: string) => t(`sales:fuelTypes.${value}`),
        enableSorting: true,
      },
      {
        header: t("sales:fields.quantityLiters"),
        accessorKey: "quantityLiters" as keyof Sale,
        cell: (value: number) => createNumberCell(value, 2),
        enableSorting: true,
      },
      {
        header: t("sales:fields.unitPrice"),
        accessorKey: "unitPrice" as keyof Sale,
        cell: (value: number) => createNumberCell(value, 2),
        enableSorting: true,
      },
      {
        header: t("sales:fields.amount"),
        accessorKey: "amount" as keyof Sale,
        cell: (value: number) => createCurrencyCell(value),
        enableSorting: true,
      },
      {
        header: t("sales:fields.paymentStatus"),
        accessorKey: "paymentStatus" as keyof Sale,
        cell: (value: string) => {
          const variantMap: Record<string, "success" | "warning" | "destructive" | "outline"> = {
            paid: "success",
            pending: "warning",
            cancelled: "destructive",
            default: "outline",
          };

          const variant = variantMap[value] || variantMap.default;
          return createBadgeCell(t(`sales:paymentStatuses.${value}`), variant);
        },
        enableSorting: true,
      },
    ],
    [t]
  );

  return (
    <StandardizedDataTable
      title={t("sales:salesList")}
      columns={columns}
      data={sales}
      loading={isLoading}
      onEdit={onEdit ? handleEdit : undefined}
      onDelete={onDelete}
    />
  );
}
