import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/primitives/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";

// Define the Todo item type
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Create a form schema for validation
const formSchema = z.object({
  todo: z.string().min(1, "Todo cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Create TodoPage component", completed: true },
    { id: "2", text: "Fix UI component imports", completed: true },
    { id: "3", text: "Implement TodoPage functionality", completed: false },
  ]);

  // Set up the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo: "",
    },
  });

  // Add a new todo
  const onSubmit = (data: FormValues) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(2, 9),
      text: data.todo,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
    form.reset();
  };

  // Toggle todo completion status
  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>
            Manage your tasks with this simple todo list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="todo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add New Todo</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Enter a task..." {...field} />
                      </FormControl>
                      <Button type="submit">Add</Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-medium">Your Todos</h3>
            {todos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No todos yet. Add one above.
              </p>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between p-3 bg-card rounded-md border"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="h-4 w-4"
                      />
                      <span
                        className={`${
                          todo.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {todos.filter((t) => t.completed).length} of {todos.length}{" "}
            completed
          </div>
          {todos.length > 0 && (
            <Button
              variant="outline"
              onClick={() =>
                setTodos((prev) => prev.filter((t) => !t.completed))
              }
            >
              Clear completed
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TodoPage;
