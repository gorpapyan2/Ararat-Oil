import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { TodoItem as TodoItemType, SortType } from '@/types/todo';
import { TodoItem } from './TodoItem';
import { TodoFilter } from './TodoFilter';
import { TodoFormStandardized } from './TodoFormStandardized';
import { useTodoStore } from '@/store/useTodoStore';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function TodoList() {
  const { t } = useTranslation();
  const {
    todos,
    filter,
    sort,
    search,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
    setSort,
    setSearch,
    updatePriority,
  } = useTodoStore();

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    // First, filter by search term
    let filtered = todos.filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase()),
    );

    // Then filter by status
    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }

    // Finally, sort
    return [...filtered].sort((a, b) => {
      if (sort === "newest") {
        return b.createdAt - a.createdAt;
      } else if (sort === "oldest") {
        return a.createdAt - b.createdAt;
      } else if (sort === "alphabetical") {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });
  }, [todos, filter, sort, search]);

  // Count todos by status for the filter UI
  const totalTodos = todos.length;
  const activeTodos = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.filter((todo) => todo.completed).length;

  // Check if there are any completed todos
  const hasCompletedTodos = completedTodos > 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{t("todo.listTitle")}</CardTitle>
        <CardDescription className="text-center">
          {t("todo.listDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <TodoFormStandardized 
          onSubmit={(data) => addTodo(data.text, data.priority)} 
        />

        <TodoFilter
          filter={filter}
          sort={sort}
          search={search}
          onFilterChange={setFilter}
          onSortChange={setSort}
          onSearchChange={setSearch}
          totalTodos={totalTodos}
          activeTodos={activeTodos}
          completedTodos={completedTodos}
        />

        <div>
          {filteredAndSortedTodos.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {search ? (
                <p>{t("todo.noSearchResults")}</p>
              ) : filter === "all" ? (
                <p>{t("todo.noTodos")}</p>
              ) : filter === "active" ? (
                <p>{t("todo.noActiveTodos")}</p>
              ) : (
                <p>{t("todo.noCompletedTodos")}</p>
              )}
            </div>
          ) : (
            <ScrollArea
              className={cn(
                "border rounded-md",
                filteredAndSortedTodos.length > 6
                  ? "h-[420px]"
                  : "max-h-[420px]",
              )}
            >
              <div className="p-3 space-y-3">
                {filteredAndSortedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                    onPriorityChange={updatePriority}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {activeTodos} {t("todo.itemsLeft")}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCompleted}
          disabled={!hasCompletedTodos}
          aria-label={t("todo.clearCompleted")}
        >
          {t("todo.clearCompleted")}
        </Button>
      </CardFooter>
    </Card>
  );
}
