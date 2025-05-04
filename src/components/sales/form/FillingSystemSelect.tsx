import { useQuery } from "@tanstack/react-query";
import { fetchFillingSystems } from "@/services/filling-systems";
import { FormSelect } from "@/components/ui/composed/form-fields";
import type { Control } from "react-hook-form";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";

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
  const { data: fillingSystems = [], isLoading } = useQuery({
    queryKey: ["filling-systems"],
    queryFn: fetchFillingSystems,
  });

  // Create options array for the FormSelect component
  const options = fillingSystems.map(system => ({
    value: system.id,
    label: `${system.name}${system.tank?.fuel_type ? ` (${system.tank.fuel_type})` : ""}`
  }));

  // Watch for field changes
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

  return (
    <FormSelect
      name="filling_system_id"
      label="Filling System"
      form={{ control } as any}
      options={options}
      placeholder="Select a filling system"
    />
  );
}
