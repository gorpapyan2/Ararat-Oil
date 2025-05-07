import { useQuery } from "@tanstack/react-query";
import { FillingSystemHeader } from "./FillingSystemHeader";
import { FillingSystemList } from "./FillingSystemList";
import { FillingSystemFormStandardized } from "./FillingSystemFormStandardized";
import { TankDiagnostics } from "./TankDiagnostics";
import { fetchFillingSystems } from "@/services/filling-systems";
import { useDialog } from "@/hooks/useDialog";
import React, { useMemo, useCallback } from "react";

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
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  // Memoize the action element
  const actionElement = useMemo(() => (
    <FillingSystemHeader onAddNew={formDialog.open} showAddButton={false} />
  ), [formDialog.open]);

  // Call the onRenderAction prop with the memoized action element if provided
  React.useEffect(() => {
    if (onRenderAction) {
      onRenderAction(actionElement);
    }
  }, [onRenderAction, actionElement]);

  // Memoize the filling systems data
  const fillingSystemsData = useMemo(() => fillingSystems || [], [fillingSystems]);

  // Memoize the delete handler
  const handleDelete = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoize the success handler
  const handleSuccess = useCallback(() => {
    formDialog.close();
    refetch();
  }, [formDialog, refetch]);

  return (
    <div className="space-y-6">
      <FillingSystemList
        fillingSystems={fillingSystemsData}
        isLoading={isLoading}
        onDelete={handleDelete}
      />

      <FillingSystemFormStandardized
        open={formDialog.isOpen}
        onOpenChange={formDialog.onOpenChange}
        onSuccess={handleSuccess}
      />

      {/* Diagnostic tools */}
      <TankDiagnostics />
    </div>
  );
} 