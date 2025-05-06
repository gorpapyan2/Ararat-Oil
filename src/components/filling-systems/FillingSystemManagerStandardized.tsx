import { useQuery } from "@tanstack/react-query";
import { FillingSystemHeader } from "./FillingSystemHeader";
import { FillingSystemList } from "./FillingSystemList";
import { FillingSystemFormStandardized } from "./FillingSystemFormStandardized";
import { TankDiagnostics } from "./TankDiagnostics";
import { fetchFillingSystems } from "@/services/filling-systems";
import { useDialog } from "@/hooks/useDialog";
import React from "react";

interface FillingSystemManagerStandardizedProps {
  onRenderAction?: (actionElement: React.ReactNode) => void;
}

export function FillingSystemManagerStandardized({ onRenderAction }: FillingSystemManagerStandardizedProps) {
  // Use dialog hook instead of direct state
  const formDialog = useDialog();

  const {
    data: fillingSystems,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["filling-systems"],
    queryFn: fetchFillingSystems,
  });

  // Call the onRenderAction prop with the action element if provided
  React.useEffect(() => {
    if (onRenderAction) {
      onRenderAction(
        <FillingSystemHeader onAddNew={formDialog.open} showAddButton={false} />
      );
    }
  }, [onRenderAction, formDialog.open]);

  return (
    <div className="space-y-6">
      <FillingSystemList
        fillingSystems={fillingSystems || []}
        isLoading={isLoading}
        onDelete={() => refetch()}
      />

      <FillingSystemFormStandardized
        open={formDialog.isOpen}
        onOpenChange={formDialog.onOpenChange}
        onSuccess={() => {
          formDialog.close();
          refetch();
        }}
      />

      {/* Diagnostic tools */}
      <TankDiagnostics />
    </div>
  );
} 