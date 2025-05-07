import { useQuery } from "@tanstack/react-query";
import { fetchFillingSystems, FillingSystem } from "@/services/filling-systems";
import { FormSelect } from "@/components/ui/composed/form-fields";
import type { Control } from "react-hook-form";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FillingSystemSelectProps {
  control: Control<any>;
  onChange?: (value: string) => void;
  onSelect?: (systemId: string) => void;
  value?: string;
}

export function FillingSystemSelect({
  control,
  onChange,
  onSelect,
  value,
}: FillingSystemSelectProps) {
  const { t } = useTranslation();
  const [retryCount, setRetryCount] = useState(0);

  const { 
    data: fillingSystems = [] as FillingSystem[], 
    isLoading, 
    isError,
    error,
    refetch 
  } = useQuery({
    queryKey: ["filling-systems", retryCount],
    queryFn: fetchFillingSystems,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  // Log errors to console and show toast notification
  useEffect(() => {
    if (error) {
      console.error("Error fetching filling systems:", error);
      toast.error(t("common.error"), {
        description: t("common.errorMessage", { message: String(error) }),
      });
    }
  }, [error, t]);

  // Show notification for offline mode
  useEffect(() => {
    if (!navigator.onLine && fillingSystems.length > 0) {
      toast.warning(t("common.warning"), {
        description: "Using offline mode with sample filling systems data",
        duration: 5000,
      });
    }
  }, [fillingSystems, t]);

  // Handle retry when error occurs
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Watch for field changes - must be called in every render path
  const selectedValue = useWatch({
    control,
    name: "filling_system_id"
  });

  // Call callbacks when the value changes
  useEffect(() => {
    if (selectedValue) {
      if (onChange) onChange(selectedValue);
      if (onSelect) onSelect(selectedValue);
    }
  }, [selectedValue, onChange, onSelect]);

  // Create options array for the FormSelect component (outside conditions)
  const options = fillingSystems.map(system => {
    // Get the fuel type from the tank if available
    const fuelType = system.tank?.fuel_type ? ` (${system.tank.fuel_type})` : "";
    
    // Get the current level and capacity if available
    const level = system.tank?.current_level !== undefined 
      ? ` - ${Math.round(system.tank.current_level)}L` 
      : "";
    
    return {
      value: system.id,
      label: `${system.name}${fuelType}${level}`
    };
  });

  // Determine what content to render
  let content;
  
  if (isLoading) {
    content = (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">{t("common.loading", "Loading filling systems...")}</span>
        </div>
      </div>
    );
  } else if (isError && fillingSystems.length === 0) {
    content = (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("fillingSystems.errorFetching", "Failed to load filling systems")}
          </AlertDescription>
        </Alert>
        <Button variant="outline" size="sm" onClick={handleRetry}>
          {t("common.retry", "Retry")}
        </Button>
      </div>
    );
  } else if (options.length === 0) {
    content = (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("fillingSystems.noSystems", "No filling systems found. Please add filling systems before creating a sale.")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Always render the FormSelect component with options
  return (
    <>
      {content}
      <FormSelect
        name="filling_system_id"
        label={t("sales.fillingSystem")}
        form={{ control } as any}
        options={options}
        placeholder={isLoading 
          ? t("fillingSystems.loading", "Loading...") 
          : t("fillingSystems.selectTank")
        }
        onChange={onChange}
      />
    </>
  );
}
