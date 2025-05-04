import { useQuery } from "@tanstack/react-query";
import { FillingSystemHeader } from "./FillingSystemHeader";
import { FillingSystemList } from "./FillingSystemList";
import { FillingSystemFormStandardized } from "./FillingSystemFormStandardized";
import { TankDiagnostics } from "./TankDiagnostics";
import { fetchFillingSystems } from "@/services/filling-systems";
import { useDialog } from "@/hooks/useDialog";

export function FillingSystemManagerStandardized() {
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

  return (
    <div className="space-y-6">
      <FillingSystemHeader onAddNew={formDialog.open} />

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