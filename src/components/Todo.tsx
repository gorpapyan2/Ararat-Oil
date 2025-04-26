import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { X } from "lucide-react";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "./ui/toggle-group";
import { useTranslation } from "react-i18next";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

export const TodoList = () => {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    // Initialize from localStorage or empty array
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (inputValue.trim() === "") return;
    
    setTodos([
      ...todos,
      {
        id: uuidv4(),
        text: inputValue,
        completed: false,
      },
    ]);
    setInputValue("");
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // "all" filter
  });

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{t("todo.listTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder={t("todo.inputPlaceholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={t("todo.inputPlaceholder")}
          />
          <Button onClick={handleAddTodo} aria-label={t("todo.addTodo")}>
            {t("todo.addTodo")}
          </Button>
        </div>

        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {filter === "all" 
                ? t("todo.noTodos") 
                : filter === "active" 
                  ? t("todo.noActiveTodos") 
                  : t("todo.noCompletedTodos")}
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTodo(todo.id)}
                    aria-label={t(todo.completed ? "todo.markIncomplete" : "todo.markComplete")}
                  />
                  <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                    {todo.text}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTodo(todo.id)}
                  aria-label={t("todo.deleteTodo")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-muted-foreground">
            {todos.filter(t => !t.completed).length} {t("todo.itemsLeft")}
          </span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearCompleted}
            aria-label={t("todo.clearCompleted")}
            className="text-sm"
          >
            {t("todo.clearCompleted")}
          </Button>
        </div>
        
        <ToggleGroup type="single" value={filter} onValueChange={(value) => setFilter(value as FilterType || "all")}>
          <ToggleGroupItem value="all" aria-label={t("todo.all")}>{t("todo.all")}</ToggleGroupItem>
          <ToggleGroupItem value="active" aria-label={t("todo.active")}>{t("todo.active")}</ToggleGroupItem>
          <ToggleGroupItem value="completed" aria-label={t("todo.completed")}>{t("todo.completed")}</ToggleGroupItem>
        </ToggleGroup>
      </CardFooter>
    </Card>
  );
};

export default TodoList; 