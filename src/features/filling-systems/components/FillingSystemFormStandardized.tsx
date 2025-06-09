import { z } from "zod";
import { useState, useEffect } from "react";
import { StandardDialog } from "@/core/components/ui/composed/base-dialog";
import { Button } from "@/core/components/ui/button";
import { useToast } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { tanksApi } from "@/core/api";
import {
  FormInput,
  FormSelect,
  FormRadioGroup,
} from "@/core/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/shared/hooks/use-form";
import { useTranslation } from "react-i18next";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";
import { useFillingSystem } from "../hooks/useFillingSystem";
import { FillingSystem } from "../types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/core/components/ui/tabs";
import { Badge } from "@/core/components/ui/badge";
import { StatusIcons, OperationalIcons } from '@/shared/components/ui/icons';

interface FillingSystemFormStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  fillingSystem?: FillingSystem;
  mode?: 'create' | 'edit';
}

// Define Zod schema for validation
const fillingSystemSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters"),
  tank_id: z.string({ required_error: "Tank selection is required" }),
  location: z.string().optional(),
  status: z.enum(["active", "maintenance", "inactive"]),
  type: z.string().optional(),
});

// Type based on schema
type FillingSystemFormData = z.infer<typeof fillingSystemSchema>;

export function FillingSystemFormStandardized({
  open,
  onOpenChange,
  onSuccess,
  fillingSystem,
  mode = "create",
}: FillingSystemFormStandardizedProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  const { 
    useCreateFillingSystemMutation,
    useUpdateFillingSystemMutation
  } = useFillingSystem();
  
  const createFillingSystemMutation = useCreateFillingSystemMutation();
  const updateFillingSystemMutation = useUpdateFillingSystemMutation();

  // Default values based on mode
  const defaultValues = {
    name: fillingSystem?.name || "",
    tank_id: fillingSystem?.tank_id || "",
    location: fillingSystem?.location || "",
    status: fillingSystem?.status || "active" as const,
    type: fillingSystem?.type || "standard",
  };

  // Initialize form with Zod validation
  const form = useZodForm({
    schema: fillingSystemSchema,
    defaultValues,
  });

  // Reset form when props change
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, fillingSystem, form]);

  const { data: tanks } = useQuery({
    queryKey: ["fuel-tanks"],
    queryFn: tanksApi.getTanks,
  });

  // Format tanks as options for select
  const tankOptions =
    tanks?.data?.map((tank) => ({
      value: tank.id,
      label: `${tank.name || tank.id} (${tank.fuel_type || 'Unknown'})`,
      description: `Capacity: ${tank.capacity}L`,
    })) || [];

  // Status options
  const statusOptions = [
    { 
      value: "active", 
      label: t("fillingSystems.status.active", "Active"),
      icon: <StatusIcons.Success className="w-4 h-4 mr-1 text-green-500" />
    },
    { 
      value: "maintenance", 
      label: t("fillingSystems.status.maintenance", "Maintenance"),
      icon: <StatusIcons.Warning className="w-4 h-4 mr-1 text-yellow-500" />
    },
    { 
      value: "inactive", 
      label: t("fillingSystems.status.inactive", "Inactive"),
      icon: <StatusIcons.Error className="w-4 h-4 mr-1 text-red-500" />
    },
  ];

  // Get translated strings
  const isEdit = mode === "edit";
  const title = isEdit 
    ? t("fillingSystems.editSystem", "Edit Filling System") 
    : t("fillingSystems.addSystem", "Add Filling System");
  
  const description = isEdit
    ? t("fillingSystems.editSystemDescription", "Update filling system details")
    : t("fillingSystems.addSystemDescription", "Create a new filling system connected to a fuel tank");
  
  const cancelButton = t("common.cancel", "Cancel");
  const submitButton = isEdit 
    ? t("common.save", "Save Changes") 
    : t("common.create", "Create System");
  
  const submittingButton = isEdit 
    ? t("common.saving", "Saving...") 
    : t("common.creating", "Creating...");

  // Form submission handler
  const { isSubmitting, onSubmit: handleSubmit } =
    useFormSubmitHandler<FillingSystemFormData>(form, async (data) => {
      try {
        if (isEdit && fillingSystem) {
          await updateFillingSystemMutation.mutateAsync({
            id: fillingSystem.id,
            data: {
              name: data.name,
              tank_id: data.tank_id,
              location: data.location || undefined,
              status: data.status,
              type: data.type || undefined,
            }
          });
        } else {
          await createFillingSystemMutation.mutateAsync({
            name: data.name,
            tank_id: data.tank_id,
            location: data.location || "Default Location",
            status: data.status,
            type: data.type || "standard",
          });
        }
        form.reset();
        onSuccess();
        return true;
      } catch (error) {
        return false;
      }
    });

  // Create form actions
  const formActions = (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
      >
        {cancelButton}
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        form="filling-system-form"
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {isSubmitting ? submittingButton : submitButton}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      className="sm:max-w-[500px]"
      footer={formActions}
    >
      {isEdit && fillingSystem && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <OperationalIcons.Fuel className="w-3 h-3 text-accent-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium text-primary">
                ID: {fillingSystem.id.slice(0, 8)}...
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(fillingSystem.created_at || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <Badge variant={
            fillingSystem.status === 'active' ? 'success' : 
            fillingSystem.status === 'maintenance' ? 'warning' : 
            'destructive'
          }>
            {fillingSystem.status}
          </Badge>
        </div>
      )}

      <Tabs 
        defaultValue="general" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="general">{t("common.tabs.general", "General")}</TabsTrigger>
          <TabsTrigger value="advanced">{t("common.tabs.advanced", "Advanced")}</TabsTrigger>
        </TabsList>
        
        <form
          id="filling-system-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <TabsContent value="general" className="space-y-4 mt-0">
            <FormInput
              name="name"
              label={t("fillingSystems.systemName", "System Name")}
              form={form}
              placeholder={t("fillingSystems.enterSystemName", "Enter system name")}
            />

            <FormSelect
              name="tank_id"
              label={t("fillingSystems.associatedTank", "Associated Tank")}
              form={form}
              options={tankOptions}
              placeholder={t("fillingSystems.selectTank", "Select a tank")}
            />

            <FormRadioGroup
              name="status"
              label={t("fillingSystems.status.label", "Status")}
              form={form}
              options={statusOptions}
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-0">
            <FormInput
              name="location"
              label={t("fillingSystems.location", "Location")}
              form={form}
              placeholder={t("fillingSystems.enterLocation", "Enter location (optional)")}
            />
            
            <FormInput
              name="type"
              label={t("fillingSystems.type", "System Type")}
              form={form}
              placeholder={t("fillingSystems.enterType", "Enter system type (optional)")}
            />
          </TabsContent>
        </form>
      </Tabs>
    </StandardDialog>
  );
}
