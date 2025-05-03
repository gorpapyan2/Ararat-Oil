import { create } from "zustand";
import { persist } from "zustand/middleware";
import logger from "@/services/logger";
import { Toast, ToastType } from "@/types/toast";

// Define the maximum number of toasts to display at once
const TOAST_LIMIT = 5;

// Define the shape of our store
interface AppState {
  // Theme state
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Toast notifications state
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, partialToast: Partial<Toast>) => void;
  clearToasts: () => void;

  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingText: string | null;
  setLoadingText: (text: string | null) => void;
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme state
      theme: "system",
      setTheme: (theme) => {
        set({ theme });

        // Apply the theme to the document
        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          document.documentElement.className = systemTheme;
        } else {
          document.documentElement.className = theme;
        }

        logger.trackAction("changed_theme", { theme });
      },

      // Toast notifications state
      toasts: [],
      addToast: (toast) => {
        set((state) => ({
          // Add the toast to the beginning of the array and limit the total number
          toasts: [toast, ...state.toasts].slice(0, TOAST_LIMIT),
        }));
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      updateToast: (id, partialToast) =>
        set((state) => ({
          toasts: state.toasts.map((toast) =>
            toast.id === id ? { ...toast, ...partialToast } : toast
          ),
        })),
      clearToasts: () => set({ toasts: [] }),

      // Sidebar state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      mobileSidebarOpen: false,
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      loadingText: null,
      setLoadingText: (text) => set({ loadingText: text }),
    }),
    {
      name: "ararat-oil-app-storage",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

// Create a hook to listen for system theme changes
export const initThemeListener = () => {
  // Get the current theme from storage or use system default
  const storedTheme = localStorage.getItem("ararat-oil-app-storage");
  let initialTheme: "light" | "dark" | "system" = "system";

  if (storedTheme) {
    try {
      const parsedState = JSON.parse(storedTheme);
      if (parsedState.state && parsedState.state.theme) {
        initialTheme = parsedState.state.theme;
      }
    } catch (e) {
      console.error("Failed to parse stored theme", e);
    }
  }

  // Apply the initial theme
  if (initialTheme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    document.documentElement.className = systemTheme;

    // Set up listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      document.documentElement.className = newTheme;
    };

    mediaQuery.addEventListener("change", handleChange);

    // Return cleanup function
    return () => mediaQuery.removeEventListener("change", handleChange);
  } else {
    // Apply saved theme
    document.documentElement.className = initialTheme;
  }

  return () => {}; // No cleanup needed for non-system themes
};

export default useAppStore;
