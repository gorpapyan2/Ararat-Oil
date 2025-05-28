import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useTodoStore,
  getFilteredTodos,
  selectTotalTodos,
  selectActiveTodos,
  selectCompletedTodos,
  selectHasCompletedTodos,
} from "../todoStore";

// Mock UUID to have predictable IDs in tests
vi.mock("uuid", () => ({
  v4: () => "test-id",
}));

describe("todoStore", () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = useTodoStore.getState();
    act(() => {
      useTodoStore.setState({
        todos: [],
        filter: "all",
        sort: "newest",
        search: "",
      }); // replaces the state instead of merging it
    });
  });

  describe("basic actions", () => {
    it("should add a todo", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Test todo", "medium");
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0]).toEqual({
        id: "test-id",
        text: "Test todo",
        completed: false,
        createdAt: expect.any(Number),
        priority: "medium",
      });
    });

    it("should toggle a todo", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Test todo");
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.todos[0].completed).toBe(true);
      expect(result.current.todos[0].completedAt).toBeDefined();

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.todos[0].completed).toBe(false);
      expect(result.current.todos[0].completedAt).toBeUndefined();
    });

    it("should delete a todo", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Test todo");
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(todoId);
      });

      expect(result.current.todos).toHaveLength(0);
    });

    it("should edit a todo", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Test todo");
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.editTodo(todoId, "Updated todo");
      });

      expect(result.current.todos[0].text).toBe("Updated todo");
    });

    it("should clear completed todos", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Todo 1");
        result.current.addTodo("Todo 2");
      });

      const todo1Id = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(todo1Id);
      });

      expect(result.current.todos).toHaveLength(2);

      act(() => {
        result.current.clearCompleted();
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe("Todo 2");
    });

    it("should update priority", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Test todo", "medium");
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.updatePriority(todoId, "high");
      });

      expect(result.current.todos[0].priority).toBe("high");
    });
  });

  describe("filter and search", () => {
    it("should filter todos by status", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Todo 1");
        result.current.addTodo("Todo 2");
        result.current.toggleTodo(result.current.todos[0].id);
      });

      // Test 'active' filter
      act(() => {
        result.current.setFilter("active");
      });

      const activeTodos = getFilteredTodos(result.current);
      expect(activeTodos).toHaveLength(1);
      expect(activeTodos[0].text).toBe("Todo 2");

      // Test 'completed' filter
      act(() => {
        result.current.setFilter("completed");
      });

      const completedTodos = getFilteredTodos(result.current);
      expect(completedTodos).toHaveLength(1);
      expect(completedTodos[0].text).toBe("Todo 1");
    });

    it("should sort todos", () => {
      const { result } = renderHook(() => useTodoStore());

      // Mock Date.now to have predictable timestamps
      const originalDateNow = Date.now;
      let mockTime = 1000;

      Date.now = vi.fn(() => mockTime);

      act(() => {
        result.current.addTodo("B Todo", "medium");
        mockTime += 1000;
        result.current.addTodo("A Todo", "high");
        mockTime += 1000;
        result.current.addTodo("C Todo", "low");
      });

      // Test 'newest' sort (default)
      let sorted = getFilteredTodos(result.current);
      expect(sorted[0].text).toBe("C Todo");
      expect(sorted[1].text).toBe("A Todo");
      expect(sorted[2].text).toBe("B Todo");

      // Test 'oldest' sort
      act(() => {
        result.current.setSort("oldest");
      });

      sorted = getFilteredTodos(result.current);
      expect(sorted[0].text).toBe("B Todo");
      expect(sorted[1].text).toBe("A Todo");
      expect(sorted[2].text).toBe("C Todo");

      // Test 'alphabetical' sort
      act(() => {
        result.current.setSort("alphabetical");
      });

      sorted = getFilteredTodos(result.current);
      expect(sorted[0].text).toBe("A Todo");
      expect(sorted[1].text).toBe("B Todo");
      expect(sorted[2].text).toBe("C Todo");

      // Test 'priority' sort
      act(() => {
        result.current.setSort("priority");
      });

      sorted = getFilteredTodos(result.current);
      expect(sorted[0].text).toBe("A Todo"); // high
      expect(sorted[1].text).toBe("B Todo"); // medium
      expect(sorted[2].text).toBe("C Todo"); // low

      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it("should search todos", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("First task");
        result.current.addTodo("Second job");
        result.current.addTodo("Third assignment");
      });

      act(() => {
        result.current.setSearch("task");
      });

      const searchResults = getFilteredTodos(result.current);
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].text).toBe("First task");
    });
  });

  describe("selectors", () => {
    it("should count todos correctly", () => {
      const { result } = renderHook(() => useTodoStore());

      expect(selectTotalTodos(result.current)).toBe(0);

      act(() => {
        result.current.addTodo("Todo 1");
        result.current.addTodo("Todo 2");
        result.current.toggleTodo(result.current.todos[0].id);
      });

      expect(selectTotalTodos(result.current)).toBe(2);
      expect(selectActiveTodos(result.current)).toBe(1);
      expect(selectCompletedTodos(result.current)).toBe(1);
      expect(selectHasCompletedTodos(result.current)).toBe(true);

      act(() => {
        result.current.clearCompleted();
      });

      expect(selectTotalTodos(result.current)).toBe(1);
      expect(selectActiveTodos(result.current)).toBe(1);
      expect(selectCompletedTodos(result.current)).toBe(0);
      expect(selectHasCompletedTodos(result.current)).toBe(false);
    });
  });
});
