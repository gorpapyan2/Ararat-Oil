
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/primitives/badge";
import { Trash2, Edit } from "lucide-react";
import { FillingSystemFormStandardized } from "./FillingSystemFormStandardized";

interface FillingSystem {
  id: string;
  name: string;
  tank_id: string;
  created_at: string;
}

interface FillingSystemCardProps {
  system: FillingSystem;
  onEdit?: (system: FillingSystem) => void;
  onDelete?: (id: string) => void;
}

export function FillingSystemCard({ system, onEdit, onDelete }: FillingSystemCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(system);
    } else {
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(system.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting filling system:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{system.name}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tank ID:</span>
              <Badge variant="secondary">{system.tank_id}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Created:</span>
              <span className="text-sm">{new Date(system.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditDialogOpen && (
        <FillingSystemFormStandardized
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          fillingSystem={system}
          onSuccess={() => setIsEditDialogOpen(false)}
        />
      )}
    </>
  );
}
