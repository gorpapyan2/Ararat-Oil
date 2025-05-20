import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import { tanksService } from "../services/tanksService";
import { FuelTank, CreateTankRequest, UpdateTankRequest } from "../types/tanks.types";

interface TankFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tank?: FuelTank;
  fuelTypes: { id: string; name: string }[];
  onSuccess?: () => void;
}

const tankFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fuel_type_id: z.string().min(1, "Fuel type is required"),
  capacity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Capacity must be a positive number",
  }),
  current_level: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Current level must be a non-negative number",
  }),
});

type TankFormValues = z.infer<typeof tankFormSchema>;

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

  const form = useForm<TankFormValues>({
    resolver: zodResolver(tankFormSchema),
    defaultValues: {
      name: tank?.name || "",
      fuel_type_id: tank?.fuel_type_id || "",
      capacity: tank?.capacity.toString() || "",
      current_level: tank?.current_level.toString() || "0",
    },
  });

  const onSubmit = async (values: TankFormValues) => {
    setIsSubmitting(true);
    try {
      const data = {
        name: values.name,
        fuel_type_id: values.fuel_type_id,
        capacity: Number(values.capacity),
        current_level: Number(values.current_level),
      };

      if (tank) {
        await tanksService.updateTank(tank.id, data as UpdateTankRequest);
        toast({
          title: t("common.success"),
          description: t("tanks.tankUpdated"),
        });
      } else {
        await tanksService.createTank(data as CreateTankRequest);
        toast({
          title: t("common.success"),
          description: t("tanks.tankCreated"),
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["tanks"] });
      onOpenChange(false);
      form.reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: tank
          ? t("tanks.tankUpdateFailed")
          : t("tanks.tankCreationFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tank ? t("tanks.editTank") : t("tanks.createTank")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuel_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.fuelType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("common.selectFuelType")} />
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
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.capacity")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.currentLevel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("common.saving")
                  : tank
                  ? t("common.save")
                  : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 