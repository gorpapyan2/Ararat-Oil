import { create } from "zustand";
import { persist } from "zustand/middleware";
import logger from "@/services/logger";
import { Toast, ToastType } from "@/types/toast";
import { Theme, THEME_CONFIG } from "@/core/config";

/**
 * Maximum number of toasts to display at once
 */
const TOAST_LIMIT = 5;

/**
 * Storage key for persisting app state
 */
const STORAGE_KEY = "ararat-oil-app-storage";

/**
 * Application state interface
 */
export interface AppState {
  // Theme state
  theme: Theme;
  setTheme: (theme: Theme) => void;

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

/**
 * Application state store
 * 
 * Manages global application state including:
 * - Theme preferences
 * - Toast notifications
 * - Sidebar state
 * - Loading states
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme state
      theme: THEME_CONFIG.DEFAULT_THEME,
      setTheme: (theme) => {
        set({ theme });

        // Apply the theme to the document
        if (theme === "system") {
          const systemTheme = window.matchMedia(THEME_CONFIG.SYSTEM_DARK_MODE_QUERY)
            .matches
            ? THEME_CONFIG.THEME_CLASSES.DARK
            : THEME_CONFIG.THEME_CLASSES.LIGHT;
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
      name: STORAGE_KEY,
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

/**
 * Type-safe selectors for app state
 */

/**
 * Select current theme
 */
export const selectTheme = (state: AppState): Theme => state.theme;

/**
 * Select current toasts
 */
export const selectToasts = (state: AppState): Toast[] => state.toasts;

/**
 * Select sidebar collapsed state
 */
export const selectSidebarCollapsed = (state: AppState): boolean => 
  state.sidebarCollapsed;

/**
 * Select mobile sidebar open state
 */
export const selectMobileSidebarOpen = (state: AppState): boolean => 
  state.mobileSidebarOpen;

/**
 * Select loading state
 */
export const selectIsLoading = (state: AppState): boolean => 
  state.isLoading;

/**
 * Select loading text
 */
export const selectLoadingText = (state: AppState): string | null => 
  state.loadingText;

/**
 * Initialize theme listener to respond to system theme changes
 * 
 * @returns Cleanup function to remove event listeners
 */
export const initThemeListener = () => {
  // Get the current theme from storage or use system default
  const storedTheme = localStorage.getItem(STORAGE_KEY);
  let initialTheme: Theme = THEME_CONFIG.DEFAULT_THEME;

  if (storedTheme) {
    try {
      const parsedState = JSON.parse(storedTheme);
      if (parsedState.state && parsedState.state.theme) {
        initialTheme = parsedState.state.theme as Theme;
      }
    } catch (e) {
      console.error("Failed to parse stored theme", e);
    }
  }

  // Apply the initial theme
  if (initialTheme === "system") {
    const systemTheme = window.matchMedia(THEME_CONFIG.SYSTEM_DARK_MODE_QUERY)
      .matches
      ? THEME_CONFIG.THEME_CLASSES.DARK
      : THEME_CONFIG.THEME_CLASSES.LIGHT;
    document.documentElement.className = systemTheme;

    // Set up listener for system theme changes
    const mediaQuery = window.matchMedia(THEME_CONFIG.SYSTEM_DARK_MODE_QUERY);

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches 
        ? THEME_CONFIG.THEME_CLASSES.DARK 
        : THEME_CONFIG.THEME_CLASSES.LIGHT;
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