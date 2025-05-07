import { useState } from "react";
import { Check, Edit, Trash, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { TodoFormStandardized, TodoFormValues } from "./TodoFormStandardized";
import { cn } from "@/lib/utils";
import { TodoItem } from "@/types/todo";
import { useTranslation } from "react-i18next";

interface TodoItemStandardizedProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onPriorityChange: (id: string, priority: TodoItem["priority"]) => void;
}

export function TodoItemStandardized({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onPriorityChange,
}: TodoItemStandardizedProps) {
  const { t } = useTranslation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditSubmit = (data: TodoFormValues) => {
    onEdit(todo.id, data.text);
    onPriorityChange(todo.id, data.priority);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(todo.id);
    setIsDeleteDialogOpen(false);
  };

  const priorityColors = {
    low: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    medium: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
    high: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20",
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
              aria-label={t("todo.toggle")}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={cn(
                    "cursor-pointer text-sm font-medium flex-1",
                    todo.completed && "line-through text-muted-foreground"
                  )}
                >
                  {todo.text}
                </label>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge
                    variant="outline"
                    className={priorityColors[todo.priority]}
                  >
                    {t(`todo.priority.${todo.priority}`)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditDialogOpen(true)}
                    aria-label={t("todo.edit")}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    aria-label={t("todo.delete")}
                    className="h-8 w-8"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(todo.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Todo"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("todo.editTask")}</DialogTitle>
          </DialogHeader>

          <TodoFormStandardized
            initialValues={{ text: todo.text, priority: todo.priority }}
            onSubmit={handleEditSubmit}
            submitButtonText={t("todo.saveChanges")}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Todo"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("todo.confirmDelete")}</DialogTitle>
          </DialogHeader>
          <p>{t("todo.deleteConfirmationMsg")}</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              <X className="mr-2 h-4 w-4" />
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash className="mr-2 h-4 w-4" />
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
