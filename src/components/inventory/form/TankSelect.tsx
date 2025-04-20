
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FuelTank } from "@/services/supabase";
import type { Control } from "react-hook-form";

interface TankSelectProps {
  control: Control<any>;
  tanks?: FuelTank[];
}

export function TankSelect({ control, tanks }: TankSelectProps) {
  return (
    <FormField
      control={control}
      name="tank_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Fuel Tank</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel tank" />
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
