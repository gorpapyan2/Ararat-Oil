import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useAppStore,
  selectTheme,
  selectToasts,
  selectSidebarCollapsed,
  selectMobileSidebarOpen,
  selectIsLoading,
  selectLoadingText,
} from "../appStore";
import { THEME_CONFIG } from "@/core/config";
import { AppState } from "../appStore";
// Mock UUID for predictable toast IDs
vi.mock("uuid", () => ({
  v4: () => "test-id",
}));

// Mock logger
vi.mock("@/services/logger", () => ({
  default: {
    trackAction: vi.fn(),
  },
}));

describe("appStore", () => {
  beforeEach(() => {
    // Reset the store before each test
    act(() => {
      useAppStore.setState({
        theme: THEME_CONFIG.DEFAULT_THEME,
        toasts: [],
        sidebarCollapsed: false,
        mobileSidebarOpen: false,
        isLoading: false,
        loadingText: null,
      } as unknown as AppState); // true replaces the state instead of merging it
    });

    // Mock document.documentElement.className
    Object.defineProperty(document.documentElement, "className", {
      writable: true,
      value: "",
    });
  });

  describe("theme management", () => {
    it("should set theme correctly", () => {
      const { result } = renderHook(() => useAppStore());

      // Test setting to dark theme
      act(() => {
        result.current.setTheme("dark");
      });

      expect(selectTheme(result.current)).toBe("dark");
      expect(document.documentElement.className).toBe("dark");

      // Test setting to light theme
      act(() => {
        result.current.setTheme("light");
      });

      expect(selectTheme(result.current)).toBe("light");
      expect(document.documentElement.className).toBe("light");
    });

    it("should handle system theme", () => {
      const { result } = renderHook(() => useAppStore());

      // Mock matchMedia for dark mode
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: true, // simulating dark mode
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      act(() => {
        result.current.setTheme("system");
      });

      expect(selectTheme(result.current)).toBe("system");
      expect(document.documentElement.className).toBe(
        THEME_CONFIG.THEME_CLASSES.DARK
      );

      // Mock matchMedia for light mode
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false, // simulating light mode
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      act(() => {
        result.current.setTheme("system");
      });

      expect(document.documentElement.className).toBe(
        THEME_CONFIG.THEME_CLASSES.LIGHT
      );
    });
  });

  describe("toast management", () => {
    it("should add and remove toasts", () => {
      const { result } = renderHook(() => useAppStore());

      expect(selectToasts(result.current)).toHaveLength(0);

      const toast = {
        id: "test-id",
        title: "Test Toast",
        message: "This is a test toast",
        duration: 5000,
        type: "info" as const,
        createdAt: new Date(),
      };

      act(() => {
        result.current.addToast(toast);
      });

      expect(selectToasts(result.current)).toHaveLength(1);
      expect(selectToasts(result.current)[0].title).toBe("Test Toast");

      act(() => {
        result.current.removeToast("test-id");
      });

      expect(selectToasts(result.current)).toHaveLength(0);
    });

    it("should update toast", () => {
      const { result } = renderHook(() => useAppStore());

      const toast = {
        id: "test-id",
        title: "Test Toast",
        message: "This is a test toast",
        duration: 5000,
        type: "info" as const,
        createdAt: new Date(),
      };

      act(() => {
        result.current.addToast(toast);
      });

      act(() => {
        result.current.updateToast("test-id", {
          title: "Updated Toast",
          type: "success" as const,
        });
      });

      const updatedToast = selectToasts(result.current)[0];
      expect(updatedToast.title).toBe("Updated Toast");
      expect(updatedToast.type).toBe("success");
      expect(updatedToast.message).toBe("This is a test toast"); // Unchanged
    });

    it("should clear all toasts", () => {
      const { result } = renderHook(() => useAppStore());

      const toast1 = {
        id: "test-id-1",
        title: "Toast 1",
        message: "This is toast 1",
        duration: 5000,
        type: "info" as const,
        createdAt: new Date(),
      };

      const toast2 = {
        id: "test-id-2",
        title: "Toast 2",
        message: "This is toast 2",
        duration: 5000,
        type: "warning" as const,
        createdAt: new Date(),
      };

      act(() => {
        result.current.addToast(toast1);
        result.current.addToast(toast2);
      });

      expect(selectToasts(result.current)).toHaveLength(2);

      act(() => {
        result.current.clearToasts();
      });

      expect(selectToasts(result.current)).toHaveLength(0);
    });
  });

  describe("sidebar state", () => {
    it("should toggle sidebar collapsed state", () => {
      const { result } = renderHook(() => useAppStore());

      expect(selectSidebarCollapsed(result.current)).toBe(false);

      act(() => {
        result.current.setSidebarCollapsed(true);
      });

      expect(selectSidebarCollapsed(result.current)).toBe(true);
    });

    it("should toggle mobile sidebar state", () => {
      const { result } = renderHook(() => useAppStore());

      expect(selectMobileSidebarOpen(result.current)).toBe(false);

      act(() => {
        result.current.setMobileSidebarOpen(true);
      });

      expect(selectMobileSidebarOpen(result.current)).toBe(true);
    });
  });

  describe("loading state", () => {
    it("should set loading state", () => {
      const { result } = renderHook(() => useAppStore());

      expect(selectIsLoading(result.current)).toBe(false);
      expect(selectLoadingText(result.current)).toBeNull();

      act(() => {
        result.current.setIsLoading(true);
        result.current.setLoadingText("Loading data...");
      });

      expect(selectIsLoading(result.current)).toBe(true);
      expect(selectLoadingText(result.current)).toBe("Loading data...");

      act(() => {
        result.current.setIsLoading(false);
        result.current.setLoadingText(null);
      });

      expect(selectIsLoading(result.current)).toBe(false);
      expect(selectLoadingText(result.current)).toBeNull();
    });
  });
});
