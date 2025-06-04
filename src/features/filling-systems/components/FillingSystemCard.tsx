import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Separator } from "@/core/components/ui/separator";
import { Edit, Trash2, Fuel, AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FillingSystemFormDialog } from "./FillingSystemFormDialog";
import { ConfirmDialog } from "@/shared/components/common/dialog/ConfirmDialog";
import { toast } from "sonner";
import { fillingsApi, FillingSystem } from "@/core/api";

const FillingSystemCard: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fillingSystem, setFillingSystem] = useState<FillingSystem | null>(null);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleEdit = (system: FillingSystem) => {
    setFillingSystem(system);
    setIsEditing(true);
  };

  const handleDelete = (system: FillingSystem) => {
    setFillingSystem(system);
    setIsDeleting(true);
  };

  const handleSave = (system: FillingSystem) => {
    // Implement the logic to save the updated system
    queryClient.invalidateQueries({ queryKey: ["fillingSystems"] });
    toast.success("Filling system updated successfully");
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    if (fillingSystem) {
      try {
        await fillingsApi.deleteFillingSystem(fillingSystem.id);
        queryClient.invalidateQueries({ queryKey: ["fillingSystems"] });
        toast.success("Filling system deleted successfully");
        setIsDeleting(false);
      } catch (error) {
        toast.error("Failed to delete filling system");
      }
    }
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t("fillingSystemCard.title")}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(fillingSystem as FillingSystem)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDelete(fillingSystem as FillingSystem)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">
          {fillingSystem ? fillingSystem.name : t("fillingSystemCard.noSystem")}
        </div>
        <div className="text-xs text-muted-foreground">
          {fillingSystem ? fillingSystem.location : t("fillingSystemCard.noLocation")}
        </div>
      </CardContent>
    </Card>
  );
};

export default FillingSystemCard; 