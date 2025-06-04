import React, { useState } from "react";
import { Input } from "@/core/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FormDialog } from "@/shared/components/common/dialog/FormDialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/primitives/form";
import { toast as sonnerToast } from "sonner";

// Form validation schema
const tankFormSchema = z.object({
  name: z.string().min(1, "Tank name is required"),
  capacity: z.number().min(1, "Capacity must be greater than 0"),
  fuel_type_id: z.string().min(1, "Fuel type is required"),
  current_level: z.number().min(0, "Current level cannot be negative"),
  is_active: z.boolean(),
});

type TankFormData = z.infer<typeof tankFormSchema>;

// Import from core/api instead of services
import { tanksApi, Tank, TankCreate, TankUpdate } from "@/core/api";
import { useToast } from "@/hooks/useToast";

interface TankFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tank?: Tank;
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

  // Set default values
  const defaultValues: TankFormData = {
    name: tank?.name || "",
    fuel_type_id: tank?.fuel_type_id || "",
    capacity: tank?.capacity || 0,
    current_level: tank?.current_level || 0,
    is_active: tank?.is_active ?? true,
  };

  // Form submission handler
  const onSubmit = async (values: TankFormData) => {
    setIsSubmitting(true);
    try {
      const data = {
        name: values.name,
        fuel_type_id: values.fuel_type_id,
        capacity: values.capacity,
        current_level: values.current_level,
        is_active: values.is_active,
      };

      if (tank) {
        await tanksApi.updateTank(tank.id, data as TankUpdate);
        sonnerToast.success(t("common.success"), {
          description: t("tanks.tankUpdated", "Tank updated successfully"),
        });
      } else {
        await tanksApi.createTank(data as TankCreate);
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

          <FormField
            control={control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.status", "Status")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value === "active")}
                    defaultValue={field.value ? "active" : "inactive"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "common.selectStatus",
                            "Select status"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
