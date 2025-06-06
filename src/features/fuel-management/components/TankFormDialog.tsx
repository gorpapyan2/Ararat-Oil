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
import { tanksApi, Tank } from '@/core/api';
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
      description={
        tank
          ? t("tanks.editTankDescription", "Update tank information")
          : t("tanks.createTankDescription", "Add a new tank to your fuel storage system")
      }
      schema={tankFormSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText={
        tank ? t("common.save", "Save") : t("common.create", "Create")
      }
      cancelText={t("common.cancel", "Cancel")}
      size="md"
      formClassName="space-y-6 py-6"
    >
      {({ control }) => (
        <div className="space-y-6">
          {/* Tank Name */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("common.name", "Name")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder={t("tanks.namePlaceholder", "Enter tank name")}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Fuel Type */}
          <FormField
            control={control}
            name="fuel_type_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("common.fuelType", "Fuel Type")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100">
                      <SelectValue
                        placeholder={t(
                          "common.selectFuelType",
                          "Select fuel type"
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    {fuelTypes.map((type) => (
                      <SelectItem 
                        key={type.id} 
                        value={type.id}
                        className="dark:text-gray-100 dark:focus:bg-gray-600"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Capacity and Current Level - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="capacity"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("common.capacity", "Capacity")}
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        {...field} 
                        className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 pr-12"
                        placeholder={t("tanks.capacityPlaceholder", "0.00")}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                        L
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="current_level"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("common.currentLevel", "Current Level")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        {...field} 
                        className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 pr-12"
                        placeholder={t("tanks.currentLevelPlaceholder", "0.00")}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                        L
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Status */}
          <FormField
            control={control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("common.status", "Status")}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value === "active")}
                    defaultValue={field.value ? "active" : "inactive"}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100">
                        <SelectValue
                          placeholder={t(
                            "common.selectStatus",
                            "Select status"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="active" className="dark:text-gray-100 dark:focus:bg-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {t("common.active", "Active")}
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive" className="dark:text-gray-100 dark:focus:bg-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          {t("common.inactive", "Inactive")}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      )}
    </FormDialog>
  );
}
