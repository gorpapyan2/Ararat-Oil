import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TodoItem as TodoItemType } from "@/types/todo";
import { Check, Pencil, Trash2, MoreVertical, Flag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onPriorityChange: (id: string, priority: TodoItemType["priority"]) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onPriorityChange,
}: TodoItemProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  // Priority colors
  const priorityColors = {
    low: "bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    medium:
      "bg-blue-200 hover:bg-blue-300 text-blue-800 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800",
    high: "bg-red-200 hover:bg-red-300 text-red-800 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800",
  };

  const priorityIcons = {
    low: <Flag className="h-3 w-3" />,
    medium: <Flag className="h-3 w-3" />,
    high: <Flag className="h-3 w-3" />,
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3 border rounded-lg transition-all",
        "hover:border-primary/50 hover:bg-muted/30",
        todo.completed && "opacity-70 bg-muted",
      )}
    >
      <div className="flex items-center gap-3 flex-grow min-w-0">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          aria-label={
            todo.completed ? t("todo.markIncomplete") : t("todo.markComplete")
          }
          className="h-5 w-5"
        />

        {isEditing ? (
          <Input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="flex-grow"
            aria-label={t("todo.editTodo")}
          />
        ) : (
          <div className="flex flex-col flex-grow min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-foreground transition-all",
                  todo.completed && "line-through text-muted-foreground",
                )}
              >
                {todo.text}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs py-0 px-1.5 h-5 transition-all",
                  priorityColors[todo.priority],
                )}
              >
                {priorityIcons[todo.priority]}
                <span className="ml-1 text-[10px]">
                  {t(`todo.priority.${todo.priority}`)}
                </span>
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {todo.completed && todo.completedAt
                ? t("todo.completedOn", {
                    date: format(new Date(todo.completedAt), "PP"),
                  })
                : format(new Date(todo.createdAt), "PP")}
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label={t("todo.options")}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>{t("todo.edit")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onPriorityChange(todo.id, "high")}
              className="text-red-600 dark:text-red-400"
            >
              <Flag className="mr-2 h-4 w-4" />
              <span>{t("todo.priority.high")}</span>
              {todo.priority === "high" && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPriorityChange(todo.id, "medium")}
              className="text-blue-600 dark:text-blue-400"
            >
              <Flag className="mr-2 h-4 w-4" />
              <span>{t("todo.priority.medium")}</span>
              {todo.priority === "medium" && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPriorityChange(todo.id, "low")}
              className="text-slate-600 dark:text-slate-400"
            >
              <Flag className="mr-2 h-4 w-4" />
              <span>{t("todo.priority.low")}</span>
              {todo.priority === "low" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(todo.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{t("todo.delete")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
