
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchPetrolProviders } from "@/services/petrol-providers";
import type { Control } from "react-hook-form";

interface ProviderSelectProps {
  control: Control<any>;
}

export function ProviderSelect({ control }: ProviderSelectProps) {
  const { data: providers } = useQuery({
    queryKey: ['petrol-providers'],
    queryFn: fetchPetrolProviders,
  });

  return (
    <FormField
      control={control}
      name="provider_id"
      rules={{ required: "Provider is required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">Petrol Provider</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {providers?.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
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
