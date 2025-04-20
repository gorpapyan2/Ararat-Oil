
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelTanks } from "@/services/tanks";
import type { Control } from "react-hook-form";

interface TankSelectProps {
  control: Control<any>;
  onSelect?: (tankId: string) => void;
}

export function TankSelect({ control, onSelect }: TankSelectProps) {
  const { data: tanks } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks,
  });

  return (
    <FormField
      control={control}
      name="tank_id"
      rules={{ required: "Tank is required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">Fuel Tank</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onSelect?.(value);
            }} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a tank" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {tanks?.map((tank) => (
                <SelectItem key={tank.id} value={tank.id}>
                  {tank.name} ({tank.fuel_type})
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
