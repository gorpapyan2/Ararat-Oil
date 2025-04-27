import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Flag } from "lucide-react";
import { TodoItem } from "@/store/useTodoStore";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface TodoFormProps {
  onAddTodo: (text: string, priority: TodoItem["priority"]) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<TodoItem["priority"]>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text, priority);
      setText("");
      // Keep the priority as is for the next todo
    }
  };

  const priorityColors = {
    low: "data-[state=on]:bg-slate-200 data-[state=on]:text-slate-800 dark:data-[state=on]:bg-slate-800 dark:data-[state=on]:text-slate-200",
    medium:
      "data-[state=on]:bg-blue-200 data-[state=on]:text-blue-800 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-200",
    high: "data-[state=on]:bg-red-200 data-[state=on]:text-red-800 dark:data-[state=on]:bg-red-900 dark:data-[state=on]:text-red-200",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-stretch gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("todo.inputPlaceholder")}
          aria-label={t("todo.inputPlaceholder")}
          className="flex-grow"
        />
        <Button
          type="submit"
          disabled={!text.trim()}
          aria-label={t("todo.addTodo")}
        >
          {t("todo.addTodo")}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground mr-2">
          {t("todo.priority.label")}:
        </span>
        <ToggleGroup
          type="single"
          value={priority}
          onValueChange={(value) => {
            if (value) setPriority(value as TodoItem["priority"]);
          }}
          className="border rounded-md"
        >
          <ToggleGroupItem
            value="low"
            aria-label={t("todo.priority.low")}
            className={cn(
              "flex items-center gap-1 text-xs",
              priorityColors.low,
            )}
          >
            <Flag className="h-3 w-3" />
            <span>{t("todo.priority.low")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="medium"
            aria-label={t("todo.priority.medium")}
            className={cn(
              "flex items-center gap-1 text-xs",
              priorityColors.medium,
            )}
          >
            <Flag className="h-3 w-3" />
            <span>{t("todo.priority.medium")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="high"
            aria-label={t("todo.priority.high")}
            className={cn(
              "flex items-center gap-1 text-xs",
              priorityColors.high,
            )}
          >
            <Flag className="h-3 w-3" />
            <span>{t("todo.priority.high")}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </form>
  );
}
