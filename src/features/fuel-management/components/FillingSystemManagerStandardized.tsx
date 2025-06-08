import React, { useMemo, useCallback } from "react";
import { useDialog } from "@/core/hooks/useDialog";
import { useFillingSystem } from "../hooks/useFillingSystem";
import { FillingSystem } from "@/features/filling-systems/types";

// Import components within the feature
import { FillingSystemHeader } from "./FillingSystemHeader";
import { FillingSystemList } from "./FillingSystemList";
import { FillingSystemFormStandardized } from "./FillingSystemFormStandardized";

interface FillingSystemManagerStandardizedProps {
  onRenderAction?: (actionElement: React.ReactNode) => void;
}

export function FillingSystemManagerStandardized({
  onRenderAction,
}: FillingSystemManagerStandardizedProps) {
  // Use dialog hook for managing the form dialog
  const formDialog = useDialog();

  // Use the custom hook for filling systems
  const { useFillingSystemsQuery } = useFillingSystem();

  // Query for filling systems data
  const {
    data: fillingSystemsResponse,
    isLoading,
    refetch,
  } = useFillingSystemsQuery();

  // Memoize the action element
  const actionElement = useMemo(
    () => (
      <FillingSystemHeader onAddNew={formDialog.open} showAddButton={false} />
    ),
    [formDialog.open]
  );

  // Call the onRenderAction prop with the memoized action element if provided
  React.useEffect(() => {
    if (onRenderAction) {
      onRenderAction(actionElement);
    }
  }, [onRenderAction, actionElement]);

  // Memoize the filling systems data
  const fillingSystemsData = useMemo(() => {
    if (!fillingSystemsResponse) {
      return [];
    }
    // Map the API response to our feature's FillingSystem type
    return fillingSystemsResponse.map(
      (apiSystem) =>
        ({
          id: apiSystem.id,
          name: apiSystem.name,
          status: apiSystem.status || "active",
          type: "standard", // Add default type since it's not in the API response
          tank_id: apiSystem.tank_id,
          location: apiSystem.location,
          created_at: apiSystem.created_at,
          updated_at: apiSystem.updated_at,
        }) as FillingSystem
    );
  }, [fillingSystemsResponse]);

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

    </div>
  );
}
