
import { useQuery } from "@tanstack/react-query";
import { fetchFillingSystems } from "@/services/filling-systems";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Control } from "react-hook-form";
import { useEffect } from "react";

interface FillingSystemSelectProps {
  control: Control<any>;
  onSelect?: (systemId: string) => void;
}

export function FillingSystemSelect({ control, onSelect }: FillingSystemSelectProps) {
  const { data: fillingSystems, isLoading } = useQuery({
    queryKey: ['filling-systems'],
    queryFn: fetchFillingSystems,
  });

  return (
    <FormField
      control={control}
      name="filling_system_id"
      rules={{ required: "Filling system is required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">Filling System</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              if (onSelect) {
                onSelect(value);
              }
            }} 
            value={field.value || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a filling system" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {fillingSystems?.map((system) => (
                <SelectItem key={system.id} value={system.id}>
                  {system.name} ({system.tank?.fuel_type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
