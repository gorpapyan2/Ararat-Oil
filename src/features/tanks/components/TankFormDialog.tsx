import { useState } from "react";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { FormDialog } from "@/shared/components/common/dialog/FormDialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/primitives/form";
import { Input } from "@/core/components/ui/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import { tanksService } from "../services/tanksService";
import {
  FuelTank,
  CreateTankRequest,
  UpdateTankRequest,
} from "../types/tanks.types";
import { toast as sonnerToast } from "sonner";

interface TankFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tank?: FuelTank;
  fuelTypes: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function TankFormDialog({
  open,
  onOpenChange,
  tank,
  fuelTypes,
  onSuccess,
}: TankFormDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the form schema using zod
  const tankFormSchema = z.object({
    name: z.string().min(1, t("common.nameRequired", "Name is required")),
    fuel_type_id: z
      .string()
      .min(1, t("common.fuelTypeRequired", "Fuel type is required")),
    capacity: z.coerce
      .number()
      .positive(
        t("tanks.capacityPositive", "Capacity must be a positive number")
      ),
    current_level: z.coerce
      .number()
      .nonnegative(
        t(
          "tanks.levelNonNegative",
          "Current level must be a non-negative number"
        )
      ),
  });

  type TankFormValues = z.infer<typeof tankFormSchema>;

  // Set default values
  const defaultValues: TankFormValues = {
    name: tank?.name || "",
    fuel_type_id: tank?.fuel_type_id || "",
    capacity: tank?.capacity || 0,
    current_level: tank?.current_level || 0,
  };

  // Form submission handler
  const onSubmit = async (values: TankFormValues) => {
    setIsSubmitting(true);
    try {
      const data = {
        name: values.name,
        fuel_type_id: values.fuel_type_id,
        capacity: values.capacity,
        current_level: values.current_level,
      };

      if (tank) {
        await tanksService.updateTank(tank.id, data as UpdateTankRequest);
        sonnerToast.success(t("common.success"), {
          description: t("tanks.tankUpdated", "Tank updated successfully"),
        });
      } else {
        await tanksService.createTank(data as CreateTankRequest);
        sonnerToast.success(t("common.success"), {
          description: t("tanks.tankCreated", "Tank created successfully"),
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["tanks"] });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (error) {
      sonnerToast.error(t("common.error"), {
        description: tank
          ? t("tanks.tankUpdateFailed", "Failed to update tank")
          : t("tanks.tankCreationFailed", "Failed to create tank"),
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        tank
          ? t("tanks.editTank", "Edit Tank")
          : t("tanks.createTank", "Create Tank")
      }
      schema={tankFormSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText={
        tank ? t("common.save", "Save") : t("common.create", "Create")
      }
      cancelText={t("common.cancel", "Cancel")}
    >
      {({ control }) => (
        <div className="space-y-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.name", "Name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="fuel_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.fuelType", "Fuel Type")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "common.selectFuelType",
                          "Select fuel type"
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.capacity", "Capacity")}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="current_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("common.currentLevel", "Current Level")}
                </FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </FormDialog>
  );
}
